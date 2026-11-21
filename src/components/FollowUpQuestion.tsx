import { useState } from "react";

type FollowUpQuestionProps = {
  factKey: string;
  reason: string;
  answered?: string | undefined;
  onAnswer: (factKey: string, answer: string) => void;
};

/** One follow-up question. The answer counts only when the user presses Confirm answer. */
export default function FollowUpQuestion({ factKey, reason, answered, onAnswer }: FollowUpQuestionProps) {
  const [draft, setDraft] = useState("");
  const inputId = `followup-${factKey}`;

  return (
    <div className="flex flex-col gap-2 rounded-md border border-sage bg-canvas p-3">
      <label htmlFor={inputId} className="font-semibold text-ink">
        {factKey}
      </label>
      <p className="text-sm">
        <span className="font-semibold">Why we ask:</span> {reason}
      </p>
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
          />
          <button
            type="button"
            onClick={() => onAnswer(factKey, draft)}
            className="min-h-11 self-start rounded-md border border-ink px-3 font-semibold text-ink"
          >
            Confirm answer
          </button>
        </div>
      )}
    </div>
  );
}
