import { useState } from "react";

const LABELS: Record<string, string> = {
  hasGovernmentEmployee: "Does any household member work as a government employee?",
  settlementArea: "Is your household in a rural or urban area?",
  houseType: "What type of house do you live in?",
  tribalGroup: "Which tribal group does your household belong to?",
  district: "Which district do you live in?",
};

const HINTS: Record<string, string> = {
  hasGovernmentEmployee: "Answer Yes, No, or I don't know.",
  settlementArea: "Answer rural, urban, or I don't know.",
  houseType: "Answer kutcha, pucca, or I don't know.",
};

type FollowUpQuestionProps = {
  factKey: string;
  reason: string;
  answered?: string | undefined;
  onAnswer: (factKey: string, answer: string) => string | null;
};

/** One follow-up question. The answer counts only when the user presses Confirm answer. */
export default function FollowUpQuestion({ factKey, reason, answered, onAnswer }: FollowUpQuestionProps) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputId = `followup-${factKey}`;

  return (
    <div className="flex flex-col gap-2 rounded-md border border-sage bg-canvas p-3">
      <label htmlFor={inputId} className="font-semibold text-ink">
        {LABELS[factKey] ?? factKey}
      </label>
      <p className="text-sm">
        <span className="font-semibold">Why we ask:</span> {reason}
      </p>
      {HINTS[factKey] !== undefined && <p className="text-sm text-ink-soft">{HINTS[factKey]}</p>}
      {answered !== undefined ? (
        <p className="text-sm">Your answer: {answered}</p>
      ) : (
        <div className="flex flex-col gap-2">
          <input
            id={inputId}
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="min-h-11 rounded-md border border-sage px-3"
            aria-describedby={error ? `${inputId}-error` : undefined}
          />
          {error !== null && (
            <p id={`${inputId}-error`} role="alert" className="text-sm text-error-ink">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={() => {
              const message = onAnswer(factKey, draft);
              setError(message);
            }}
            className="min-h-11 self-start rounded-md border border-ink px-3 font-semibold text-ink"
          >
            Confirm answer
          </button>
        </div>
      )}
    </div>
  );
}
