import { evaluateSchemeDetailed, type EvaluationDetail } from "../domain/evaluate";
import type { HouseholdProfile, Outcome, Scheme } from "../domain/types";
import { getPublishedSchemes, getRuleVersions, getSources, ruleVersionFor } from "./schemeRepository";

export interface PublishedEvaluation {
  scheme: Scheme;
  detail: EvaluationDetail;
}

/** Evaluate every published scheme against the household profile at a fixed instant. */
export function evaluatePublishedSchemes(
  profile: HouseholdProfile,
  nowIso: string,
): PublishedEvaluation[] {
  const sources = getSources();
  const versions = getRuleVersions();
  return getPublishedSchemes().map((scheme) => ({
    scheme,
    detail: evaluateSchemeDetailed(scheme, ruleVersionFor(scheme, versions), profile, sources, nowIso),
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
