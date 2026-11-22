import { Link } from "react-router-dom";

const primaryLink =
  "inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-5 py-3 text-center font-semibold text-canvas hover:opacity-90";
const secondaryLink =
  "inline-flex min-h-11 items-center justify-center rounded-md border border-border px-5 py-3 text-center font-semibold text-ink hover:bg-surface-muted";
const textLink = "inline-flex min-h-11 items-center text-terracotta-text underline underline-offset-4";
const chapterHeading = "text-2xl font-semibold leading-tight text-ink";
const chapterMarker = "text-sm font-semibold uppercase tracking-wide text-accent-earth";
const chapterBody = "flex flex-col gap-4 text-ink-soft";

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      {/* Chapter 1 — Hook */}
      <section id="hook" className="flex flex-col gap-6 pt-4">
        <p className={chapterMarker}>Chapter 1</p>
        <h1 className="text-4xl font-semibold leading-tight text-ink md:text-5xl">
          You shouldn&apos;t need to know a scheme&apos;s name to find a way forward.
        </h1>
        <p className="text-lg text-ink-soft">
          HaqPath helps Baiga, Bharia and Sahariya households in Madhya Pradesh understand possible
          government benefits, see why they may qualify, and know what to do next.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/discover" className={primaryLink}>
            Find possible benefits
          </Link>
          <Link to="#how-it-works" className={secondaryLink}>
            See how it works
          </Link>
        </div>
      </section>

      {/* Chapter 2 — The unseen problem */}
      <section id="unseen-problem" className="flex flex-col gap-4 border-t border-border pt-10">
        <p className={chapterMarker}>Chapter 2</p>
        <h2 className={chapterHeading}>The unseen problem</h2>
        <div className={chapterBody}>
          <p>
            Eligibility rules are often written for officers, not for families. A benefit may depend on
            category, district, household composition or housing, and each of these can be described in
            a different way on different forms.
          </p>
          <p>
            Rules also change. A scheme that applied last year may have new conditions this year, and
            the documents asked for may differ from one office to the next.
          </p>
          <p>
            Even when a household qualifies, the application route can be hard to follow: which office,
            which portal, which proof, and in which order. Many useful benefits are lost at these steps,
            not at the question of whether they are right for the family.
          </p>
        </div>
      </section>

      {/* Chapter 3 — One household's story */}
      <section id="how-it-works" className="flex flex-col gap-6 border-t border-border pt-10">
        <p className={chapterMarker}>Chapter 3</p>
        <h2 className={chapterHeading}>One household&apos;s story</h2>
        <p className="rounded-md bg-sage px-4 py-2 text-sm font-semibold text-ink">
          A fictional example household
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
            <h3 className="text-lg font-semibold text-ink">What the household says</h3>
            <p className="text-ink-soft">
              An example family lives in a village with a young child and a grandparent. They farm a
              small plot, have heard about help for children and older people, and do not know which
              of these apply to them or what papers to bring.
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-muted p-5">
            <h3 className="text-lg font-semibold text-ink">What the system needs to know</h3>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-ink-soft">
              <li>State and district</li>
              <li>Household category, as the household describes it</li>
              <li>Whether a child and an older person live in the household</li>
              <li>Yes or no: does the household own a pucca house?</li>
              <li>Which documents the household already has</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Chapter 4 — The intelligent questions */}
      <section id="intelligent-questions" className="flex flex-col gap-4 border-t border-border pt-10">
        <p className={chapterMarker}>Chapter 4</p>
        <h2 className={chapterHeading}>The intelligent questions</h2>
        <div className={chapterBody}>
          <p>
            HaqPath asks only the questions that could change the result. Each question comes with a
            short note explaining why it matters, so nothing is asked just to fill a form.
          </p>
          <p>If an answer would not change the outcome, the question is not asked.</p>
        </div>
        <div>
          <Link to="/discover" className={primaryLink}>
            Try the questions
          </Link>
        </div>
      </section>

      {/* Chapter 5 — Explainable benefits */}
      <section id="explainable-benefits" className="flex flex-col gap-4 border-t border-border pt-10">
        <p className={chapterMarker}>Chapter 5</p>
        <h2 className={chapterHeading}>Explainable benefits</h2>
        <div className={chapterBody}>
          <p>Every scheme ends in one of four outcome labels:</p>
          <ul className="flex list-disc flex-col gap-2 pl-5">
            <li>Likely eligible</li>
            <li>Needs more information</li>
            <li>Likely not eligible for this scheme</li>
            <li>Source under review</li>
          </ul>
          <p>
            Every result shows the rule it was based on and the official source for that rule, so you
            can check it yourself or take it to an office.
          </p>
        </div>
        <div>
          <Link to="/results" className={textLink}>
            See how results are explained
          </Link>
        </div>
      </section>

      {/* Chapter 6 — From eligibility to readiness */}
      <section id="readiness" className="flex flex-col gap-4 border-t border-border pt-10">
        <p className={chapterMarker}>Chapter 6</p>
        <h2 className={chapterHeading}>From eligibility to readiness</h2>
        <div className={chapterBody}>
          <p>
            Knowing a benefit may apply is only the first step. HaqPath turns a result into a documents
            checklist, the application steps in order, and a progress view that shows what is still
            open.
          </p>
        </div>
        <div>
          <Link to="/plan" className={primaryLink}>
            Open my plan
          </Link>
        </div>
      </section>

      {/* Chapter 7 — Evidence and trust */}
      <section id="evidence-trust" className="flex flex-col gap-4 border-t border-border pt-10">
        <p className={chapterMarker}>Chapter 7</p>
        <h2 className={chapterHeading}>Evidence and trust</h2>
        <div className={chapterBody}>
          <p>
            Each rule is recorded with a version, the official source it came from, and the date it was
            last verified. Where a rule or source is not yet checked, the result says so.
          </p>
          <p>
            Review warnings appear when a source is out of date or under review. HaqPath does not show a
            scheme as confirmed until its rules have been verified.
          </p>
        </div>
        <div>
          <Link to="/privacy" className={textLink}>
            Read our privacy and limits
          </Link>
        </div>
      </section>

      {/* Chapter 8 — Assisted access */}
      <section id="assisted-access" className="flex flex-col gap-4 border-t border-border pt-10">
        <p className={chapterMarker}>Chapter 8</p>
        <h2 className={chapterHeading}>Assisted access</h2>
        <div className={chapterBody}>
          <p>
            Not everyone can use a website alone. A community volunteer or an NGO worker may sit with a
            household and use the same tool on their behalf, going through the questions together and
            explaining each result in the household&apos;s own words.
          </p>
        </div>
      </section>

      {/* Chapter 9 — Final call */}
      <section id="final-call" className="flex flex-col gap-6 border-t border-border pt-10">
        <p className={chapterMarker}>Chapter 9</p>
        <h2 className={chapterHeading}>Start with what you know.</h2>
        <p className="text-ink-soft">
          You do not need a scheme name, a file of papers or a full picture of your rights. Describe
          your household in plain words and see what may be possible next.
        </p>
        <div>
          <Link to="/discover" className={primaryLink}>
            Start now
          </Link>
        </div>
        <footer className="rounded-md bg-sage px-4 py-3 text-sm text-ink-soft">
          HaqPath is an independent readiness tool. It is not a government website and not an
          application service.
        </footer>
      </section>
    </div>
  );
}
