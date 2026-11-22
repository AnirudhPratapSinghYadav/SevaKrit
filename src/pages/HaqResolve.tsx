import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FeatureRail from "../components/FeatureRail";
import { useAppState } from "../context/AppState";
import { diagnoseIssue, type ResolveIssueKind } from "../domain/haqResolve";
import { useLanguage } from "../i18n/Language";
import type { MessageKey } from "../i18n/messages";
import { evaluatePublishedSchemes } from "../services/evaluatePublished";
import { getSources } from "../services/schemeRepository";

const KINDS: { kind: ResolveIssueKind; label: MessageKey }[] = [
  { kind: "missing_information", label: "resolve_missing_information" },
  { kind: "incomplete_preparation", label: "resolve_incomplete_preparation" },
  { kind: "unclear_instructions", label: "resolve_unclear_instructions" },
  { kind: "pending_self_progress", label: "resolve_pending_self_progress" },
  { kind: "contradictory_sources", label: "resolve_contradictory_sources" },
  { kind: "reported_rejection", label: "resolve_reported_rejection" },
];

export default function HaqResolve() {
  const { profile } = useAppState();
  const { t } = useLanguage();
  const [kind, setKind] = useState<ResolveIssueKind>("missing_information");
  const nowIso = useMemo(() => new Date().toISOString(), []);
  const sources = getSources();
  const entries = useMemo(() => evaluatePublishedSchemes(profile, nowIso), [profile, nowIso]);

  const preferred =
    entries.find((entry) => entry.detail.assessment.outcome === "needs_information") ??
    entries.find((entry) => entry.detail.assessment.outcome === "likely_fit") ??
    entries[0];

  const advice = useMemo(() => {
    if (!preferred) return null;
    return diagnoseIssue(kind, preferred.scheme, preferred.detail, sources);
  }, [kind, preferred, sources]);

  return (
    <section className="flex flex-col gap-6">
      <FeatureRail />
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold text-ink">{t("toolResolve")}</h1>
        <p className="text-ink-soft">{t("resolveIntro")}</p>
      </header>

      {!preferred ? (
        <p>
          {t("planEmpty")}{" "}
          <Link to="/results" className="underline underline-offset-4">
            {t("planReviewResults")}
          </Link>
        </p>
      ) : (
        <>
          <p className="text-sm">
            {preferred.scheme.title.en} · {preferred.detail.assessment.outcome}
          </p>
          <label htmlFor="resolve-kind" className="font-semibold text-ink">
            {t("resolveIssue")}
          </label>
          <select
            id="resolve-kind"
            value={kind}
            onChange={(event) => setKind(event.target.value as ResolveIssueKind)}
            className="min-h-11 rounded-md border border-border px-3"
          >
            {KINDS.map((item) => (
              <option key={item.kind} value={item.kind}>
                {t(item.label)}
              </option>
            ))}
          </select>

          {advice && (
            <article className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4">
              <h2 className="text-xl font-semibold text-ink">{advice.title}</h2>
              <section>
                <h3 className="font-semibold text-ink">{t("resolveKnown")}</h3>
                <ul className="list-disc pl-5 text-sm">
                  {advice.known.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="font-semibold text-ink">{t("resolveConfirm")}</h3>
                <ul className="list-disc pl-5 text-sm">
                  {advice.needsConfirmation.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="font-semibold text-ink">{t("resolveNext")}</h3>
                {advice.nextSteps.length === 0 ? (
                  <p className="text-sm">{t("resolveNoInventedAppeal")}</p>
                ) : (
                  <ul className="list-disc pl-5 text-sm">
                    {advice.nextSteps.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
              </section>
              {advice.enquiryRoute && (
                <p>
                  <a
                    href={advice.enquiryRoute}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    {t("planOfficialSource")}
                  </a>
                </p>
              )}
              <p className="text-sm text-ink-soft">{advice.disclaimer}</p>
            </article>
          )}
        </>
      )}

      <p>
        <Link to="/help" className="underline underline-offset-4">
          {t("navHelp")}
        </Link>
        {" · "}
        <Link to="/plan" className="underline underline-offset-4">
          {t("navPlan")}
        </Link>
        {" · "}
        <Link to="/assisted" className="underline underline-offset-4">
          {t("navAssisted")}
        </Link>
      </p>
    </section>
  );
}
