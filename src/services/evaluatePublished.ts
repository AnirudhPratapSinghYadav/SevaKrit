import { evaluateSchemeDetailed, type EvaluationDetail } from "../domain/evaluate";
import { selectRuleVersion } from "../domain/ruleSelection";
import type { HouseholdProfile, Outcome, RuleVersion, Scheme, SourceRecord } from "../domain/types";
import { getPublishedSchemes, getRuleVersions, getSources } from "./schemeRepository";

export interface PublishedEvaluation {
  scheme: Scheme;
  detail: EvaluationDetail;
}

/**
 * Evaluate one scheme against the rule version in effect on the calendar date of `nowIso`.
 * The as-of date is the UTC calendar date (the first 10 characters of the ISO timestamp).
 * If no version is in effect, or overlapping versions conflict, the result is
 * "source_review_needed" with no rule checks, so no decision is shown.
 * `versions` and `sources` default to the repository data; tests may pass their own.
 */
export function evaluateSchemeForDate(
  scheme: Scheme,
  profile: HouseholdProfile,
  nowIso: string,
  versions: RuleVersion[] = getRuleVersions(),
  sources: SourceRecord[] = getSources(),
): EvaluationDetail {
  // UTC calendar date of the instant, e.g. "2026-03-14".
  const asOf = nowIso.slice(0, 10);
  const sel = selectRuleVersion(versions, scheme.id, asOf);

  if (sel.kind === "selected") {
    return evaluateSchemeDetailed(scheme, sel.version, profile, sources, nowIso);
  }

  if (sel.kind === "none") {
    return {
      assessment: {
        schemeId: scheme.id,
        ruleVersionId: `${scheme.id}:none`,
        outcome: "source_review_needed",
        passed: [],
        failed: [],
        unknown: [],
        sourceIds: scheme.sourceIds,
      },
      results: [],
      notes: [`No rule version is in effect on ${asOf}, so the rules cannot be confirmed for this date.`],
    };
  }

  return {
    assessment: {
      schemeId: scheme.id,
      ruleVersionId: `${scheme.id}:conflict`,
      outcome: "source_review_needed",
      passed: [],
      failed: [],
      unknown: [],
      sourceIds: scheme.sourceIds,
      conflictingRuleVersionIds: sel.versionIds,
    },
    results: [],
    notes: [
      `Rule versions ${sel.versionIds.join(" and ")} overlap on ${asOf}; the overlap must be resolved before a decision is shown.`,
    ],
  };
}

/** Evaluate every published scheme against the household profile at a fixed instant. */
export function evaluatePublishedSchemes(
  profile: HouseholdProfile,
  nowIso: string,
): PublishedEvaluation[] {
  return getPublishedSchemes().map((scheme) => ({
    scheme,
    detail: evaluateSchemeForDate(scheme, profile, nowIso),
  }));
}

/** Schemes that belong on My Plan: only likely fits (actionable readiness, not catalogue dump). */
export function planSchemes(
  profile: HouseholdProfile,
  nowIso: string,
  allowed: Outcome[] = ["likely_fit"],
): PublishedEvaluation[] {
  return evaluatePublishedSchemes(profile, nowIso).filter((entry) =>
    allowed.includes(entry.detail.assessment.outcome),
  );
}

export function getPublishedSchemeBySlug(slug: string): Scheme | undefined {
  return getPublishedSchemes().find((scheme) => scheme.id === slug);
}
