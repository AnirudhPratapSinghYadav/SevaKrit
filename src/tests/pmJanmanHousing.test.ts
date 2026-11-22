import { describe, expect, it } from "vitest";
import { evaluateScheme, evaluateSchemeDetailed } from "../domain/evaluate";
import type { HouseholdProfile, RuleVersion, Scheme, SourceRecord } from "../domain/types";
import { getPublishedSchemes, getRuleVersions, getSources, ruleVersionFor } from "../services/schemeRepository";

const NOW = "2026-11-22T12:00:00Z";

function loadHousing(): { scheme: Scheme; version: RuleVersion; sources: SourceRecord[] } {
  const scheme = getPublishedSchemes().find((item) => item.id === "pm-janman-housing-mp");
  if (!scheme) throw new Error("published pm-janman-housing-mp missing");
  const version = ruleVersionFor(scheme, getRuleVersions());
  expect(version.rules.length).toBeGreaterThan(0);
  return { scheme, version, sources: getSources() };
}

function profile(facts: HouseholdProfile["confirmedFacts"]): HouseholdProfile {
  return { confirmedFacts: facts, unknownFacts: [] };
}

describe("PM-JANMAN housing (source-backed rules)", () => {
  it("loads a published scheme with a reviewed rule version", () => {
    const { scheme, version, sources } = loadHousing();
    expect(scheme.status).toBe("published");
    expect(version.reviewedAt).toBe("2026-11-22");
    const source = sources.find((item) => item.id === "pm-janman-housing-mp");
    expect(source?.status).toBe("verified");
    expect(source?.url).toContain("Schemeid=974");
  });

  it("positive: Baiga / Dindori / kutcha / rural / no govt employee → likely_fit", () => {
    const { scheme, version, sources } = loadHousing();
    const result = evaluateScheme(
      scheme,
      version,
      profile({
        tribalGroup: "Baiga",
        district: "Dindori",
        houseType: "kutcha",
        settlementArea: "rural",
        hasGovernmentEmployee: false,
      }),
      sources,
      NOW,
    );
    expect(result.outcome).toBe("likely_fit");
  });

  it("negative: pucca house exclusion → likely_mismatch with exclusion rule failed", () => {
    const { scheme, version, sources } = loadHousing();
    const detail = evaluateSchemeDetailed(
      scheme,
      version,
      profile({
        tribalGroup: "Baiga",
        district: "Dindori",
        houseType: "pucca",
        settlementArea: "rural",
        hasGovernmentEmployee: false,
      }),
      sources,
      NOW,
    );
    expect(detail.assessment.outcome).toBe("likely_mismatch");
    expect(detail.assessment.failed).toContain("pmj-h-exclude-pucca");
  });

  it("unknown: missing government-employee fact → needs_information", () => {
    const { scheme, version, sources } = loadHousing();
    const result = evaluateScheme(
      scheme,
      version,
      profile({
        tribalGroup: "Baiga",
        district: "Dindori",
        houseType: "kutcha",
        settlementArea: "rural",
      }),
      sources,
      NOW,
    );
    expect(result.outcome).toBe("needs_information");
    expect(result.unknown).toContain("pmj-h-exclude-govt-job");
  });

  it("stale source cannot produce mismatch", () => {
    const { scheme, version, sources } = loadHousing();
    const staleSources = sources.map((source) =>
      source.id === "pm-janman-housing-mp" ? { ...source, checkedAt: "2020-01-01" } : source,
    );
    const result = evaluateScheme(
      scheme,
      version,
      profile({
        tribalGroup: "Baiga",
        district: "Dindori",
        houseType: "pucca",
        settlementArea: "rural",
        hasGovernmentEmployee: false,
      }),
      staleSources,
      NOW,
    );
    expect(result.outcome).toBe("source_review_needed");
    expect(result.failed).toEqual([]);
  });

  it("conflicting source cannot produce mismatch or fit", () => {
    const { scheme, version, sources } = loadHousing();
    const conflictingSources = sources.map((source) =>
      source.id === "pm-janman-housing-mp" ? { ...source, status: "conflicting" as const } : source,
    );
    const positive = evaluateScheme(
      scheme,
      version,
      profile({
        tribalGroup: "Baiga",
        district: "Dindori",
        houseType: "kutcha",
        settlementArea: "rural",
        hasGovernmentEmployee: false,
      }),
      conflictingSources,
      NOW,
    );
    const negative = evaluateScheme(
      scheme,
      version,
      profile({
        tribalGroup: "Baiga",
        district: "Dindori",
        houseType: "pucca",
        settlementArea: "rural",
        hasGovernmentEmployee: false,
      }),
      conflictingSources,
      NOW,
    );
    expect(positive.outcome).toBe("source_review_needed");
    expect(negative.outcome).toBe("source_review_needed");
  });
});
