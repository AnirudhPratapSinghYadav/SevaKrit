import { describe, expect, it } from "vitest";
import { selectRuleVersion, type RuleSelection } from "../domain/ruleSelection";
import {
  RuleVersionSchema,
  type HouseholdProfile,
  type RuleVersion,
  type SourceRecord,
} from "../domain/types";
import {
  FACT,
  SYNTHETIC_SCHEME_ID,
  allSources,
  rule,
  ruleVersion,
  standardRules,
  staleSource,
  syntheticScheme,
  verifiedSource,
} from "./fixtures";
import {
  evaluatePublishedSchemes,
  evaluateSchemeForDate,
  planSchemes,
} from "../services/evaluatePublished";

// Fixed instant; the real clock is never read. asOf is its UTC date.
const NOW_ISO = "2025-06-01T06:00:00.000Z";
const AS_OF = "2025-06-01";

/** Synthetic version with the standard rule set; effectiveTo is set only when given. */
function version(id: string, effectiveAt: string, effectiveTo?: string): RuleVersion {
  const base = ruleVersion(standardRules(), { id, effectiveAt });
  return effectiveTo === undefined ? base : { ...base, effectiveTo };
}

function selectedId(sel: RuleSelection): string | undefined {
  return sel.kind === "selected" ? sel.version.id : undefined;
}

const fittingFacts: HouseholdProfile["confirmedFacts"] = {
  [FACT.size]: 4,
  [FACT.income]: 100000,
  [FACT.district]: "alpha",
  [FACT.proofX]: true,
  [FACT.proofY]: false,
  [FACT.disqualifier]: false,
};

const fittingProfile: HouseholdProfile = { confirmedFacts: fittingFacts, unknownFacts: [] };

// Same facts, but household size 9 breaks the at_most 5 rule.
const failingProfile: HouseholdProfile = {
  confirmedFacts: { ...fittingFacts, [FACT.size]: 9 },
  unknownFacts: [],
};

const PM_JANMAN_ID = "pm-janman-housing-mp";

const janmanProfile: HouseholdProfile = {
  confirmedFacts: {
    tribalGroup: "Baiga",
    district: "Dindori",
    houseType: "kutcha",
    settlementArea: "rural",
    hasGovernmentEmployee: false,
  },
  unknownFacts: [],
};

