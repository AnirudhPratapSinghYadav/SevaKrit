import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FeatureRail from "../components/FeatureRail";
import { useAppState } from "../context/AppState";
import EmptyState from "../components/ui/EmptyState";
import { compareRuleVersions, loadWatchedEvaluations, rememberEvaluation } from "../domain/haqWatch";
import { useLanguage } from "../i18n/Language";
import { pushActivity } from "../services/activityInbox";
import { evaluatePublishedSchemes } from "../services/evaluatePublished";
import { getRuleVersions } from "../services/schemeRepository";

export default function HaqWatch() {
  const { profile } = useAppState();
  const { t } = useLanguage();
  const [watched, setWatched] = useState(loadWatchedEvaluations);
  const nowIso = useMemo(() => new Date().toISOString(), []);
  const entries = useMemo(() => evaluatePublishedSchemes(profile, nowIso), [profile, nowIso]);
  const versions = getRuleVersions();

  function rememberAll() {
    for (const entry of entries) {
      rememberEvaluation(entry.scheme.id, entry.detail.assessment.ruleVersionId, nowIso);
    }
    pushActivity(
      "watch_baseline",
      "Rule versions remembered",
      "HaqWatch saved the current published rule version ids in this browser for later comparison.",
      nowIso,
    );
    setWatched(loadWatchedEvaluations());
  }

  return (
    <section className="flex flex-col gap-6">
      <FeatureRail />
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold text-ink">{t("toolWatch")}</h1>
        <p className="text-ink-soft">{t("watchIntro")}</p>
        <p className="rounded-md bg-surface-muted px-4 py-3 text-sm">{t("watchNoAutoMonitor")}</p>
      </header>

      <button
        type="button"
        onClick={rememberAll}
        className="min-h-11 self-start rounded-md bg-ink px-4 font-semibold text-canvas"
      >
        {t("watchRemember")}
      </button>

      {entries.length === 0 ? (
        <EmptyState
          title={t("resultsTitle")}
          description={t("planEmpty")}
          action={
            <Link to="/discover" className="underline underline-offset-4">
              {t("planUpdate")}
            </Link>
          }
        />
      ) : null}

      <ul className="flex flex-col gap-4">
        {entries.map((entry) => {
          const currentId = entry.detail.assessment.ruleVersionId;
          const previousId = watched.find((item) => item.schemeId === entry.scheme.id)?.ruleVersionId;
          const current = versions.find((version) => version.id === currentId) ?? null;
          const previous =
            previousId !== undefined
              ? (versions.find((version) => version.id === previousId) ??
                (previousId === currentId ? current : null))
              : null;
          const report = compareRuleVersions(entry.scheme.id, previous, current);
          return (
            <li key={entry.scheme.id} className="rounded-md border border-border bg-surface p-4">
              <h2 className="font-semibold text-ink">{entry.scheme.title.en}</h2>
              <p className="text-sm">
                {t("watchPrevious")}: {report.previousVersionId ?? t("watchNone")}
              </p>
              <p className="text-sm">
                {t("watchCurrent")}: {report.currentVersionId ?? t("watchNone")}
              </p>
              <p className="text-sm">{report.summary}</p>
              {report.needsSourceReview && <p className="text-sm text-warning-ink">{t("sourceUnderReview")}</p>}
              {report.changes.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {report.changes.map((change) => (
                    <li key={`${change.ruleId}-${change.kind}`}>
                      {change.kind}: {change.ruleId}
                      {change.before ? ` (${change.before})` : ""}
                      {change.after ? ` → ${change.after}` : ""}
                    </li>
                  ))}
                </ul>
              )}
              <Link
                to={`/schemes/${entry.scheme.id}`}
                className="mt-2 inline-flex min-h-11 items-center underline underline-offset-4"
              >
                {t("resultsUnderstand")}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
