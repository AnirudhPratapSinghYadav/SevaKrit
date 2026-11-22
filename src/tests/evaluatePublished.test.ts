import { describe, expect, it } from "vitest";
import type { HouseholdProfile } from "../domain/types";
import {
  evaluatePublishedSchemes,
  getPublishedSchemeBySlug,
  planSchemes,
} from "../services/evaluatePublished";

const NOW = "2026-11-22T12:00:00Z";

function profile(facts: HouseholdProfile["confirmedFacts"], unknown: string[] = []): HouseholdProfile {
  return { confirmedFacts: facts, unknownFacts: unknown };
}

describe("evaluatePublished / planSchemes", () => {
  it("evaluates the published housing scheme for an empty profile as needs_information", () => {
    const entries = evaluatePublishedSchemes(profile({}), NOW);
    expect(entries.length).toBe(1);
    expect(entries[0]!.scheme.id).toBe("pm-janman-housing-mp");
    expect(entries[0]!.detail.assessment.outcome).toBe("needs_information");
  });

  it("planSchemes excludes needs_information and only keeps likely_fit", () => {
    const incomplete = planSchemes(profile({}), NOW);
    expect(incomplete).toEqual([]);

    const fit = planSchemes(
      profile({
        tribalGroup: "Baiga",
        district: "Dindori",
        houseType: "kutcha",
        settlementArea: "rural",
        hasGovernmentEmployee: false,
      }),
      NOW,
    );
    expect(fit.map((entry) => entry.scheme.id)).toEqual(["pm-janman-housing-mp"]);
    expect(fit[0]!.detail.assessment.outcome).toBe("likely_fit");
  });

  it("planSchemes excludes likely_mismatch", () => {
    const mismatched = planSchemes(
      profile({
        tribalGroup: "Baiga",
        district: "Dindori",
        houseType: "pucca",
        settlementArea: "rural",
        hasGovernmentEmployee: false,
      }),
      NOW,
    );
    expect(mismatched).toEqual([]);
  });

  it("resolves published scheme by slug", () => {
    expect(getPublishedSchemeBySlug("pm-janman-housing-mp")?.status).toBe("published");
    expect(getPublishedSchemeBySlug("missing-scheme")).toBeUndefined();
  });
});
