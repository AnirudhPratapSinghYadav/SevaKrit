import { z } from "zod";
import schemesJson from "../data/schemes.json";
import ruleVersionsJson from "../../data/ruleVersions.json";
import sourcesJson from "../../data/sources.json";
import {
  RuleVersionSchema,
  SchemeSchema,
  SourceRecordSchema,
  type RuleVersion,
  type Scheme,
  type SourceRecord,
} from "../domain/types";

// Invalid files fall back to empty lists, so the UI shows its empty state instead of crashing.
const parsedSchemes = z.array(SchemeSchema).safeParse(schemesJson);
const ALL_SCHEMES: Scheme[] = parsedSchemes.success ? parsedSchemes.data : [];

const parsedSources = z.array(SourceRecordSchema).safeParse(sourcesJson);
const ALL_SOURCES: SourceRecord[] = parsedSources.success ? parsedSources.data : [];

const parsedRuleVersions = z.array(RuleVersionSchema).safeParse(ruleVersionsJson);
const ALL_RULE_VERSIONS: RuleVersion[] = parsedRuleVersions.success ? parsedRuleVersions.data : [];

export function getPublishedSchemes(): Scheme[] {
  return ALL_SCHEMES.filter((scheme) => scheme.status === "published");
}

/** Internal use only: drafts are never shown as likely eligible. */
export function getAllDraftSchemes(): Scheme[] {
  return ALL_SCHEMES.filter((scheme) => scheme.status === "draft");
}

export function getSources(): SourceRecord[] {
  return ALL_SOURCES;
}

/** Published rule versions loaded from verified source-backed JSON. */
export function getRuleVersions(): RuleVersion[] {
  return ALL_RULE_VERSIONS;
}

/** Returns the scheme's rule version, or an empty one (outcome needs_information) when none exists. */
export function ruleVersionFor(scheme: Scheme, versions: RuleVersion[] = getRuleVersions()): RuleVersion {
  const found = versions.find((version) => version.schemeId === scheme.id);
  if (found) return found;
  return {
    id: `${scheme.id}:no-rules`,
    schemeId: scheme.id,
    version: 1,
    // Placeholder date. With no rules the outcome is needs_information regardless of this value.
    effectiveAt: "1970-01-01",
    reviewedAt: null,
    sourceIds: [],
    rules: [],
  };
}
