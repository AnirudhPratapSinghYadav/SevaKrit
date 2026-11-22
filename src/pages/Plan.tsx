import { useState } from "react";
import { Link } from "react-router-dom";
import DocumentChecklist from "../components/DocumentChecklist";
import StepTimeline from "../components/StepTimeline";
import { useAppState } from "../context/AppState";
import { formatIstDate } from "../domain/dates";
import { OUTCOME_LABELS } from "../domain/outcomeLabels";
import { planSchemes } from "../services/evaluatePublished";
import { addProgress } from "../services/progressRepository";
import { loadFollowUps, saveFollowUp } from "../services/reminderRepository";
import { buildReminders, type Reminder } from "../services/reminders";
import { getSources } from "../services/schemeRepository";

export default function Plan() {
  const { profile } = useAppState();
  const nowIso = new Date().toISOString();
  const actionable = planSchemes(profile, nowIso);
  const [status, setStatus] = useState<{ schemeId: string; message: string } | null>(null);
  const [followUps, setFollowUps] = useState(loadFollowUps);
  const [followUpInput, setFollowUpInput] = useState<{
    schemeId: string;
    local: string;
    message: string;
  } | null>(null);
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (actionable.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold text-ink">Your plan</h1>
        <p className="font-semibold">
          No likely-fit schemes for your confirmed answers yet. Plans are built from evaluated results, not the
          full catalogue.
        </p>
        <p>
          <Link to="/results" className="underline underline-offset-4">
            Review results
          </Link>
          {" · "}
          <Link to="/discover" className="underline underline-offset-4">
            Update your description
          </Link>
        </p>
      </section>
    );
  }

  const sources = getSources();
  const schemes = actionable.map((entry) => entry.scheme);
  const anyDeadline = schemes.some((scheme) => scheme.deadline !== null);
  const reminders: Reminder[] = schemes.flatMap((scheme) => {
    const follow = followUps.find((item) => item.schemeId === scheme.id);
    return buildReminders({
      schemeId: scheme.id,
      officialDeadline: scheme.deadline,
      personalFollowUp: follow ? { dueAt: follow.dueAt, timezone: follow.timezone } : null,
      nowIso,
    });
  });

  function recordApplied(schemeId: string) {
    const result = addProgress(schemeId, "applied", new Date().toISOString());
    setStatus({
      schemeId,
      message: result.ok
        ? "Saved in your record in this browser. This is not an official status."
        : `Not saved. ${result.error}`,
    });
  }

  function recordFollowUp(schemeId: string) {
    const local = followUpInput?.schemeId === schemeId ? followUpInput.local : "";
    const at = new Date(local);
    if (local === "" || Number.isNaN(at.getTime())) {
      setFollowUpInput({ schemeId, local, message: "Enter a valid date and time." });
      return;
    }
    const result = saveFollowUp(schemeId, at.toISOString(), browserTimezone);
    setFollowUpInput({
      schemeId,
      local,
      message: result.ok
        ? "Saved in this browser as your personal follow-up. Not an official date."
        : `Not saved. ${result.error}`,
    });
    if (result.ok) setFollowUps(loadFollowUps());
  }

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-ink">Your plan</h1>
      <p className="text-sm">
        Showing schemes with a likely-fit result for your confirmed answers. Demo: saved only in this browser.
      </p>
      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">Reminders</h2>
        <p className="text-sm">Your browser timezone: {browserTimezone}</p>
        {!anyDeadline && <p>Official deadline: none verified yet</p>}
        {reminders.length === 0 ? (
          <p>No reminders yet.</p>
        ) : (
          <ul className="list-disc space-y-1 pl-5">
            {reminders.map((reminder) => {
              const title = schemes.find((s) => s.id === reminder.schemeId)?.title.en ?? reminder.schemeId;
              const when =
                reminder.kind === "official_deadline"
                  ? formatIstDate(reminder.dueAt)
                  : new Date(reminder.dueAt).toLocaleString();
              const label = reminder.kind === "official_deadline" ? "Official deadline" : "Your follow-up";
              return (
                <li key={`${reminder.kind}-${reminder.schemeId}`}>
                  {label} for {title}: {when} ({reminder.status})
                </li>
              );
            })}
          </ul>
        )}
      </section>
      {actionable.map(({ scheme, detail }) => {
        const source = sources.find((item) => scheme.sourceIds.includes(item.id));
        const followInputId = `follow-up-${scheme.id}`;
        return (
          <article key={scheme.id} className="flex flex-col gap-4 rounded-md border border-sage p-4">
            <h2 className="text-xl font-semibold text-ink">{scheme.title.en}</h2>
            <p className="text-sm">
              Result: {OUTCOME_LABELS[detail.assessment.outcome]} ·{" "}
              <Link to={`/schemes/${scheme.id}`} className="underline underline-offset-4">
                Understand this scheme
              </Link>
            </p>
            <p className="text-sm">
              Rules checked: {detail.assessment.passed.length} met
              {detail.assessment.unknown.length > 0
                ? `, ${detail.assessment.unknown.length} still unknown`
                : ""}
            </p>
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
            <section className="flex flex-col gap-2">
              <h3 className="font-semibold text-ink">Personal follow-up</h3>
              <label htmlFor={followInputId}>
                Follow-up date and time (your timezone: {browserTimezone})
              </label>
              <input
                id={followInputId}
                type="datetime-local"
                value={followUpInput?.schemeId === scheme.id ? followUpInput.local : ""}
                onChange={(event) =>
                  setFollowUpInput({ schemeId: scheme.id, local: event.target.value, message: "" })
                }
                className="min-h-11 self-start rounded-md border border-ink px-3 text-ink"
              />
              <button
                type="button"
                onClick={() => recordFollowUp(scheme.id)}
                className="min-h-11 self-start rounded-md border border-ink px-4 text-ink"
              >
                Save follow-up
              </button>
              {followUpInput?.schemeId === scheme.id && followUpInput.message !== "" && (
                <p role="status">{followUpInput.message}</p>
              )}
            </section>
          </article>
        );
      })}
    </section>
  );
}
