import { describe, expect, it } from "vitest";
import { compareRuleVersions } from "../domain/haqWatch";
import { getRuleVersions } from "../services/schemeRepository";

describe("HaqWatch", () => {
  it("reports no change when watched and current versions match", () => {
    const version = getRuleVersions().find((item) => item.schemeId === "pm-janman-housing-mp")!;
    const report = compareRuleVersions("pm-janman-housing-mp", version, version);
    expect(report.changes).toEqual([]);
    expect(report.summary).toMatch(/matches the latest published version/i);
  });

  it("detects added and removed rules between versions", () => {
    const current = getRuleVersions().find((item) => item.schemeId === "pm-janman-housing-mp")!;
    const previous = {
      ...current,
      id: "pm-janman-housing-mp:v0",
      version: 0,
      rules: current.rules.slice(0, -1),
    };
    const report = compareRuleVersions("pm-janman-housing-mp", previous, current);
    expect(report.changes.some((change) => change.kind === "added")).toBe(true);
  });
});
