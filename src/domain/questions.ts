import type { HouseholdProfile, RuleVersion } from "./types";

/**
 * One question per distinct fact that a rule needs but the profile has not confirmed.
 * Rule order is preserved; the reason is the description of the first rule that needs the fact.
 */
export function decisiveQuestions(
  ruleVersion: RuleVersion,
  profile: HouseholdProfile,
): { factKey: string; reason: string }[] {
  const seen = new Set<string>();
  const questions: { factKey: string; reason: string }[] = [];
  for (const rule of ruleVersion.rules) {
    if (seen.has(rule.factKey)) continue;
    seen.add(rule.factKey);
    if (Object.prototype.hasOwnProperty.call(profile.confirmedFacts, rule.factKey)) continue;
    questions.push({ factKey: rule.factKey, reason: rule.description });
  }
  return questions;
}
