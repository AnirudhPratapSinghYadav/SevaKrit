import { Link, useParams } from "react-router-dom";
import RuleTrace from "../components/RuleTrace";
import SourceBadge from "../components/SourceBadge";
import SourceCard from "../components/SourceCard";
import DocumentChecklist from "../components/DocumentChecklist";
import StepTimeline from "../components/StepTimeline";
import { useAppState } from "../context/AppState";
import { OUTCOME_LABELS } from "../domain/outcomeLabels";
import { evaluateSchemeForDate, getPublishedSchemeBySlug } from "../services/evaluatePublished";
import { getSources } from "../services/schemeRepository";

export default function SchemeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { profile } = useAppState();
  const scheme = slug ? getPublishedSchemeBySlug(slug) : undefined;

  if (!scheme) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold text-ink">Scheme not found</h1>
        <p>No published scheme matches this link, or it is still under review.</p>
        <Link to="/results" className="underline underline-offset-4">
          Back to results
        </Link>
      </section>
    );
  }

  const sources = getSources();
  const now = new Date().toISOString();
  const detail = evaluateSchemeForDate(scheme, profile, now);
  const primarySource = sources.find((item) => scheme.sourceIds.includes(item.id));

  return (
    <section className="flex flex-col gap-6">
      <p>
        <Link to="/results" className="underline underline-offset-4">
          Back to results
        </Link>
      </p>
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">{scheme.title.en}</h1>
        {scheme.title.hi !== undefined && (
          <p lang="hi" className="text-lg text-ink">
            {scheme.title.hi}
          </p>
        )}
        <p className="font-semibold text-ink">
          Status for your household: {OUTCOME_LABELS[detail.assessment.outcome] ?? detail.assessment.outcome}
        </p>
        <p className="text-sm">{scheme.department}</p>
      </header>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">Official source</h2>
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
        <h2 className="text-xl font-semibold text-ink">Eligibility evidence</h2>
        <p className="text-sm">
          These checks use the active rule version and your confirmed answers. They are not an official decision.
        </p>
        <RuleTrace results={detail.results} />
        {detail.notes.map((note) => (
          <p key={note} className="text-sm">
            {note}
          </p>
        ))}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">Documents</h2>
        <DocumentChecklist documents={scheme.documents} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">Application path</h2>
        <p className="text-sm">{scheme.applicationChannel}</p>
        <StepTimeline steps={scheme.steps} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">Deadline</h2>
        <p>
          {scheme.deadline === null
            ? "No verified deadline available on the recorded source."
            : `Verified deadline: ${scheme.deadline}`}
        </p>
      </section>

      <p className="rounded-md bg-surface-muted px-4 py-3 text-sm">
        Independent information service. Final decisions belong to the department
        {primarySource ? ` (${primarySource.publisher})` : ""}. This page does not submit applications or check
        live government status.
      </p>

      <p>
        <Link
          to="/plan"
          className="inline-flex min-h-11 items-center rounded-md bg-ink px-4 font-semibold text-canvas"
        >
          Open my plan
        </Link>
      </p>
    </section>
  );
}
