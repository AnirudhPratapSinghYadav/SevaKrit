import { describe, expect, it } from "vitest";
import { evaluateScheme, evaluateSchemeDetailed } from "../domain/evaluate";
import type { HouseholdProfile, Rule } from "../domain/types";
import { syntheticProfiles } from "../data/sampleProfiles";
import {
  FACT,
  NOW,
  allSources,
  rule,
  ruleVersion,
  standardRules,
  staleSource,
  syntheticScheme,
  unverifiedSource,
  verifiedSource,
} from "./fixtures";

// All names, values and thresholds in this file are SYNTHETIC test fixtures.

const allPassProfile: HouseholdProfile = {
  confirmedFacts: {
    [FACT.size]: 5,
    [FACT.income]: 300000,
    [FACT.district]: "alpha",
    [FACT.proofX]: true,
    [FACT.proofY]: false,
    [FACT.disqualifier]: false,
  },
  unknownFacts: [],
};

function withFacts(overrides: HouseholdProfile["confirmedFacts"]): HouseholdProfile {
  return { confirmedFacts: { ...allPassProfile.confirmedFacts, ...overrides }, unknownFacts: [] };
}

function without(key: string): HouseholdProfile {
  const confirmedFacts = { ...allPassProfile.confirmedFacts };
  delete confirmedFacts[key];
  return { confirmedFacts, unknownFacts: [] };
}

function evaluate(rules: Rule[], profile: HouseholdProfile, sources = allSources) {
  return evaluateScheme(syntheticScheme, ruleVersion(rules), profile, sources, NOW);
}

describe("evaluateScheme: AND semantics", () => {
  it("passes when every ungrouped rule passes", () => {
    const rules = [rule("a", FACT.size, "at_most", 5), rule("b", FACT.income, "at_most", 300000)];
    const result = evaluate(rules, allPassProfile);
    expect(result.outcome).toBe("likely_fit");
    expect(result.passed).toEqual(["a", "b"]);
  });

  it("fails the household when any ungrouped rule fails", () => {
    const rules = [rule("a", FACT.size, "at_most", 5), rule("b", FACT.income, "at_most", 300000)];
    const result = evaluate(rules, withFacts({ [FACT.income]: 300001 }));
    expect(result.outcome).toBe("likely_mismatch");
    expect(result.failed).toEqual(["b"]);
  });

  it("needs information when an ungrouped rule is unknown", () => {
    const rules = [rule("a", FACT.size, "at_most", 5), rule("b", FACT.income, "at_most", 300000)];
    const result = evaluate(rules, without(FACT.income));
    expect(result.outcome).toBe("needs_information");
    expect(result.unknown).toEqual(["b"]);
    expect(result.passed).toEqual(["a"]);
  });
});

describe("evaluateScheme: OR groups", () => {
  const groupRules = [
    rule("p1", FACT.proofX, "is_true", true, { group: "proof" }),
    rule("p2", FACT.proofY, "is_true", true, { group: "proof" }),
  ];

  it("passes the group when any member passes", () => {
    const result = evaluate(groupRules, withFacts({ [FACT.proofX]: false, [FACT.proofY]: true }));
    expect(result.outcome).toBe("likely_fit");
    expect(result.passed).toEqual(["p2"]);
    expect(result.failed).toEqual(["p1"]);
  });

  it("is a mismatch when all group members fail", () => {
    const result = evaluate(groupRules, withFacts({ [FACT.proofX]: false, [FACT.proofY]: false }));
    expect(result.outcome).toBe("likely_mismatch");
  });

  it("is unknown when no member passes and at least one is unknown", () => {
    const profile = without(FACT.proofY);
    profile.confirmedFacts[FACT.proofX] = false;
    const result = evaluate(groupRules, profile);
    expect(result.outcome).toBe("needs_information");
    expect(result.unknown).toEqual(["p2"]);
  });
});

