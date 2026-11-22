import { Link } from "react-router-dom";
import { documentRows } from "../domain/readiness";
import { useAppState } from "../context/AppState";
import { useLanguage } from "../i18n/Language";
import type { MessageKey } from "../i18n/messages";
import type { Outcome } from "../domain/types";
import { planSchemes } from "../services/evaluatePublished";
import { getSources } from "../services/schemeRepository";

const OUTCOME_KEYS: Record<Outcome, MessageKey> = {
  likely_fit: "likelyFit",
  needs_information: "needsInformation",
  likely_mismatch: "likelyMismatch",
  source_review_needed: "sourceUnderReview",
};

export default function ActionSheet() {
  const { profile } = useAppState();
  const { t, lang } = useLanguage();
  const nowIso = new Date().toISOString();
  const actionable = planSchemes(profile, nowIso);
  const sources = getSources();

  return (
    <article className="print-sheet flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">{t("printTitle")}</h1>
        <p className="text-sm">
          {t("printDisclaimer")} {lang === "hi" ? "मुद्रित" : "Printed"} {nowIso.slice(0, 10)}.
        </p>
      </header>
      <p className="no-print">
        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-11 rounded-md border border-ink px-4 font-semibold text-ink"
        >
          {t("printButton")}
        </button>
        {" · "}
        <Link to="/plan" className="underline underline-offset-4">
          {t("printBack")}
        </Link>
        {" · "}
        <Link to="/tools/pocket" className="underline underline-offset-4">
          {t("toolPocket")}
        </Link>
      </p>
      {actionable.length === 0 ? (
        <p>{t("printEmpty")}</p>
      ) : (
        actionable.map(({ scheme, detail }) => {
          const source = sources.find((item) => scheme.sourceIds.includes(item.id));
          const title = lang === "hi" && scheme.title.hi !== undefined ? scheme.title.hi : scheme.title.en;
          return (
            <section key={scheme.id} className="flex flex-col gap-3 border-t border-border pt-4">
              <h2 className="text-xl font-semibold text-ink">{title}</h2>
              <p>
                {t("planResult")}: {t(OUTCOME_KEYS[detail.assessment.outcome])}. Rule version{" "}
                {detail.assessment.ruleVersionId}.
              </p>
              <p>
                {t("detailDeadline")}:{" "}
                {scheme.deadline === null ? t("detailNoDeadline") : scheme.deadline}
              </p>
              <h3 className="font-semibold text-ink">{t("planDocuments")}</h3>
              <ul className="list-disc pl-5">
                {documentRows(scheme.documents).map((row) => (
                  <li key={row.text}>
                    {row.text}{" "}
                    {row.readiness === "verify_with_department" ? "(verify with the department)" : "(listed)"}
                  </li>
                ))}
              </ul>
              <h3 className="font-semibold text-ink">{t("planSteps")}</h3>
              <ol className="list-decimal pl-5">
                {scheme.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              {source && (
                <p>
                  {t("planOfficialSource")}: {source.publisher}. {source.url}. Checked {source.checkedAt}.
                </p>
              )}
            </section>
          );
        })
      )}
    </article>
  );
}
