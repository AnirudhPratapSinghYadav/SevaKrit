import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold leading-tight text-ink">
          Find benefits your household may qualify for, and what to do next.
        </h1>
        <p lang="hi" className="text-lg text-ink">
          आपके परिवार के लिए योजनाएँ और अगले कदम
        </p>
      </div>

      <p>
        Describe your household in plain words; we explain which schemes may fit, why, which
        documents to gather and which official office or portal to use.
      </p>

      <p className="font-medium text-ink">We never ask for Aadhaar, bank account numbers, OTPs or document scans.</p>

      <p className="text-sm">Scope: Madhya Pradesh · Baiga, Bharia and Sahariya households</p>

      <div className="flex flex-col gap-4">
        <Link
          to="/intake"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-5 py-3 text-center font-semibold text-canvas hover:opacity-90"
        >
          Start with a description
        </Link>
        <Link
          to="/privacy"
          className="inline-flex min-h-11 items-center text-terracotta-text underline underline-offset-4"
        >
          How your data is handled
        </Link>
      </div>

      <p className="rounded-md bg-sage px-4 py-3 text-sm text-body">
        Catalogue status: rules are being verified; no scheme is shown as confirmed yet.
      </p>
    </section>
  );
}

