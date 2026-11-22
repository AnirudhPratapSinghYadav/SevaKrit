import { describe, expect, it } from "vitest";
import { buildSevaRoute } from "../domain/sevaRoute";
import { getPublishedSchemes, getSources } from "../services/schemeRepository";

describe("SevaRoute", () => {
  it("builds ordered tasks from verified steps without inventing addresses", () => {
    const scheme = getPublishedSchemes()[0]!;
    const plan = buildSevaRoute(scheme, getSources());
    expect(plan.tasks.length).toBe(scheme.steps.length);
    expect(plan.locationNote).toMatch(/not invented|Verification needed/i);
    expect(plan.printableLines.join("\n")).not.toMatch(/km|hours open|appointment at/i);
  });
});
