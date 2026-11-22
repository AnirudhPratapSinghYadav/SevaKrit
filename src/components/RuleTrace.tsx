import type { RuleResult, RuleOutcome } from "../domain/evaluate";

const TRACE_LABEL: Record<RuleOutcome, string> = {
  pass: "Met",
  fail: "Not met",
  unknown: "Not answered",
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
        <div className="overflow-x-auto py-2">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Rule checks for this scheme</caption>
            <thead>
              <tr>
                <th scope="col">Rule</th>
                <th scope="col">Result</th>
                <th scope="col">Why</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.ruleId}>
                  <th scope="row" className="font-semibold [overflow-wrap:anywhere] align-top">{result.ruleId}</th>
                  <td className="[overflow-wrap:anywhere] align-top">{TRACE_LABEL[result.outcome]}</td>
                  <td className="[overflow-wrap:anywhere] align-top">{result.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </details>
  );
}
