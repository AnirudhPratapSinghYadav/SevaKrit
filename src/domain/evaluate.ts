// Deterministic eligibility evaluation. Pure: no React, no storage, no clock (now is passed in).
import { isStale } from "./dates";
import type {
  Assessment,
  HouseholdProfile,
  Outcome,
  Rule,
  RuleVersion,
  Scheme,
  SourceRecord,
} from "./types";

export type RuleOutcome = "pass" | "fail" | "unknown" | "source_review_needed";

export interface RuleResult {
  ruleId: string;
  outcome: RuleOutcome;
  reason: string;
}

export interface EvaluationDetail {
  assessment: Assessment;
  results: RuleResult[];
  notes: string[];
}

type Fact = HouseholdProfile["confirmedFacts"][string];
type Check = { holds: boolean | null; reason: string };
type SourceIndex = Map<string, SourceRecord>;

const NOT_YET_EFFECTIVE = "rule version not yet effective";

function factFor(profile: HouseholdProfile, factKey: string): Fact | undefined {
  return Object.prototype.hasOwnProperty.call(profile.confirmedFacts, factKey)
    ? profile.confirmedFacts[factKey]
    : undefined;
}

function normalize(value: Fact): Fact {
  if (typeof value === "string") return value.trim().toLowerCase();
  if (Array.isArray(value)) return value.map((item) => item.trim().toLowerCase());
  return value;
}

function sameList(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const left = [...a].sort();
  const right = [...b].sort();
  return left.every((item, index) => item === right[index]);
}

/** holds === null means the condition cannot be decided (type mismatch), which is treated as unknown. */
function checkCondition(rule: Rule, fact: Fact): Check {
  const undecided = (why: string): Check => ({ holds: null, reason: `${rule.factKey}: ${why}` });
  switch (rule.operator) {
    case "equals": {
      const actual = normalize(fact);
      const expected = normalize(rule.value);
      if (Array.isArray(actual) && Array.isArray(expected)) {
        return { holds: sameList(actual, expected), reason: rule.description };
      }
      if (typeof actual === "string" && typeof expected === "string") {
        return { holds: actual === expected, reason: rule.description };
      }
      if (typeof actual === "number" && typeof expected === "number") {
        return { holds: actual === expected, reason: rule.description };
      }
      if (typeof actual === "boolean" && typeof expected === "boolean") {
        return { holds: actual === expected, reason: rule.description };
      }
      return undecided("fact and rule value have different types");
    }
    case "at_least":
    case "at_most": {
      if (typeof fact !== "number" || typeof rule.value !== "number") {
        return undecided("expected a number");
      }
      const holds = rule.operator === "at_least" ? fact >= rule.value : fact <= rule.value;
      return { holds, reason: rule.description };
    }
    case "one_of": {
      if (!Array.isArray(rule.value) || typeof fact !== "string") {
        return undecided("expected a text value and a list of options");
      }
      const allowed = rule.value.map((item) => item.trim().toLowerCase());
      return { holds: allowed.includes(fact.trim().toLowerCase()), reason: rule.description };
    }
    case "is_true":
    case "is_false": {
      if (typeof fact !== "boolean") return undecided("expected a yes/no value");
      return { holds: rule.operator === "is_true" ? fact : !fact, reason: rule.description };
    }
  }
}

function sourceProblem(sourceId: string, sources: SourceIndex, now: string): string | null {
  const source = sources.get(sourceId);
  if (!source) return `source ${sourceId} is missing`;
  if (source.status === "conflicting") return `source ${sourceId} is conflicting`;
  if (source.status !== "verified") return `source ${sourceId} is not verified`;
  if (isStale(source.checkedAt, now)) return `source ${sourceId} is stale or unchecked`;
  return null;
}

/**
 * Outcome for one rule before group logic.
 * Missing facts stay unknown. Source problems block BOTH pass and fail so unverified,
 * stale, conflicting or missing evidence cannot produce a confident match or mismatch.
 */
