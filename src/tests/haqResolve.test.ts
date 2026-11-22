import { describe, expect, it } from "vitest";
import { diagnoseIssue } from "../domain/haqResolve";
import { demoHouseholds } from "../data/demoHouseholds";
import { evaluateSchemeForDate, getPublishedSchemeBySlug } from "../services/evaluatePublished";
import { getSources } from "../services/schemeRepository";

const NOW = "2026-11-22T12:00:00Z";

describe("HaqResolve", () => {
  it("does not invent appeal procedures when none are needed for missing info", () => {
    const scheme = getPublishedSchemeBySlug("pm-janman-housing-mp")!;
    const detail = evaluateSchemeForDate(scheme, demoHouseholds.needs_info!, NOW);
    const advice = diagnoseIssue("missing_information", scheme, detail, getSources());
    expect(advice.needsConfirmation.length).toBeGreaterThan(0);
    expect(advice.disclaimer).toMatch(/does not access government application status/i);
  });

  it("only surfaces appeal steps already listed on the catalogue for rejection reports", () => {
    const scheme = getPublishedSchemeBySlug("pm-janman-housing-mp")!;
    const detail = evaluateSchemeForDate(scheme, demoHouseholds.fit_baiga_dindori!, NOW);
    const advice = diagnoseIssue("reported_rejection", scheme, detail, getSources());
    expect(advice.nextSteps.every((step) => /appeal|appellate|gram sabha/i.test(step))).toBe(true);
  });
});
