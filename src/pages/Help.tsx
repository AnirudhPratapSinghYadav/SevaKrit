import { Link } from "react-router-dom";

export default function Help() {
  return (
    <article className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-ink">Help</h1>
      <p>
        HaqPath compares your confirmed answers with published rules. It does not apply on your behalf and
        it does not read a government application status.
      </p>
      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">What each result means</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-semibold text-ink">Likely fit.</span> Your confirmed answers meet the
            published rules that are currently source-reviewed. The department still decides.
          </li>
          <li>
            <span className="font-semibold text-ink">Needs information.</span> A rule cannot be checked
            until you answer, or you chose “I don’t know”.
          </li>
          <li>
            <span className="font-semibold text-ink">Likely mismatch.</span> A confirmed answer conflicts
            with a reviewed rule. This is not a government rejection.
          </li>
          <li>
            <span className="font-semibold text-ink">Source under review.</span> The record is missing,
            stale, or conflicting, so HaqPath will not give a confident fit or mismatch.
          </li>
        </ul>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">Your record vs the government</h2>
        <p>
          Buttons such as “I have applied” save only what you tell this browser. They do not update
          Awas+, the CM Helpline, or any department.
        </p>
      </section>
      <p>
        <Link to="/how-it-works" className="underline underline-offset-4">
          How the check works
        </Link>
        {" · "}
        <Link to="/glossary" className="underline underline-offset-4">
          Status meanings
        </Link>
        {" · "}
        <Link to="/privacy" className="underline underline-offset-4">
          Privacy
        </Link>
      </p>
    </article>
  );
}