function evaluateRule(rule: Rule, profile: HouseholdProfile, sources: SourceIndex, now: string): RuleResult {
  const fact = factFor(profile, rule.factKey);
  if (fact === undefined) {
    return { ruleId: rule.id, outcome: "unknown", reason: `fact ${rule.factKey} is not confirmed` };
  }
  const check = checkCondition(rule, fact);
  if (check.holds === null) {
    return { ruleId: rule.id, outcome: "unknown", reason: check.reason };
  }
  const problem = sourceProblem(rule.sourceId, sources, now);
  if (problem !== null) {
    return { ruleId: rule.id, outcome: "source_review_needed", reason: `${rule.description}: ${problem}` };
  }
  // Exclusion: the condition holding is the failure.
  const passes = rule.exclusion ? !check.holds : check.holds;
  if (!passes) {
    return { ruleId: rule.id, outcome: "fail", reason: `${rule.description}: not met` };
  }
  return { ruleId: rule.id, outcome: "pass", reason: rule.description };
}

/** OR group: any pass satisfies it; all fail = fail; otherwise (no pass, some unknown or source review) = unknown. */
function combineGroup(outcomes: RuleOutcome[]): RuleOutcome {
  if (outcomes.includes("pass")) return "pass";
  if (outcomes.every((outcome) => outcome === "fail")) return "fail";
  return "unknown";
}

export function evaluateSchemeDetailed(
  scheme: Scheme,
  ruleVersion: RuleVersion,
  profile: HouseholdProfile,
  sources: SourceRecord[],
  now: string,
): EvaluationDetail {
  const sourceIndex: SourceIndex = new Map(sources.map((source) => [source.id, source]));
  const sourceIds = [...new Set(ruleVersion.rules.map((rule) => rule.sourceId))];
  const base = { schemeId: scheme.id, ruleVersionId: ruleVersion.id, sourceIds };

  if (ruleVersion.effectiveAt > now) {
    const results: RuleResult[] = ruleVersion.rules.map((rule) => ({
      ruleId: rule.id,
      outcome: "source_review_needed",
      reason: NOT_YET_EFFECTIVE,
    }));
    return {
      assessment: { ...base, outcome: "source_review_needed", passed: [], failed: [], unknown: [] },
      results,
      notes: [NOT_YET_EFFECTIVE],
    };
  }

  const notes: string[] = [];
  const results = ruleVersion.rules.map((rule) => evaluateRule(rule, profile, sourceIndex, now));

  // Build top-level components: exclusions and ungrouped rules are AND terms; each group is one OR term.
  const components: RuleOutcome[] = [];
  const groups = new Map<string, RuleOutcome[]>();
  ruleVersion.rules.forEach((rule, index) => {
    const outcome = results[index]?.outcome ?? "unknown";
    if (rule.group === undefined || rule.exclusion) {
      components.push(outcome);
    } else {
      groups.set(rule.group, [...(groups.get(rule.group) ?? []), outcome]);
    }
  });
  for (const outcomes of groups.values()) {
    components.push(combineGroup(outcomes));
  }

  let outcome: Outcome;
  if (ruleVersion.rules.length === 0) {
    outcome = "needs_information";
    notes.push("rule version has no rules, so nothing can be confirmed");
  } else if (components.includes("fail")) {
    outcome = "likely_mismatch";
  } else if (components.includes("unknown")) {
    outcome = "needs_information";
  } else if (components.includes("source_review_needed")) {
    outcome = "source_review_needed";
  } else {
    outcome = "likely_fit";
  }

  const idsWith = (wanted: RuleOutcome): string[] =>
    results.filter((result) => result.outcome === wanted).map((result) => result.ruleId);

  return {
    assessment: {
      ...base,
      outcome,
      passed: idsWith("pass"),
      failed: idsWith("fail"),
      unknown: idsWith("unknown"),
    },
    results,
    notes,
  };
}

export function evaluateScheme(
  scheme: Scheme,
  ruleVersion: RuleVersion,
  profile: HouseholdProfile,
  sources: SourceRecord[],
  now: string,
): Assessment {
  return evaluateSchemeDetailed(scheme, ruleVersion, profile, sources, now).assessment;
}
