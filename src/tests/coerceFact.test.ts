import { describe, expect, it } from "vitest";
import { coerceFollowUpAnswer } from "../services/coerceFact";

describe("coerceFollowUpAnswer", () => {
  it("coerces government-employee yes/no to booleans", () => {
    expect(coerceFollowUpAnswer("hasGovernmentEmployee", "Yes")).toEqual({ kind: "value", value: true });
    expect(coerceFollowUpAnswer("hasGovernmentEmployee", "no")).toEqual({ kind: "value", value: false });
  });

  it("marks I don't know as unknown instead of inventing a value", () => {
    expect(coerceFollowUpAnswer("hasGovernmentEmployee", "I don't know")).toEqual({ kind: "unknown" });
    expect(coerceFollowUpAnswer("settlementArea", "not sure")).toEqual({ kind: "unknown" });
  });

  it("accepts rural/urban for settlement area", () => {
    expect(coerceFollowUpAnswer("settlementArea", "Rural")).toEqual({ kind: "value", value: "rural" });
  });
});