describe("evaluateScheme: exclusion rules", () => {
  const exclusion = [rule("x", FACT.disqualifier, "is_true", true, { exclusion: true })];

  it("fails when the excluded condition holds", () => {
    const result = evaluate(exclusion, withFacts({ [FACT.disqualifier]: true }));
    expect(result.outcome).toBe("likely_mismatch");
    expect(result.failed).toEqual(["x"]);
  });

  it("passes when the excluded condition does not hold", () => {
    const result = evaluate(exclusion, withFacts({ [FACT.disqualifier]: false }));
    expect(result.outcome).toBe("likely_fit");
    expect(result.passed).toEqual(["x"]);
  });

  it("is unknown, not pass, when the excluded fact is missing", () => {
    const result = evaluate(exclusion, without(FACT.disqualifier));
    expect(result.outcome).toBe("needs_information");
    expect(result.passed).toEqual([]);
  });
});

describe("evaluateScheme: boundaries and normalisation", () => {
  it("treats at_most and at_least as inclusive at the boundary", () => {
    const rules = [rule("max", FACT.size, "at_most", 5), rule("min", FACT.size, "at_least", 5)];
    expect(evaluate(rules, withFacts({ [FACT.size]: 5 })).outcome).toBe("likely_fit");
  });

  it("fails just beyond the inclusive boundary", () => {
    const rules = [rule("max", FACT.size, "at_most", 5)];
    expect(evaluate(rules, withFacts({ [FACT.size]: 6 })).outcome).toBe("likely_mismatch");
  });

  it("compares strings trimmed and case-insensitively", () => {
    const rules = [rule("d", FACT.district, "one_of", ["Alpha", "beta"])];
    expect(evaluate(rules, withFacts({ [FACT.district]: "  ALPHA " })).outcome).toBe("likely_fit");
  });

  it("matches equals on normalised strings", () => {
    const rules = [rule("e", FACT.district, "equals", "beta")];
    expect(evaluate(rules, withFacts({ [FACT.district]: " Beta" })).outcome).toBe("likely_fit");
  });
});

describe("evaluateScheme: unknown facts never pass", () => {
  const operatorCases: { operator: Rule["operator"]; value: Rule["value"] }[] = [
    { operator: "equals", value: "x" },
    { operator: "at_least", value: 1 },
    { operator: "at_most", value: 1 },
    { operator: "one_of", value: ["a"] },
    { operator: "is_true", value: true },
    { operator: "is_false", value: false },
  ];

  for (const { operator, value } of operatorCases) {
    it(`never yields likely_fit for an unknown fact with operator ${operator}`, () => {
      const rules = [rule("u", "synthetic_unknown_fact", operator, value)];
      const result = evaluate(rules, { confirmedFacts: {}, unknownFacts: [] });
      expect(result.outcome).not.toBe("likely_fit");
      expect(result.passed).not.toContain("u");
      expect(result.unknown).toEqual(["u"]);
    });
  }

  it("reports a missing fact as unknown rather than failed or passed", () => {
    const { results } = evaluateSchemeDetailed(
      syntheticScheme,
      ruleVersion(standardRules()),
      syntheticProfiles.synthetic_empty!,
      allSources,
      NOW,
    );
    expect(results.every((result) => result.outcome === "unknown")).toBe(true);
  });
});

