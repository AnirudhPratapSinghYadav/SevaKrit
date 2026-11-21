import { useState } from "react";
import DocumentChecklist from "../components/DocumentChecklist";
import StepTimeline from "../components/StepTimeline";
import { addProgress } from "../services/progressRepository";
import { getPublishedSchemes, getSources } from "../services/schemeRepository";

export default function Plan() {
  const published = getPublishedSchemes();
  const [status, setStatus] = useState<{ schemeId: string; message: string } | null>(null);

  if (published.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold text-ink">Your plan</h1>
        <p className="font-semibold">No scheme is confirmed yet. Official rules are still being verified.</p>
      </section>
    );
  }

  const sources = getSources();

  function recordApplied(schemeId: string) {
    const result = addProgress(schemeId, "applied", new Date().toISOString());
    setStatus({
      schemeId,
      message: result.ok
        ? "Saved in your record in this browser. This is not an official status."
        : `Not saved. ${result.error}`,
    });
  }

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-ink">Your plan</h1>
      <p className="text-sm">Demo: saved only in this browser.</p>
      {published.map((scheme) => {
        const source = sources.find((item) => scheme.sourceIds.includes(item.id));
        return (
          <article key={scheme.id} className="flex flex-col gap-4 rounded-md border border-sage p-4">
            <h2 className="text-xl font-semibold text-ink">{scheme.title.en}</h2>
            <section className="flex flex-col gap-2">
              <h3 className="font-semibold text-ink">Documents</h3>
              <DocumentChecklist documents={scheme.documents} />
            </section>
            <section className="flex flex-col gap-2">
              <h3 className="font-semibold text-ink">Steps</h3>
              <StepTimeline steps={scheme.steps} />
            </section>
            <p>
              {source ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-terracotta-text underline underline-offset-4"
                >
                  Official source
                </a>
              ) : (
                "Official link not loaded yet."
              )}
            </p>
            <button
              type="button"
              onClick={() => recordApplied(scheme.id)}
              className="min-h-11 self-start rounded-md border border-ink px-4 text-ink"
            >
              I have applied (my record only, not an official status)
            </button>
            {status?.schemeId === scheme.id && <p role="status">{status.message}</p>}
          </article>
        );
      })}
    </section>
  );
}
