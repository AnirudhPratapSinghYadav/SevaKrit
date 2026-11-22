import type { Rule, RuleVersion } from "./types";

export interface WatchedEvaluation {
  schemeId: string;
  ruleVersionId: string;
  recordedAt: string;
}

export interface RuleChange {
  ruleId: string;
  kind: "added" | "removed" | "changed";
  before?: string;
  after?: string;
}

export interface WatchReport {
  schemeId: string;
  previousVersionId: string | null;
  currentVersionId: string | null;
  changes: RuleChange[];
  needsSourceReview: boolean;
  summary: string;
}

const STORAGE_KEY = "haqpath.watch.v1";

export function loadWatchedEvaluations(): WatchedEvaluation[] {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WatchedEvaluation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function rememberEvaluation(schemeId: string, ruleVersionId: string, recordedAt: string): void {
  const next = loadWatchedEvaluations().filter((item) => item.schemeId !== schemeId);
  next.push({ schemeId, ruleVersionId, recordedAt });
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Persistence is best-effort; comparison can still run in-memory for the session.
  }
}

function ruleFingerprint(rule: Rule): string {
  return `${rule.factKey}|${rule.operator}|${JSON.stringify(rule.value)}|${rule.exclusion}|${rule.description}`;
}

/** Compare two rule versions for household-relevant changes. No second evaluator. */
export function compareRuleVersions(
  schemeId: string,
  previous: RuleVersion | null,
  current: RuleVersion | null,
): WatchReport {
  if (current === null) {
    return {
      schemeId,
      previousVersionId: previous?.id ?? null,
      currentVersionId: null,
      changes: [],
      needsSourceReview: true,
      summary: "No current published rule version is available to compare.",
    };
  }
  if (previous === null) {
    return {
      schemeId,
      previousVersionId: null,
      currentVersionId: current.id,
      changes: [],
      needsSourceReview: false,
      summary: "No earlier watched version is stored yet. Re-check after your next evaluation to detect changes.",
    };
  }
  if (previous.id === current.id) {
    return {
      schemeId,
      previousVersionId: previous.id,
      currentVersionId: current.id,
      changes: [],
      needsSourceReview: false,
      summary: "The watched rule version matches the latest published version on this catalogue.",
    };
  }

  const before = new Map(previous.rules.map((rule) => [rule.id, rule]));
  const after = new Map(current.rules.map((rule) => [rule.id, rule]));
  const changes: RuleChange[] = [];

  for (const [id, rule] of after) {
    const prior = before.get(id);
    if (!prior) {
      changes.push({ ruleId: id, kind: "added", after: rule.description });
    } else if (ruleFingerprint(prior) !== ruleFingerprint(rule)) {
      changes.push({
        ruleId: id,
        kind: "changed",
        before: prior.description,
        after: rule.description,
      });
    }
  }
  for (const [id, rule] of before) {
    if (!after.has(id)) {
      changes.push({ ruleId: id, kind: "removed", before: rule.description });
    }
  }

  return {
    schemeId,
    previousVersionId: previous.id,
    currentVersionId: current.id,
    changes,
    needsSourceReview: current.reviewedAt === null,
    summary:
      changes.length === 0
        ? "Version ids differ but no rule text differences were detected."
        : `${changes.length} rule difference(s) may affect this household. Re-evaluate with your confirmed answers.`,
  };
}
