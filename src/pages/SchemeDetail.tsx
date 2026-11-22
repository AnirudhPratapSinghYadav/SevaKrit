import { Link, useParams } from "react-router-dom";
import RuleTrace from "../components/RuleTrace";
import SourceBadge from "../components/SourceBadge";
import SourceCard from "../components/SourceCard";
import DocumentChecklist from "../components/DocumentChecklist";
import StepTimeline from "../components/StepTimeline";
import { useAppState } from "../context/AppState";
import { useLanguage } from "../i18n/Language";
import type { MessageKey } from "../i18n/messages";
import type { Outcome } from "../domain/types";
import { evaluateSchemeForDate, getPublishedSchemeBySlug } from "../services/evaluatePublished";
import { getSources } from "../services/schemeRepository";

const OUTCOME_KEYS: Record<Outcome, MessageKey> = {
  likely_fit: "likelyFit",
  needs_information: "needsInformation",
  likely_mismatch: "likelyMismatch",
  source_review_needed: "sourceUnderReview",
};

export default function SchemeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { profile } = useAppState();
  const { t, lang } = useLanguage();
  const scheme = slug ? getPublishedSchemeBySlug(slug) : undefined;

  if (!scheme) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold text-ink">{t("detailNotFound")}</h1>
        <p>
          {lang === "hi"
            ? "इस लिंक से मेल खाने वाली कोई प्रकाशित योजना नहीं है, या वह अभी समीक्षाधीन है।"
            : "No published scheme matches this link, or it is still under review."}
        </p>
        <Link to="/results" className="underline underline-offset-4">
          {t("detailBack")}
        </Link>
      </section>
    );
  }

  const sources = getSources();
  const now = new Date().toISOString();
  const detail = evaluateSchemeForDate(scheme, profile, now);
  const primarySource = sources.find((item) => scheme.sourceIds.includes(item.id));
  const title = lang === "hi" && scheme.title.hi !== undefined ? scheme.title.hi : scheme.title.en;

  return (
    <section className="flex flex-col gap-6">
      <p>
        <Link to="/results" className="underline underline-offset-4">
          {t("detailBack")}
        </Link>
      </p>
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink" lang={lang === "hi" && scheme.title.hi ? "hi" : undefined}>
          {title}
        </h1>
        {lang === "en" && scheme.title.hi !== undefined && (
          <p lang="hi" className="text-lg text-ink">
            {scheme.title.hi}
          </p>
        )}
        {lang === "hi" && (
          <p className="text-lg text-ink-soft">{scheme.title.en}</p>
        )}
        <p className="font-semibold text-ink">
          {t("detailStatus")}: {t(OUTCOME_KEYS[detail.assessment.outcome])}
        </p>
        <p className="text-sm">{scheme.department}</p>
      </header>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">{t("detailOfficialSource")}</h2>
        {scheme.sourceIds.map((sourceId) => {
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
        <p className="text-sm">
          Last human verification on this record: {scheme.lastVerified ?? "not recorded"}
        </p>
        {primarySource && (
          <SourceCard
            authority={primarySource.publisher}
            url={primarySource.url}
            status={primarySource.status}
            verifiedOn={scheme.lastVerified}
          />
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">{t("detailEvidence")}</h2>
        <p className="text-sm">{t("detailEvidenceHint")}</p>
        <RuleTrace results={detail.results} />
        {detail.notes.map((note) => (
          <p key={note} className="text-sm">
            {note}
          </p>
        ))}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">{t("detailDocuments")}</h2>
        <DocumentChecklist documents={scheme.documents} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">{t("detailPath")}</h2>
        <p className="text-sm">{scheme.applicationChannel}</p>
        <StepTimeline steps={scheme.steps} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">{t("detailDeadline")}</h2>
        <p>
          {scheme.deadline === null
            ? t("detailNoDeadline")
            : `${t("detailVerifiedDeadline")}: ${scheme.deadline}`}
        </p>
      </section>

      <p className="rounded-md bg-surface-muted px-4 py-3 text-sm">{t("detailDisclaimer")}</p>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/plan"
          className="inline-flex min-h-11 items-center rounded-md bg-ink px-4 font-semibold text-canvas"
        >
          {t("detailOpenPlan")}
        </Link>
        <Link
          to="/tools/compass"
          className="inline-flex min-h-11 items-center rounded-md border border-ink px-4 font-semibold text-ink"
        >
          {t("toolCompass")}
        </Link>
        <Link
          to="/tools/watch"
          className="inline-flex min-h-11 items-center rounded-md border border-ink px-4 font-semibold text-ink"
        >
          {t("toolWatch")}
        </Link>
        <Link
          to="/tools/resolve"
          className="inline-flex min-h-11 items-center text-sm underline underline-offset-4"
        >
          {t("toolResolve")}
        </Link>
      </div>
    </section>
  );
}
