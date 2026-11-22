import { Link } from "react-router-dom";
import { documentRows } from "../domain/readiness";
import { OUTCOME_LABELS } from "../domain/outcomeLabels";
import { useAppState } from "../context/AppState";
import { planSchemes } from "../services/evaluatePublished";
import { getSources } from "../services/schemeRepository";

export default function ActionSheet() {
  const { profile } = useAppState();
  const nowIso = new Date().toISOString();
  const actionable = planSchemes(profile, nowIso);
  const sources = getSources();

  return (
    <article className="print-sheet flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">HaqPath action sheet</h1>
        <p className="text-sm">
          Not an official certificate or government approval. Self-reported preparation only. Printed{" "}
          {nowIso.slice(0, 10)}.
        </p>
      </header>
      <p className="no-print">
        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-11 rounded-md border border-ink px-4 font-semibold text-ink"
        >
          Print or save as PDF
        </button>
        {" · "}
        <Link to="/plan" className="underline underline-offset-4">
          Back to plan
        </Link>
      </p>
      {actionable.length === 0 ? (
        <p>No likely-fit scheme for the answers saved in this browser. Nothing here is an application.</p>
      ) : (
        actionable.map(({ scheme, detail }) => {
          const source = sources.find((item) => scheme.sourceIds.includes(item.id));
          return (
            <section key={scheme.id} className="flex flex-col gap-3 border-t border-border pt-4">
              <h2 className="text-xl font-semibold text-ink">{scheme.title.en}</h2>
              <p>
                Result: {OUTCOME_LABELS[detail.assessment.outcome]}. Rule version {detail.assessment.ruleVersionId}.
              </p>
              <p>Deadline: {scheme.deadline === null ? "No verified official deadline on this record." : scheme.deadline}</p>
              <h3 className="font-semibold text-ink">Documents</h3>
              <ul className="list-disc pl-5">
                {documentRows(scheme.documents).map((row) => (
                  <li key={row.text}>
                    {row.text}{" "}
                    {row.readiness === "verify_with_department" ? "(verify with the department)" : "(listed)"}
                  </li>
                ))}
              </ul>
              <h3 className="font-semibold text-ink">Steps</h3>
              <ol className="list-decimal pl-5">
                {scheme.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              {source && (
                <p>
                  Official source: {source.publisher}. {source.url}. Checked {source.checkedAt}.
                </p>
              )}
            </section>
          );
        })
      )}
    </article>
  );
}