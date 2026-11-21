import type { ProposedFact } from "../services/parseNarrative";
import { FACT_LABELS } from "../services/parseNarrative";

type FactReviewProps = {
  proposals: ProposedFact[];
  onConfirm: (factKey: string) => void;
  onRemove: (factKey: string) => void;
};

function displayValue(value: ProposedFact["value"]): string {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return String(value);
}

/** Proposed facts as chips. Nothing is confirmed until the user presses Confirm. */
export default function FactReview({ proposals, onConfirm, onRemove }: FactReviewProps) {
  return (
    <ul className="flex flex-col gap-3">
      {proposals.map((fact) => (
        <li key={fact.factKey} className="flex flex-col gap-2 rounded-md border border-sage bg-canvas p-3">
          <p>
            <span className="font-semibold text-ink">{FACT_LABELS[fact.factKey]}:</span>{" "}
            {displayValue(fact.value)}
          </p>
          <p className="text-sm">From your text: &ldquo;{fact.evidenceSnippet}&rdquo;</p>
          <p className="text-sm">Not confirmed yet.</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onConfirm(fact.factKey)}
              className="min-h-11 rounded-md border border-ink px-3 font-semibold text-ink"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => onRemove(fact.factKey)}
              className="min-h-11 rounded-md border border-sage px-3 text-ink"
            >
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
