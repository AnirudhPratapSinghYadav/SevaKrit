import { Link } from "react-router-dom";
import { demoHouseholds } from "../data/demoHouseholds";
import { OUTCOME_LABELS } from "../domain/outcomeLabels";
import { evaluatePublishedSchemes } from "../services/evaluatePublished";

/** Synthetic household simulator for demos — never real resident data. */
export default function Samples() {
  const now = "2026-11-22T12:00:00Z";
  const rows = Object.entries(demoHouseholds).map(([id, profile]) => {
    const entries = evaluatePublishedSchemes(profile, now);
    return { id, profile, entries };
  });

  return (
    <article className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-semibold text-ink">Sample households</h1>
      <p>
        These profiles are synthetic. They are for testing rule outcomes. They are not real Baiga,
        Bharia or Sahariya residents.
      </p>
      {rows.map(({ id, profile, entries }) => (
        <section key={id} className="flex flex-col gap-2 rounded-md border border-border bg-surface p-4">
          <h2 className="text-xl font-semibold text-ink">{id}</h2>
          <p className="text-sm">
            Confirmed facts: {Object.keys(profile.confirmedFacts).join(", ") || "none"}. Unknown:{" "}
            {profile.unknownFacts.join(", ") || "none"}.
          </p>
          <ul className="list-disc pl-5 text-sm">
            {entries.map((entry) => (
              <li key={entry.scheme.id}>
                {entry.scheme.title.en}: {OUTCOME_LABELS[entry.detail.assessment.outcome]}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p>
        <Link to="/review" className="underline underline-offset-4">
          Reviewer panel
        </Link>
      </p>
    </article>
  );
}
