import { useState } from "react";
import { useLanguage } from "../i18n/Language";
import type { PublishedEvaluation } from "../services/evaluatePublished";
import { OUTCOME_LABELS } from "../domain/outcomeLabels";

type Props = {
  entries: PublishedEvaluation[];
};

/** Copies scheme titles and outcomes only — never narrative or ID-like text. */
export default function SafeSummary({ entries }: Props) {
  const { t, lang } = useLanguage();
  const [status, setStatus] = useState<string | null>(null);

  async function copy() {
    const lines = entries.map(
      (entry) =>
        `${entry.scheme.title.en}: ${OUTCOME_LABELS[entry.detail.assessment.outcome]} (${entry.detail.assessment.ruleVersionId})`,
    );
    const text =
      (lang === "hi" ? "हक़पथ सारांश (आधिकारिक निर्णय नहीं):\n" : "HaqPath summary (not an official decision):\n") +
      (lines.length === 0 ? "(none)" : lines.join("\n"));
    try {
      await navigator.clipboard.writeText(text);
      setStatus(lang === "hi" ? "कॉपी हो गया।" : "Copied.");
    } catch {
      setStatus(lang === "hi" ? "कॉपी नहीं हो सका।" : "Could not copy.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => void copy()}
        className="min-h-11 self-start rounded-md border border-ink px-3 font-semibold text-ink"
      >
        {t("copySummary")}
      </button>
      {status !== null && <p role="status">{status}</p>}
    </div>
  );
}
