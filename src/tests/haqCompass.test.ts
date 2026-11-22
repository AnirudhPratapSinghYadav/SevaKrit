import { describe, expect, it } from "vitest";
import { applyHypothetical, runHaqCompass } from "../domain/haqCompass";
import { demoHouseholds } from "../data/demoHouseholds";

const NOW = "2026-11-22T12:00:00Z";

describe("HaqCompass", () => {
  it("does not mutate the base profile when applying hypotheticals", () => {
    const base = demoHouseholds.fit_baiga_dindori!;
    const before = JSON.stringify(base);
    const next = applyHypothetical(base, { houseType: "pucca" });
    expect(JSON.stringify(base)).toBe(before);
    expect(next.confirmedFacts.houseType).toBe("pucca");
    expect(base.confirmedFacts.houseType).toBe("kutcha");
  });

  it("shows a different outcome for pucca what-if on a likely-fit household", () => {
    const report = runHaqCompass(demoHouseholds.fit_baiga_dindori!, { houseType: "pucca" }, NOW);
    const diff = report.diffs.find((item) => item.schemeId === "pm-janman-housing-mp");
    expect(diff?.baselineOutcome).toBe("likely_fit");
    expect(diff?.hypotheticalOutcome).toBe("likely_mismatch");
    expect(diff?.changed).toBe(true);
    expect(diff?.hypotheticalOnly).toBe(true);
    expect(diff?.flippedRules.length).toBeGreaterThan(0);
  });
});
