import { Link } from "react-router-dom";
import { getPublishedSchemes } from "../services/schemeRepository";

export default function HowItWorks() {
  const published = getPublishedSchemes();
  return (
    <article className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-ink">How it works</h1>
      <ol className="list-decimal space-y-3 pl-5">
        <li>You describe the household. Proposed facts stay unconfirmed until you press Confirm.</li>
        <li>Follow-up questions appear only for facts a published rule still needs. “I don’t know” stays unknown.</li>
        <li>The same evaluation is used on Results, scheme detail, and the plan.</li>
        <li>A plan is shown only for a likely fit. Other outcomes stay on Results with an explanation.</li>
        <li>Application and approval stay on the official channel named on the scheme page.</li>
      </ol>
      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">Recorded review dates</h2>
        {published.length === 0 ? (
          <p>No scheme is published.</p>
        ) : (
          <ul className="list-disc space-y-1 pl-5">
            {published.map((scheme) => (
              <li key={scheme.id}>
                {scheme.title.en}: last human verification on this record{" "}
                {scheme.lastVerified ?? "not recorded"}.
              </li>
            ))}
          </ul>
        )}
        <p className="text-sm">
          A website footer date is not treated as a human review of the rule.
        </p>
      </section>
      <p>
        <Link to="/discover" className="underline underline-offset-4">
          Describe a household
        </Link>
      </p>
    </article>
  );
}
