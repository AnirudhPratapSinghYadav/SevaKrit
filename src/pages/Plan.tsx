import { useState } from "react";
import { Link } from "react-router-dom";
import DocumentChecklist from "../components/DocumentChecklist";
import FeatureRail from "../components/FeatureRail";
import StepTimeline from "../components/StepTimeline";
import { useAppState } from "../context/AppState";
import { formatIstDate } from "../domain/dates";
import { documentRows } from "../domain/readiness";
import { useLanguage } from "../i18n/Language";
import type { MessageKey } from "../i18n/messages";
import type { Outcome } from "../domain/types";
import { planSchemes } from "../services/evaluatePublished";
import { buildPersonalFollowUpIcs } from "../services/ics";
import { addProgress, loadProgress, undoLastProgress } from "../services/progressRepository";
import { loadFollowUps, saveFollowUp } from "../services/reminderRepository";
import { buildReminders, type Reminder } from "../services/reminders";
import { getSources } from "../services/schemeRepository";

const OUTCOME_KEYS: Record<Outcome, MessageKey> = {
  likely_fit: "likelyFit",
  needs_information: "needsInformation",
  likely_mismatch: "likelyMismatch",
  source_review_needed: "sourceUnderReview",
};

export default function Plan() {
  const { profile } = useAppState();
  const { t, lang } = useLanguage();
  const nowIso = new Date().toISOString();
  const actionable = planSchemes(profile, nowIso);
  const [status, setStatus] = useState<{ schemeId: string; message: string } | null>(null);
  const [events, setEvents] = useState(loadProgress);
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
        <h1 className="text-3xl font-semibold text-ink">{t("planTitle")}</h1>
        <p className="font-semibold">{t("planEmpty")}</p>
        <p>
          <Link to="/results" className="underline underline-offset-4">
            {t("planReviewResults")}
          </Link>
          {" · "}
          <Link to="/discover" className="underline underline-offset-4">
            {t("planUpdate")}
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
    if (result.ok) setEvents(loadProgress());
  }

  function undoApplied(schemeId: string) {
    const result = undoLastProgress(schemeId);
    setStatus({
      schemeId,
      message: result.ok ? "Last self-reported step removed from this browser." : result.error,
    });
    if (result.ok) setEvents(loadProgress());
  }

  function downloadIcs(schemeId: string, title: string) {
    const follow = followUps.find((item) => item.schemeId === schemeId);
    if (!follow) {
      setFollowUpInput({
        schemeId,
        local: followUpInput?.schemeId === schemeId ? followUpInput.local : "",
        message: "Save a personal follow-up date before downloading a calendar file.",
      });
      return;
    }
    const ics = buildPersonalFollowUpIcs({
      uid: `haqpath-${schemeId}-${follow.dueAt}@haqpath.local`,
      summary: `HaqPath personal follow-up: ${title}`,
      description: "Personal reminder saved in this browser. Not an official government deadline.",
      startIso: follow.dueAt,
      nowIso: new Date().toISOString(),
    });
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "haqpath-follow-up.ics";
    anchor.click();
    URL.revokeObjectURL(url);
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
      <FeatureRail />
      <h1 className="text-3xl font-semibold text-ink">{t("planTitle")}</h1>
      <p className="text-sm">{t("planIntro")}</p>
      <p className="flex flex-wrap gap-x-4 gap-y-2">
        <Link to="/plan/print" className="underline underline-offset-4">
          {t("planPrint")}
        </Link>
        <Link to="/tools/pocket" className="underline underline-offset-4">
          {t("toolPocket")}
        </Link>
        <Link to="/tools/route" className="underline underline-offset-4">
          {t("toolRoute")}
        </Link>
        <Link to="/tools/resolve" className="underline underline-offset-4">
          {t("toolResolve")}
        </Link>
      </p>
      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-ink">{t("planReminders")}</h2>
        <p className="text-sm">
          {lang === "hi" ? "आपका ब्राउज़र समय क्षेत्र" : "Your browser timezone"}: {browserTimezone}
        </p>
        {!anyDeadline && (
          <p>
            {t("planOfficialDeadline")}: {lang === "hi" ? "अभी सत्यापित नहीं" : "none verified yet"}
          </p>
        )}
        {reminders.length === 0 ? (
          <p>{t("planNoReminders")}</p>
        ) : (
          <ul className="list-disc space-y-1 pl-5">
            {reminders.map((reminder) => {
              const scheme = schemes.find((s) => s.id === reminder.schemeId);
              const title =
                lang === "hi" && scheme?.title.hi !== undefined
                  ? scheme.title.hi
                  : (scheme?.title.en ?? reminder.schemeId);
              const when =
                reminder.kind === "official_deadline"
                  ? formatIstDate(reminder.dueAt)
                  : new Date(reminder.dueAt).toLocaleString();
              const label =
                reminder.kind === "official_deadline" ? t("planOfficialDeadline") : t("planYourFollowUp");
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
        const title = lang === "hi" && scheme.title.hi !== undefined ? scheme.title.hi : scheme.title.en;
        return (
          <article key={scheme.id} className="flex flex-col gap-4 rounded-md border border-sage p-4">
            <h2 className="text-xl font-semibold text-ink">{title}</h2>
            <p className="text-sm">
              {t("planResult")}: {t(OUTCOME_KEYS[detail.assessment.outcome])} ·{" "}
              <Link to={`/schemes/${scheme.id}`} className="underline underline-offset-4">
                {t("resultsUnderstand")}
              </Link>
            </p>
            <p className="text-sm">
              Rules checked: {detail.assessment.passed.length} met
              {detail.assessment.unknown.length > 0
                ? `, ${detail.assessment.unknown.length} still unknown`
                : ""}
            </p>
            <section className="flex flex-col gap-2">
              <h3 className="font-semibold text-ink">{t("planDocuments")}</h3>
              <DocumentChecklist documents={scheme.documents} />
              <ul className="text-sm">
                {documentRows(scheme.documents).map((row) => (
                  <li key={row.text}>
                    Status:{" "}
                    {row.readiness === "verify_with_department"
                      ? "Verify with the department — the source did not list a required document set"
                      : "Listed on the reviewed source"}
                  </li>
                ))}
              </ul>
            </section>
            <section className="flex flex-col gap-2">
              <h3 className="font-semibold text-ink">{t("planSteps")}</h3>
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
                  {t("planOfficialSource")}
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
              {t("planApplied")}
            </button>
            <button
              type="button"
              onClick={() => undoApplied(scheme.id)}
              className="min-h-11 self-start rounded-md border border-ink px-4 text-ink"
            >
              {t("planUndo")}
            </button>
            <p className="text-sm">
              Self-reported steps saved in this browser:{" "}
              {events.filter((event) => event.schemeId === scheme.id).length}
            </p>
            {status?.schemeId === scheme.id && <p role="status">{status.message}</p>}
            <section className="flex flex-col gap-2">
              <h3 className="font-semibold text-ink">{t("planPersonalFollowUp")}</h3>
              <label htmlFor={followInputId}>
                {t("planFollowUpLabel")}: {browserTimezone})
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
                {t("planSaveFollowUp")}
              </button>
              <button
                type="button"
                onClick={() => downloadIcs(scheme.id, scheme.title.en)}
                className="min-h-11 self-start rounded-md border border-ink px-4 text-ink"
              >
                {t("planDownloadIcs")}
              </button>
              <p className="text-sm">
                {t("planOfficialDeadline")}:{" "}
                {scheme.deadline === null ? t("planNoOfficialDeadline") : scheme.deadline}
              </p>
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
