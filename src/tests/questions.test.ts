import { describe, expect, it } from "vitest";
import { decisiveQuestions } from "../domain/questions";
import type { HouseholdProfile } from "../domain/types";
import { syntheticProfiles } from "../data/sampleProfiles";
import { FACT, rule, ruleVersion, standardRules } from "./fixtures";

// All names, values and thresholds in this file are SYNTHETIC test fixtures.

describe("decisiveQuestions", () => {
  const rv = ruleVersion(standardRules());

  it("returns one question per distinct unknown fact in rule order", () => {
    const questions = decisiveQuestions(rv, syntheticProfiles.synthetic_b!);
    expect(questions.map((question) => question.factKey)).toEqual([
      FACT.income,
      FACT.proofY,
      FACT.disqualifier,
    ]);
  });

  it("uses the rule description as the reason", () => {
    const [first] = decisiveQuestions(rv, syntheticProfiles.synthetic_b!);
    expect(first?.reason).toBe("Synthetic rule r-income");
  });

  it("asks nothing when every fact is confirmed", () => {
    expect(decisiveQuestions(rv, syntheticProfiles.synthetic_a!)).toEqual([]);
  });

  it("asks everything for the empty synthetic profile, without duplicates", () => {
    const questions = decisiveQuestions(rv, syntheticProfiles.synthetic_empty!);
    const keys = questions.map((question) => question.factKey);
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys).toHaveLength(6);
  });

  it("dedupes a fact needed by several rules and keeps the first rule's reason", () => {
    const rules = [
      rule("first", FACT.income, "at_most", 300000, { description: "Synthetic first need" }),
      rule("second", FACT.income, "at_least", 1, { description: "Synthetic second need" }),
      rule("third", FACT.size, "at_most", 5),
    ];
    const profile: HouseholdProfile = { confirmedFacts: {}, unknownFacts: [] };
    const questions = decisiveQuestions(ruleVersion(rules), profile);
    expect(questions).toEqual([
      { factKey: FACT.income, reason: "Synthetic first need" },
      { factKey: FACT.size, reason: "Synthetic rule third" },
    ]);
  });
});
