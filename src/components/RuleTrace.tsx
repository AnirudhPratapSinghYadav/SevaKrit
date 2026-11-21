import type { RuleResult, RuleOutcome } from "../domain/evaluate";

const TRACE_LABEL: Record<RuleOutcome, string> = {
  pass: "Met",
  fail: "Not met",
  unknown: "Not yet known",
  source_review_needed: "Source under review",
};

type RuleTraceProps = {
  results: RuleResult[];
};

/** Expandable list of how each rule was judged. Each outcome is written as text. */
export default function RuleTrace({ results }: RuleTraceProps) {
  return (
    <details className="rounded-md border border-sage bg-canvas px-3 py-2 text-sm">
      <summary className="min-h-11 cursor-pointer py-2 font-semibold text-ink">Rule trace</summary>
      {results.length === 0 ? (
        <p className="py-2">No rules are loaded for this scheme yet.</p>
      ) : (
        <ul className="flex flex-col gap-2 py-2">
          {results.map((result) => (
            <li key={result.ruleId}>
              <span className="font-semibold">{TRACE_LABEL[result.outcome]}:</span> {result.reason}
            </li>
          ))}
        </ul>
      )}
    </details>
  );
}