describe("evaluateScheme: source checks", () => {
  it("turns a pass into source_review_needed when the source is unverified", () => {
    const rules = [rule("a", FACT.size, "at_most", 5, { sourceId: unverifiedSource.id })];
    const result = evaluate(rules, allPassProfile);
    expect(result.outcome).toBe("source_review_needed");
    expect(result.outcome).not.toBe("likely_fit");
  });

  it("turns a pass into source_review_needed when the source is stale", () => {
    const rules = [rule("a", FACT.size, "at_most", 5, { sourceId: staleSource.id })];
    const result = evaluate(rules, allPassProfile);
    expect(result.outcome).toBe("source_review_needed");
    expect(result.outcome).not.toBe("likely_fit");
  });

  it("turns a pass into source_review_needed when the source is missing", () => {
    const rules = [rule("a", FACT.size, "at_most", 5, { sourceId: "src-absent" })];
    const result = evaluate(rules, allPassProfile, [verifiedSource]);
    expect(result.outcome).toBe("source_review_needed");
  });

  it("keeps a mismatch when a verified rule fails even if another rule's source is in review", () => {
    const rules = [
      rule("a", FACT.size, "at_most", 5, { sourceId: unverifiedSource.id }),
      rule("b", FACT.income, "at_most", 300000),
    ];
    expect(evaluate(rules, withFacts({ [FACT.income]: 300001 })).outcome).toBe("likely_mismatch");
  });

  it("does not treat a failed condition as mismatch when that rule's source is unverified", () => {
    const rules = [rule("a", FACT.size, "at_most", 5, { sourceId: unverifiedSource.id })];
    const result = evaluate(rules, withFacts({ [FACT.size]: 99 }));
    expect(result.outcome).toBe("source_review_needed");
    expect(result.failed).toEqual([]);
  });

  it("does not treat a failed condition as mismatch when that rule's source is stale", () => {
    const rules = [rule("a", FACT.size, "at_most", 5, { sourceId: staleSource.id })];
    const result = evaluate(rules, withFacts({ [FACT.size]: 99 }));
    expect(result.outcome).toBe("source_review_needed");
    expect(result.failed).toEqual([]);
  });

  it("does not treat a failed condition as mismatch when that rule's source is conflicting", () => {
    const conflicting = { ...unverifiedSource, id: "src-conflict", status: "conflicting" as const };
    const rules = [rule("a", FACT.size, "at_most", 5, { sourceId: conflicting.id })];
    const result = evaluate(rules, withFacts({ [FACT.size]: 99 }), [conflicting]);
    expect(result.outcome).toBe("source_review_needed");
    expect(result.failed).toEqual([]);
  });

  it("lists the rules' source ids on the assessment", () => {
    const rules = [rule("a", FACT.size, "at_most", 5), rule("b", FACT.income, "at_most", 300000, { sourceId: "src-verified" })];
    expect(evaluate(rules, allPassProfile).sourceIds).toEqual(["src-verified"]);
  });
});

describe("evaluateScheme: effective-date gating", () => {
  it("returns source_review_needed with the reason when the rule version is not yet effective", () => {
    const rv = ruleVersion(standardRules(), { effectiveAt: "2026-01-01" });
    const detail = evaluateSchemeDetailed(syntheticScheme, rv, allPassProfile, allSources, NOW);
    expect(detail.assessment.outcome).toBe("source_review_needed");
    expect(detail.notes).toContain("rule version not yet effective");
    expect(detail.results.every((result) => result.reason === "rule version not yet effective")).toBe(true);
  });

  it("nothing passes while the rule version is not yet effective", () => {
    const rv = ruleVersion(standardRules(), { effectiveAt: "2026-01-01" });
    const assessment = evaluateScheme(syntheticScheme, rv, allPassProfile, allSources, NOW);
    expect(assessment.passed).toEqual([]);
    expect(assessment.failed).toEqual([]);
  });

  it("evaluates normally once the rule version is effective", () => {
    const rv = ruleVersion(standardRules(), { effectiveAt: "2025-06-01" });
    expect(evaluateScheme(syntheticScheme, rv, allPassProfile, allSources, NOW).outcome).toBe("likely_fit");
  });
});

describe("evaluateScheme: assessment identity", () => {
  it("references the scheme and the rule version id", () => {
    const rv = ruleVersion(standardRules(), { id: "synthetic-rv-42" });
    const assessment = evaluateScheme(syntheticScheme, rv, allPassProfile, allSources, NOW);
    expect(assessment.schemeId).toBe(syntheticScheme.id);
    expect(assessment.ruleVersionId).toBe("synthetic-rv-42");
  });
});

describe("evaluateScheme: synthetic households reach three distinct outcomes", () => {
  const rv = ruleVersion(standardRules());

  it("synthetic_a (on the inclusive boundaries) is likely_fit", () => {
    expect(evaluateScheme(syntheticScheme, rv, syntheticProfiles.synthetic_a!, allSources, NOW).outcome).toBe(
      "likely_fit",
    );
  });

  it("synthetic_b (unconfirmed income and proofs) is needs_information", () => {
    expect(evaluateScheme(syntheticScheme, rv, syntheticProfiles.synthetic_b!, allSources, NOW).outcome).toBe(
      "needs_information",
    );
  });

  it("synthetic_c (income one unit over the boundary) is likely_mismatch", () => {
    expect(evaluateScheme(syntheticScheme, rv, syntheticProfiles.synthetic_c!, allSources, NOW).outcome).toBe(
      "likely_mismatch",
    );
  });
});

