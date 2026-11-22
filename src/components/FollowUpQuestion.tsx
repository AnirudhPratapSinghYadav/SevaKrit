import { useState } from "react";

const LABELS: Record<string, string> = {
  hasGovernmentEmployee: "Does any household member work as a government employee?",
  settlementArea: "Is your household in a rural or urban area?",
  houseType: "What type of house do you live in?",
  tribalGroup: "Which tribal group does your household belong to?",
  district: "Which district do you live in?",
};

type Choice = { label: string; value: string };

function choicesFor(factKey: string): Choice[] | null {
  if (factKey === "hasGovernmentEmployee") {
    return [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
      { label: "I don't know", value: "I don't know" },
    ];
  }
  if (factKey === "settlementArea") {
    return [
      { label: "Rural", value: "rural" },
      { label: "Urban", value: "urban" },
      { label: "I don't know", value: "I don't know" },
    ];
  }
  if (factKey === "houseType") {
    return [
      { label: "Kutcha", value: "kutcha" },
      { label: "Pucca", value: "pucca" },
      { label: "I don't know", value: "I don't know" },
    ];
  }
  return null;
}

type FollowUpQuestionProps = {
  factKey: string;
  reason: string;
  answered?: string | undefined;
  onAnswer: (factKey: string, answer: string) => string | null;
};

/** One follow-up question. Choice buttons for known fact types; text otherwise. */
export default function FollowUpQuestion({ factKey, reason, answered, onAnswer }: FollowUpQuestionProps) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputId = `followup-${factKey}`;
  const choices = choicesFor(factKey);

  function submit(value: string) {
    const message = onAnswer(factKey, value);
    setError(message);
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-sage bg-canvas p-3">
      <p id={`${inputId}-label`} className="font-semibold text-ink">
        {LABELS[factKey] ?? factKey}
      </p>
      <p className="text-sm">
        <span className="font-semibold">Why we ask:</span> {reason}
      </p>
      {answered !== undefined ? (
        <p className="text-sm">Your answer: {answered}</p>
      ) : choices !== null ? (
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby={`${inputId}-label`}>
          {choices.map((choice) => (
            <button
              key={choice.value}
              type="button"
              onClick={() => submit(choice.value)}
              className="min-h-11 rounded-md border border-ink px-3 font-semibold text-ink"
            >
              {choice.label}
            </button>
          ))}
          {error !== null && (
            <p role="alert" className="basis-full text-sm text-error-ink">
              {error}
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <label htmlFor={inputId} className="sr-only">
            {LABELS[factKey] ?? factKey}
          </label>
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
            onClick={() => submit(draft)}
            className="min-h-11 self-start rounded-md border border-ink px-3 font-semibold text-ink"
          >
            Confirm answer
          </button>
        </div>
      )}
    </div>
  );
}
