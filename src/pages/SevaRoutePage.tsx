import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FeatureRail from "../components/FeatureRail";
import { useAppState } from "../context/AppState";
import { buildSevaRoute, markVisitApplied, undoVisitApplied } from "../domain/sevaRoute";
import { useLanguage } from "../i18n/Language";
import { planSchemes } from "../services/evaluatePublished";
import { getSources } from "../services/schemeRepository";

export default function SevaRoutePage() {
  const { profile } = useAppState();
  const { t } = useLanguage();
  const [message, setMessage] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const nowIso = useMemo(() => new Date().toISOString(), []);
  const sources = getSources();
  const actionable = useMemo(() => planSchemes(profile, nowIso), [profile, nowIso]);

  const plans = useMemo(
    () => actionable.map(({ scheme }) => buildSevaRoute(scheme, sources)),
    // refresh forces rebuild after local progress mutations
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional refresh counter
    [actionable, sources, refresh],
  );

  return (
    <section className="flex flex-col gap-6">
      <FeatureRail />
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold text-ink">{t("toolRoute")}</h1>
        <p className="text-ink-soft">{t("routeIntro")}</p>
      </header>

      {plans.length === 0 ? (
        <p>
          {t("planEmpty")}{" "}
          <Link to="/plan" className="underline underline-offset-4">
            {t("navPlan")}
          </Link>
        </p>
      ) : (
        plans.map((plan) => (
          <article key={plan.schemeId} className="flex flex-col gap-3 rounded-md border border-border p-4">
            <h2 className="text-xl font-semibold text-ink">{plan.titleEn}</h2>
            <p className="text-sm">{plan.groupingNote}</p>
            <p className="text-sm">{plan.locationNote}</p>
            <ol className="list-decimal space-y-2 pl-5">
              {plan.tasks.map((task) => (
                <li key={task.id}>
                  <span className="font-semibold">[{task.status}]</span> {task.label}
                  {task.materials.length > 0 && (
                    <ul className="list-disc pl-5 text-sm text-ink-soft">
                      {task.materials.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const result = markVisitApplied(plan.schemeId, new Date().toISOString());
                  setMessage(result.ok ? t("routeMarked") : result.error);
                  setRefresh((value) => value + 1);
                }}
                className="min-h-11 rounded-md border border-ink px-4 text-ink"
              >
                {t("planApplied")}
              </button>
              <button
                type="button"
                onClick={() => {
                  const result = undoVisitApplied(plan.schemeId);
                  setMessage(result.ok ? t("planUndo") : result.error);
                  setRefresh((value) => value + 1);
                }}
                className="min-h-11 rounded-md border border-ink px-4 text-ink"
              >
                {t("planUndo")}
              </button>
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([plan.printableLines.join("\n")], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const anchor = document.createElement("a");
                  anchor.href = url;
                  anchor.download = "sevaroute-checklist.txt";
                  anchor.click();
                  URL.revokeObjectURL(url);
                }}
                className="min-h-11 rounded-md bg-ink px-4 font-semibold text-canvas"
              >
                {t("routeDownload")}
              </button>
            </div>
          </article>
        ))
      )}
      {message !== null && <p role="status">{message}</p>}
    </section>
  );
}
