import { Link } from "react-router-dom";
import ConnectionBadge from "../components/ConnectionBadge";
import RuleTrace from "../components/RuleTrace";
import SafeSummary from "../components/SafeSummary";
import SourceBadge from "../components/SourceBadge";
import { useAppState } from "../context/AppState";
import type { Outcome } from "../domain/types";
import { useLanguage } from "../i18n/Language";
import type { MessageKey } from "../i18n/messages";
import { evaluatePublishedSchemes } from "../services/evaluatePublished";
import { getPublishedSchemes, getSources } from "../services/schemeRepository";

const SECTION_KEYS: { outcome: Outcome; label: MessageKey }[] = [
  { outcome: "likely_fit", label: "likelyFit" },
  { outcome: "needs_information", label: "needsInformation" },
  { outcome: "likely_mismatch", label: "likelyMismatch" },
  { outcome: "source_review_needed", label: "sourceUnderReview" },
];

export default function Results() {
  const { profile } = useAppState();
  const { t } = useLanguage();
  const published = getPublishedSchemes();

  if (published.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="font-display text-3xl font-semibold text-ink">{t("resultsTitle")}</h1>
        <p className="font-semibold">No scheme is confirmed yet. Official rules are still being verified.</p>
        <p>
          <Link to="/discover" className="underline underline-offset-4">
            {t("resultsEdit")}
          </Link>
        </p>
      </section>
    );
  }

  const sources = getSources();
  const now = new Date().toISOString();
  const entries = evaluatePublishedSchemes(profile, now);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-semibold text-ink">{t("resultsTitle")}</h1>
      <ConnectionBadge />
      <p className="text-sm">{t("resultsDisclaimer")}</p>
      <div className="flex flex-wrap items-center gap-4">
        <Link to="/discover" className="underline underline-offset-4">
          {t("resultsEdit")}
        </Link>
        <Link to="/glossary" className="underline underline-offset-4">
          {t("glossaryTitle")}
        </Link>
        <SafeSummary entries={entries} />
      </div>
      {SECTION_KEYS.map((section) => {
        const items = entries.filter((entry) => entry.detail.assessment.outcome === section.outcome);
        return (
          <section key={section.outcome} className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-ink">
              {t(section.label)} ({items.length})
            </h2>
            {items.length === 0 ? (
              <p className="text-sm">None.</p>
            ) : (
              items.map(({ scheme, detail }) => (
                <article key={scheme.id} className="flex flex-col gap-2 rounded-md border border-border bg-surface p-4">
                  <h3 className="font-semibold text-ink">{scheme.title.en}</h3>
                  {scheme.title.hi !== undefined && (
                    <p lang="hi" className="text-sm text-ink-soft">
                      {scheme.title.hi}
                    </p>
                  )}
                  <p className="text-sm">{scheme.department}</p>
                  {detail.assessment.sourceIds.map((sourceId) => {
                    const source = sources.find((item) => item.id === sourceId);
                    return source ? (
                      <SourceBadge
                        key={sourceId}
                        publisher={source.publisher}
                        url={source.url}
                        checkedAt={source.checkedAt}
                      />
                    ) : (
                      <p key={sourceId} className="text-sm">
                        Source record {sourceId} is not loaded.
                      </p>
                    );
                  })}
                  {detail.notes.length > 0 && (
                    <ul className="text-sm">
                      {detail.notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  )}
                  <RuleTrace results={detail.results} />
                  <Link
                    to={`/schemes/${scheme.id}`}
                    className="inline-flex min-h-11 items-center self-start rounded-md border border-ink px-3 font-semibold text-ink"
                  >
                    Understand this scheme
                  </Link>
                  {section.outcome === "likely_fit" && (
                    <Link to="/plan" className="text-sm underline underline-offset-4">
                      Open action plan
                    </Link>
                  )}
                </article>
              ))
            )}
          </section>
        );
      })}
    </section>
  );
}
