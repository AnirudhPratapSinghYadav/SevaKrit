import type { RuleVersion } from "./types";

export type RuleSelection =
  | { kind: "selected"; version: RuleVersion }
  | { kind: "none" }
  | { kind: "conflict"; versionIds: string[] };

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Selects the rule version applicable to a scheme on a given date.
 *
 * - asOf must be a YYYY-MM-DD string; otherwise a RangeError is thrown.
 * - A version is applicable when effectiveAt <= asOf and (effectiveTo is missing or asOf < effectiveTo).
 *   The interval is [effectiveAt, effectiveTo): start inclusive, end exclusive, missing end open-ended.
 * - Dates are compared as YYYY-MM-DD strings (lexicographic order is chronological for this format).
 * - Zero applicable versions -> { kind: "none" }.
 * - Exactly one applicable version -> { kind: "selected", version }.
 * - More than one -> { kind: "conflict", versionIds } with the applicable ids sorted ascending.
 * - Never picks the newest or first version, and does not infer or repair missing data.
 */
export function selectRuleVersion(
  versions: RuleVersion[],
  schemeId: string,
  asOf: string,
): RuleSelection {
  if (!ISO_DATE_PATTERN.test(asOf)) {
    throw new RangeError(`asOf must be a YYYY-MM-DD date, received "${asOf}"`);
  }

  const applicable = versions.filter(
    (version) =>
      version.schemeId === schemeId &&
      version.effectiveAt <= asOf &&
      (version.effectiveTo === undefined || asOf < version.effectiveTo),
  );

  const [only, ...rest] = applicable;
  if (only === undefined) {
    return { kind: "none" };
  }
  if (rest.length === 0) {
    return { kind: "selected", version: only };
  }
  return {
    kind: "conflict",
    versionIds: applicable.map((version) => version.id).sort(),
  };
}
