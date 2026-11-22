import { useState } from "react";
import { useLanguage } from "../i18n/Language";

const LABELS_EN: Record<string, string> = {
  hasGovernmentEmployee: "Does any household member work as a government employee?",
  settlementArea: "Is your household in a rural or urban area?",
  houseType: "What type of house do you live in?",
  tribalGroup: "Which tribal group does your household belong to?",
  district: "Which district do you live in?",
};

const LABELS_HI: Record<string, string> = {
  hasGovernmentEmployee: "क्या परिवार का कोई सदस्य सरकारी कर्मचारी है?",
  settlementArea: "आपका परिवार ग्रामीण क्षेत्र में है या शहरी?",
  houseType: "आप किस प्रकार के मकान में रहते हैं?",
  tribalGroup: "आपका परिवार किस जनजातीय समूह से है?",
  district: "आप किस ज़िले में रहते हैं?",
};

type Choice = { label: string; value: string };

type FollowUpQuestionProps = {
  factKey: string;
  reason: string;
  answered?: string | undefined;
  onAnswer: (factKey: string, answer: string) => string | null;
};

/** One follow-up question. Choice buttons for known fact types; text otherwise. */
export default function FollowUpQuestion({ factKey, reason, answered, onAnswer }: FollowUpQuestionProps) {
  const { t, lang } = useLanguage();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputId = `followup-${factKey}`;
  const labels = lang === "hi" ? LABELS_HI : LABELS_EN;

  function choicesFor(key: string): Choice[] | null {
    if (key === "hasGovernmentEmployee") {
      return [
        { label: t("yes"), value: "Yes" },
        { label: t("no"), value: "No" },
        { label: t("dontKnow"), value: "I don't know" },
      ];
    }
    if (key === "settlementArea") {
      return [
        { label: lang === "hi" ? "ग्रामीण" : "Rural", value: "rural" },
        { label: lang === "hi" ? "शहरी" : "Urban", value: "urban" },
        { label: t("dontKnow"), value: "I don't know" },
      ];
    }
    if (key === "houseType") {
      return [
        { label: "Kutcha", value: "kutcha" },
        { label: "Pucca", value: "pucca" },
        { label: t("dontKnow"), value: "I don't know" },
      ];
    }
    return null;
  }

  const choices = choicesFor(factKey);

  function submit(value: string) {
    const message = onAnswer(factKey, value);
    setError(message);
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-surface p-3">
      <p id={`${inputId}-label`} className="font-semibold text-ink">
        {labels[factKey] ?? factKey}
      </p>
      <p className="text-sm">
        <span className="font-semibold">{t("whyAsk")}:</span> {reason}
      </p>
      {answered !== undefined ? (
        <p className="text-sm">
          {t("yourAnswer")}: {answered}
        </p>
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
            {labels[factKey] ?? factKey}
          </label>
          <input
            id={inputId}
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="min-h-11 rounded-md border border-border px-3"
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
            {t("confirmAnswer")}
          </button>
        </div>
      )}
    </div>
  );
}
