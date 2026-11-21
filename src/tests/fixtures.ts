// SYNTHETIC test fixtures. Scheme, source URLs, facts, thresholds and dates are invented
// for testing the engine. They are not official scheme data and must not be shipped as such.
import type { Rule, RuleVersion, Scheme, SourceRecord } from "../domain/types";

export const NOW = "2025-06-01T00:00:00Z";
export const SYNTHETIC_SCHEME_ID = "synthetic-scheme";

export const FACT = {
  size: "synthetic_household_size",
  income: "synthetic_income_inr",
  district: "synthetic_district_type",
  proofX: "synthetic_proof_x",
  proofY: "synthetic_proof_y",
  disqualifier: "synthetic_disqualifier",
} as const;

export const syntheticScheme: Scheme = {
  id: SYNTHETIC_SCHEME_ID,
  title: { en: "Synthetic test scheme" },
  department: "Synthetic department",
  beneficiaryScope: "household",
  applicationChannel: "Synthetic channel",
  steps: [],
  documents: [],
  deadline: null,
  sourceIds: ["src-verified"],
  status: "draft",
  lastVerified: null,
};

// Checked 31 days before NOW: fresh and verified.
export const verifiedSource: SourceRecord = {
  id: "src-verified",
  url: "https://example.com/synthetic-verified",
  publisher: "Synthetic publisher",
  checkedAt: "2025-05-01",
  evidenceText: "Synthetic evidence text for a verified source.",
  status: "verified",
};

// Checked more than 365 days before NOW: stale.
export const staleSource: SourceRecord = {
  id: "src-stale",
  url: "https://example.com/synthetic-stale",
  publisher: "Synthetic publisher",
  checkedAt: "2023-01-01",
  evidenceText: "Synthetic evidence text for a stale source.",
  status: "verified",
};

// Fresh date but not verified.
export const unverifiedSource: SourceRecord = {
  id: "src-unverified",
  url: "https://example.com/synthetic-unverified",
  publisher: "Synthetic publisher",
  checkedAt: "2025-05-01",
  evidenceText: "Synthetic evidence text for an unverified source.",
  status: "unverified",
};

export function rule(
  id: string,
  factKey: string,
  operator: Rule["operator"],
  value: Rule["value"],
  extra: Partial<Pick<Rule, "description" | "sourceId" | "group" | "exclusion">> = {},
): Rule {
  return {
    id,
    factKey,
    operator,
    value,
    description: extra.description ?? `Synthetic rule ${id}`,
    sourceId: extra.sourceId ?? "src-verified",
    group: extra.group,
    exclusion: extra.exclusion ?? false,
  };
}

/** Synthetic rule set: AND of size/income/district, OR group of two proofs, one exclusion. */
export function standardRules(sourceId = "src-verified"): Rule[] {
  return [
    rule("r-size", FACT.size, "at_most", 5, { sourceId }),
    rule("r-income", FACT.income, "at_most", 300000, { sourceId }),
    rule("r-district", FACT.district, "one_of", ["alpha", "beta"], { sourceId }),
    rule("r-proof-x", FACT.proofX, "is_true", true, { group: "proof", sourceId }),
    rule("r-proof-y", FACT.proofY, "is_true", true, { group: "proof", sourceId }),
    rule("r-disqualifier", FACT.disqualifier, "is_true", true, { exclusion: true, sourceId }),
  ];
}

export function ruleVersion(
  rules: Rule[],
  overrides: Partial<Pick<RuleVersion, "id" | "effectiveAt" | "sourceIds">> = {},
): RuleVersion {
  return {
    id: "synthetic-rv-1",
    schemeId: SYNTHETIC_SCHEME_ID,
    version: 1,
    effectiveAt: "2025-01-01",
    reviewedAt: "2025-02-01",
    sourceIds: ["src-verified"],
    rules,
    ...overrides,
  };
}

export const allSources: SourceRecord[] = [verifiedSource, staleSource, unverifiedSource];
