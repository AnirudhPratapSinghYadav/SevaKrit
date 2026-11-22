import { Link } from "react-router-dom";
import RuleTrace from "../components/RuleTrace";
import SourceBadge from "../components/SourceBadge";
import { useAppState } from "../context/AppState";
import type { Outcome } from "../domain/types";
import { evaluatePublishedSchemes } from "../services/evaluatePublished";
import { getPublishedSchemes, getSources } from "../services/schemeRepository";

const SECTIONS: { outcome: Outcome; label: string }[] = [
  { outcome: "likely_fit", label: "Likely fit" },
  { outcome: "needs_information", label: "Needs information" },
  { outcome: "likely_mismatch", label: "Likely mismatch" },
  { outcome: "source_review_needed", label: "Source under review" },
];

export default function Results() {
  const { profile } = useAppState();
  const published = getPublishedSchemes();

  if (published.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold text-ink">Results</h1>
        <p className="font-semibold">No scheme is confirmed yet. Official rules are still being verified.</p>
        <p>
          <Link to="/discover" className="underline underline-offset-4">
            Back to your description
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
      <h1 className="text-3xl font-semibold text-ink">Results</h1>
      <p className="text-sm">
        These are checks against official rules, not a decision. Confirm with the official office before applying.
      </p>
      <p>
        <Link to="/discover" className="underline underline-offset-4">
          Edit answers
        </Link>
      </p>
      {SECTIONS.map((section) => {
        const items = entries.filter((entry) => entry.detail.assessment.outcome === section.outcome);
        return (
          <section key={section.outcome} className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-ink">
              {section.label} ({items.length})
            </h2>
            {items.length === 0 ? (
              <p className="text-sm">None.</p>
            ) : (
              items.map(({ scheme, detail }) => (
                <article key={scheme.id} className="flex flex-col gap-2 rounded-md border border-sage p-4">
                  <h3 className="font-semibold text-ink">{scheme.title.en}</h3>
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
