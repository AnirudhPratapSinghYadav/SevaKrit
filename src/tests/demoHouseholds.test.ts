import { describe, expect, it } from "vitest";
import { demoHouseholds } from "../data/demoHouseholds";
import { evaluatePublishedSchemes } from "../services/evaluatePublished";

const NOW = "2026-11-22T12:00:00Z";

describe("demoHouseholds", () => {
  it("shows likely_fit for the Baiga Dindori kutcha rural profile", () => {
    const [entry] = evaluatePublishedSchemes(demoHouseholds.fit_baiga_dindori!, NOW);
    expect(entry?.detail.assessment.outcome).toBe("likely_fit");
  });

  it("shows likely_mismatch for a pucca house", () => {
    const [entry] = evaluatePublishedSchemes(demoHouseholds.mismatch_pucca!, NOW);
    expect(entry?.detail.assessment.outcome).toBe("likely_mismatch");
  });

  it("shows needs_information when government employment is unknown", () => {
    const [entry] = evaluatePublishedSchemes(demoHouseholds.needs_info!, NOW);
    expect(entry?.detail.assessment.outcome).toBe("needs_information");
  });
});
