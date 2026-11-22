import type { EvaluationDetail } from "./evaluate";
import type { HouseholdProfile, Outcome } from "./types";
import { evaluatePublishedSchemes, type PublishedEvaluation } from "../services/evaluatePublished";

export type HypotheticalOverrides = Record<string, string | number | boolean | string[]>;

export interface CompassDiff {
  schemeId: string;
  titleEn: string;
  baselineOutcome: Outcome;
  hypotheticalOutcome: Outcome;
  changed: boolean;
  flippedRules: Array<{ ruleId: string; before: string; after: string }>;
  blocked: boolean;
  blockReason: string | null;
  hypotheticalOnly: boolean;
}

export interface CompassReport {
  baseline: PublishedEvaluation[];
  hypothetical: PublishedEvaluation[];
  diffs: CompassDiff[];
  disclaimer: string;
}

/** Build a temporary profile for simulation. Does not mutate the saved household. */
export function applyHypothetical(
  base: HouseholdProfile,
  overrides: HypotheticalOverrides,
  clearUnknown: string[] = Object.keys(overrides),
): HouseholdProfile {
  const confirmedFacts = { ...base.confirmedFacts };
  for (const [key, value] of Object.entries(overrides)) {
    confirmedFacts[key] = value;
  }
  const unknownFacts = base.unknownFacts.filter((key) => !clearUnknown.includes(key));
  return {
    id: base.id ? `${base.id}:hypothetical` : "hypothetical",
    confirmedFacts,
    unknownFacts,
  };
}

function detailMap(entries: PublishedEvaluation[]): Map<string, EvaluationDetail> {
  return new Map(entries.map((entry) => [entry.scheme.id, entry.detail]));
}

function isBlockedOutcome(outcome: Outcome): boolean {
  return outcome === "source_review_needed";
}

/**
 * Compare confirmed facts against a hypothetical overlay using the same published evaluator.
 * Never writes to storage. Blocks confident claims when either side needs source review.
 */
export function runHaqCompass(
  base: HouseholdProfile,
  overrides: HypotheticalOverrides,
  nowIso: string,
): CompassReport {
  const hypotheticalProfile = applyHypothetical(base, overrides);
  const baseline = evaluatePublishedSchemes(base, nowIso);
  const hypothetical = evaluatePublishedSchemes(hypotheticalProfile, nowIso);
  const baseDetails = detailMap(baseline);
  const hypoDetails = detailMap(hypothetical);

  const diffs: CompassDiff[] = baseline.map((entry) => {
    const schemeId = entry.scheme.id;
    const before = baseDetails.get(schemeId)!;
    const after = hypoDetails.get(schemeId)!;
    const flippedRules: CompassDiff["flippedRules"] = [];
    const beforeById = new Map(before.results.map((r) => [r.ruleId, r.outcome]));
    for (const result of after.results) {
      const prior = beforeById.get(result.ruleId);
      if (prior !== undefined && prior !== result.outcome) {
        flippedRules.push({ ruleId: result.ruleId, before: prior, after: result.outcome });
      }
    }
    const blocked =
      isBlockedOutcome(before.assessment.outcome) || isBlockedOutcome(after.assessment.outcome);
    return {
      schemeId,
      titleEn: entry.scheme.title.en,
      baselineOutcome: before.assessment.outcome,
      hypotheticalOutcome: after.assessment.outcome,
      changed: before.assessment.outcome !== after.assessment.outcome || flippedRules.length > 0,
      flippedRules,
      blocked,
      blockReason: blocked
        ? "Source evidence is unverified or conflicting, so HaqCompass will not treat this as a confident comparison."
        : null,
      hypotheticalOnly: true,
    };
  });

  return {
    baseline,
    hypothetical,
    diffs,
    disclaimer:
      "HaqCompass is a what-if explorer. Hypothetical values are not saved as confirmed household facts and must never be used to falsify an application.",
  };
}
