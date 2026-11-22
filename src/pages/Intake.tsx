import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import FactReview from "../components/FactReview";
import FollowUpQuestion from "../components/FollowUpQuestion";
import { useAppState } from "../context/AppState";
import { FACT_LABELS, EXAMPLE_NARRATIVE, MAX_NARRATIVE_LENGTH, type FactKey } from "../services/parseNarrative";
import { scanSensitiveInput } from "../services/sensitiveInput";
import { getRuleVersions } from "../services/schemeRepository";

export default function Intake() {
  const {
    narrative,
    setNarrative,
    proposed,
    proposeFacts,
    confirmFact,
    removeProposal,
    confirmedFacts,
    followUpAnswers,
    unknownFacts,
    answerFollowUp,
  } = useAppState();
  const [message, setMessage] = useState<string | null>(null);

  // Fills the example only. It never submits.
  function useExample() {
    setNarrative(EXAMPLE_NARRATIVE);
    setMessage(null);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (narrative.trim() === "") {
      setMessage("Please describe your household first, or use the example.");
      return;
    }
    if (narrative.length > MAX_NARRATIVE_LENGTH) {
      setMessage(`Please keep your description under ${MAX_NARRATIVE_LENGTH} characters.`);
      return;
    }
    const sensitive = scanSensitiveInput(narrative);
    if (sensitive.blocked) {
      setMessage(sensitive.message);
      return;
    }
    const facts = proposeFacts(narrative);
    setMessage(
      facts.length === 0
        ? "We could not find household details we can read yet. You can describe your situation in more words."
        : `We found ${facts.length} detail${facts.length === 1 ? "" : "s"}. Check each one and press Confirm to keep it.`,
    );
  }

  // Rule facts not already confirmed from the narrative. Keep answered follow-ups visible for review.
  const questions = getRuleVersions()
    .flatMap((ruleVersion) =>
      ruleVersion.rules.map((rule) => ({ factKey: rule.factKey, reason: rule.description })),
    )
    .filter((question, index, all) => all.findIndex((item) => item.factKey === question.factKey) === index)
    .filter((question) => confirmedFacts[question.factKey] === undefined);

  const confirmedKeys = Object.keys(confirmedFacts);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-ink">Describe your household</h1>

      <p className="text-sm">
        Do not enter Aadhaar numbers, ID numbers, bank details, OTPs or scans. This demo does not ask for them.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label htmlFor="narrative" className="font-semibold text-ink">
          Tell us about your household in your own words
        </label>
        <textarea
          id="narrative"
          value={narrative}
          onChange={(event) => setNarrative(event.target.value)}
          rows={5}
          className="rounded-md border border-sage p-3"
        />
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={useExample} className="min-h-11 rounded-md border border-sage px-4 text-ink">
            Use the example
          </button>
          <button type="submit" className="min-h-11 rounded-md border border-ink px-4 font-semibold text-ink">
            Read my description
          </button>
        </div>
        {message !== null && <p role="status">{message}</p>}
      </form>

      {proposed.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-ink">Details we found</h2>
          <FactReview proposals={proposed} onConfirm={confirmFact} onRemove={removeProposal} />
        </section>
      )}

      {(confirmedKeys.length > 0 || Object.keys(followUpAnswers).length > 0 || unknownFacts.length > 0) && (
        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-ink">Confirmed details</h2>
          <ul className="flex flex-col gap-1">
            {confirmedKeys.map((key) => (
              <li key={key}>
                {FACT_LABELS[key as FactKey] ?? key}: {String(confirmedFacts[key])}
              </li>
            ))}
            {Object.entries(followUpAnswers).map(([key, value]) => (
              <li key={`follow-${key}`}>
                {FACT_LABELS[key as FactKey] ?? key}: {String(value)}
              </li>
            ))}
            {unknownFacts.map((key) => (
              <li key={`unknown-${key}`}>
                {FACT_LABELS[key as FactKey] ?? key}: I don't know
              </li>
            ))}
          </ul>
        </section>
      )}

      {confirmedKeys.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-ink">Follow-up questions</h2>
          {questions.length === 0 ? (
            <p>No further questions for the published rules with your confirmed details.</p>
          ) : (
            questions.map((question) => {
              const answered =
                followUpAnswers[question.factKey] !== undefined
                  ? String(followUpAnswers[question.factKey])
                  : unknownFacts.includes(question.factKey)
                    ? "I don't know"
                    : undefined;
              return (
                <FollowUpQuestion
                  key={question.factKey}
                  factKey={question.factKey}
                  reason={question.reason}
                  answered={answered}
                  onAnswer={answerFollowUp}
                />
              );
            })
          )}
        </section>
      )}

      <p>
        <Link
          to="/results"
          className="inline-flex min-h-11 items-center rounded-md bg-ink px-4 font-semibold text-canvas"
        >
          See results
        </Link>
      </p>
    </section>
  );
}