// Synthetic fixtures only: provenance gating must never yield a definitive outcome from weak evidence.
describe("provenance gating", () => {
  it("(a) an unverified source with a passing fact gives source_review_needed, not likely_fit", () => {
    const rules = [rule("a", FACT.size, "at_most", 5, { sourceId: unverifiedSource.id })];
    const result = evaluate(rules, allPassProfile);
    expect(result.outcome).toBe("source_review_needed");
    expect(result.outcome).not.toBe("likely_fit");
  });

  it("(b) a conflicting source with a failing fact never gives likely_mismatch", () => {
    const conflicting = { ...unverifiedSource, id: "src-provenance-conflict", status: "conflicting" as const };
    const rules = [rule("a", FACT.size, "at_most", 5, { sourceId: conflicting.id })];
    const result = evaluate(rules, withFacts({ [FACT.size]: 99 }), [conflicting]);
    expect(result.outcome).toBe("source_review_needed");
    expect(result.outcome).not.toBe("likely_mismatch");
  });

  it("(c) a stale checkedAt never gives a definitive likely_fit or likely_mismatch", () => {
    const passing = evaluate([rule("a", FACT.size, "at_most", 5, { sourceId: staleSource.id })], allPassProfile);
    const failing = evaluate([rule("a", FACT.size, "at_most", 5, { sourceId: staleSource.id })], withFacts({ [FACT.size]: 99 }));
    expect(passing.outcome).toBe("source_review_needed");
    expect(failing.outcome).toBe("source_review_needed");
    expect([passing.outcome, failing.outcome]).not.toContain("likely_fit");
    expect([passing.outcome, failing.outcome]).not.toContain("likely_mismatch");
  });

  it("(d) an OR group with one source_review_needed member and one failing member is not likely_mismatch", () => {
    const groupRules = [
      rule("p1", FACT.proofX, "is_true", true, { group: "proof", sourceId: unverifiedSource.id }),
      rule("p2", FACT.proofY, "is_true", true, { group: "proof" }),
    ];
    // p1 holds but its source is unverified (review needed); p2 fails on a verified source.
    const result = evaluate(groupRules, withFacts({ [FACT.proofX]: true, [FACT.proofY]: false }));
    expect(result.outcome).not.toBe("likely_mismatch");
    expect(result.outcome).toBe("needs_information");
    expect(result.failed).toEqual(["p2"]);
  });

  it("(e) an unanswered fact gives needs_information, not likely_mismatch", () => {
    const rules = [rule("a", FACT.size, "at_most", 5)];
    const result = evaluate(rules, without(FACT.size));
    expect(result.outcome).toBe("needs_information");
    expect(result.outcome).not.toBe("likely_mismatch");
    expect(result.unknown).toEqual(["a"]);
  });
});

// Documents current behaviour only. RuleVersion has no effectiveFrom/effectiveTo, and no code in src selects
// between rule versions: the evaluator takes one RuleVersion and the caller chooses it. No overlap check exists.
describe("rule versions with overlapping effective dates (current behaviour)", () => {
  const profile = withFacts({ [FACT.income]: 250000 });
  const looser = ruleVersion([rule("i", FACT.income, "at_most", 300000)], {
    id: "synthetic-rv-overlap-a",
    effectiveAt: "2025-01-01",
  });
  const stricter = ruleVersion([rule("i", FACT.income, "at_most", 200000)], {
    id: "synthetic-rv-overlap-b",
    effectiveAt: "2025-03-01",
  });

  it("evaluates each overlapping version independently, with no conflict error", () => {
    const a = evaluateScheme(syntheticScheme, looser, profile, allSources, NOW);
    const b = evaluateScheme(syntheticScheme, stricter, profile, allSources, NOW);
    expect(a.ruleVersionId).toBe("synthetic-rv-overlap-a");
    expect(a.outcome).toBe("likely_fit");
    expect(b.ruleVersionId).toBe("synthetic-rv-overlap-b");
    expect(b.outcome).toBe("likely_mismatch");
  });
});