describe("rule version selection by date interval", () => {
  it("selects the one active version for the date", () => {
    const sel = selectRuleVersion([version("rv-active", "2025-01-01")], SYNTHETIC_SCHEME_ID, AS_OF);
    expect(sel.kind).toBe("selected");
    expect(selectedId(sel)).toBe("rv-active");
  });

  it("returns none when only a future version exists", () => {
    const sel = selectRuleVersion([version("rv-future", "2025-09-01")], SYNTHETIC_SCHEME_ID, AS_OF);
    expect(sel.kind).toBe("none");
  });

  it("reports a conflict with both overlapping ids sorted", () => {
    const sel = selectRuleVersion(
      [version("rv-b", "2025-01-01"), version("rv-a", "2025-02-01")],
      SYNTHETIC_SCHEME_ID,
      AS_OF,
    );
    expect(sel).toEqual({ kind: "conflict", versionIds: ["rv-a", "rv-b"] });
  });

  it("reports a conflict when two versions have identical start dates", () => {
    const sel = selectRuleVersion(
      [version("rv-x", "2025-01-01"), version("rv-y", "2025-01-01")],
      SYNTHETIC_SCHEME_ID,
      AS_OF,
    );
    expect(sel).toEqual({ kind: "conflict", versionIds: ["rv-x", "rv-y"] });
  });

  it("start date is inclusive: applicable on effectiveAt, not the day before", () => {
    const versions = [version("rv-start", "2025-03-01")];
    expect(selectedId(selectRuleVersion(versions, SYNTHETIC_SCHEME_ID, "2025-03-01"))).toBe("rv-start");
    expect(selectRuleVersion(versions, SYNTHETIC_SCHEME_ID, "2025-02-28").kind).toBe("none");
  });

  it("end date is exclusive: not applicable on effectiveTo, applicable the day before", () => {
    const versions = [version("rv-end", "2025-01-01", "2025-03-01")];
    expect(selectRuleVersion(versions, SYNTHETIC_SCHEME_ID, "2025-03-01").kind).toBe("none");
    expect(selectedId(selectRuleVersion(versions, SYNTHETIC_SCHEME_ID, "2025-02-28"))).toBe("rv-end");
  });

  it("adjacent versions select exactly one version on the boundary day, with no conflict", () => {
    const versions = [
      version("rv-a", "2025-01-01", "2025-03-01"),
      version("rv-b", "2025-03-01"),
    ];
    const sel = selectRuleVersion(versions, SYNTHETIC_SCHEME_ID, "2025-03-01");
    expect(sel.kind).toBe("selected");
    expect(selectedId(sel)).toBe("rv-b");
  });

  it("gap between versions selects none inside the gap", () => {
    const versions = [
      version("rv-a", "2025-01-01", "2025-02-01"),
      version("rv-b", "2025-03-01"),
    ];
    expect(selectRuleVersion(versions, SYNTHETIC_SCHEME_ID, "2025-02-15").kind).toBe("none");
  });

  it("a future version (effectiveAt after asOf) is not applicable", () => {
    const sel = selectRuleVersion([version("rv-later", "2025-06-02")], SYNTHETIC_SCHEME_ID, AS_OF);
    expect(sel.kind).toBe("none");
  });

  it("rejects invalid intervals and malformed dates, and throws for a malformed asOf", () => {
    const base = ruleVersion(standardRules(), { id: "rv-bad", effectiveAt: "2025-03-01" });

    // effectiveTo equal to effectiveAt, and earlier than effectiveAt.
    expect(RuleVersionSchema.safeParse({ ...base, effectiveTo: "2025-03-01" }).success).toBe(false);
    expect(RuleVersionSchema.safeParse({ ...base, effectiveTo: "2025-02-01" }).success).toBe(false);
    // Malformed calendar date.
    expect(RuleVersionSchema.safeParse({ ...base, effectiveTo: "2025-13-40" }).success).toBe(false);

    expect(() => selectRuleVersion([base], SYNTHETIC_SCHEME_ID, "2025/06/01")).toThrow(RangeError);
  });

  it("open-ended legacy version (no effectiveTo) applies on and after its start, including far future", () => {
    const versions = [version("rv-open", "2025-01-01")];
    expect(selectedId(selectRuleVersion(versions, SYNTHETIC_SCHEME_ID, "2025-01-01"))).toBe("rv-open");
    expect(selectedId(selectRuleVersion(versions, SYNTHETIC_SCHEME_ID, AS_OF))).toBe("rv-open");
    expect(selectedId(selectRuleVersion(versions, SYNTHETIC_SCHEME_ID, "2099-12-31"))).toBe("rv-open");
  });

  it("conflicting versions through evaluateSchemeForDate give source_review_needed with both ids", () => {
    const a = version("rv-a", "2025-01-01");
    const b = version("rv-b", "2025-02-01");
    for (const profile of [fittingProfile, failingProfile]) {
      const detail = evaluateSchemeForDate(syntheticScheme, profile, NOW_ISO, [a, b], allSources);
      expect(detail.assessment.outcome).toBe("source_review_needed");
      expect(detail.assessment.conflictingRuleVersionIds).toEqual(["rv-a", "rv-b"]);
      expect(["likely_fit", "likely_mismatch"]).not.toContain(detail.assessment.outcome);
    }
  });

  it("a stale or unverified source with a single selected version gives source_review_needed", () => {
    // One ungrouped rule, so the source gate (not OR-group logic) decides the outcome.
    // fittingProfile has size 4, which passes at_most 5.
    const single = ruleVersion(
      [rule("r-single", FACT.size, "at_most", 5, { sourceId: verifiedSource.id })],
      { id: "rv-single", effectiveAt: "2025-01-01" },
    );
    const sources: SourceRecord[] = [{ ...verifiedSource, status: "unverified" }, staleSource];
    const detail = evaluateSchemeForDate(syntheticScheme, fittingProfile, NOW_ISO, [single], sources);
    expect(detail.assessment.ruleVersionId).toBe("rv-single");
    expect(detail.assessment.outcome).toBe("source_review_needed");
  });

  it("agreement: evaluatePublishedSchemes, planSchemes and evaluateSchemeForDate report the same rule version", () => {
    const all = evaluatePublishedSchemes(janmanProfile, NOW_ISO);
    const entry = all.find((item) => item.scheme.id === PM_JANMAN_ID);
    if (entry === undefined) throw new Error(`${PM_JANMAN_ID} is not in the published schemes`);

    const direct = evaluateSchemeForDate(entry.scheme, janmanProfile, NOW_ISO);
    expect(entry.detail.assessment.ruleVersionId).toBe(direct.assessment.ruleVersionId);
    expect(entry.detail.assessment.ruleVersionId).toBe("pm-janman-housing-mp:v1");

    const planned = planSchemes(janmanProfile, NOW_ISO, [
      "likely_fit",
      "needs_information",
      "likely_mismatch",
      "source_review_needed",
    ]).find((item) => item.scheme.id === PM_JANMAN_ID);
    if (planned === undefined) throw new Error(`${PM_JANMAN_ID} is missing from planSchemes output`);
    expect(planned.detail.assessment.ruleVersionId).toBe(entry.detail.assessment.ruleVersionId);
  });

  it("overlap never gives a confident decision for a fitting or a failing profile", () => {
    const a = version("rv-overlap-a", "2025-01-01");
    const b = { ...version("rv-overlap-b", "2025-03-01"), rules: [rule("r-only", FACT.size, "at_most", 5)] };
    for (const profile of [fittingProfile, failingProfile]) {
      const detail = evaluateSchemeForDate(syntheticScheme, profile, NOW_ISO, [a, b], allSources);
      expect(detail.assessment.outcome).toBe("source_review_needed");
    }
  });
});
