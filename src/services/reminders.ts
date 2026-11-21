// Pure reminder logic. No React, no storage, no Date.now(): the caller passes nowIso.

export type ReminderKind = "official_deadline" | "personal_follow_up";
export type ReminderStatus = "upcoming" | "due" | "overdue";

export interface PersonalFollowUp {
  /** ISO datetime with an explicit offset, e.g. 2025-02-01T10:00:00+05:30 */
  dueAt: string;
  /** IANA timezone name chosen in the browser, e.g. Asia/Kolkata */
  timezone: string;
}

export interface ReminderInput {
  schemeId: string;
  /** ISO date (YYYY-MM-DD) or null when no official deadline is verified. */
  officialDeadline: string | null;
  personalFollowUp: PersonalFollowUp | null;
  nowIso: string;
}

export interface Reminder {
  kind: ReminderKind;
  schemeId: string;
  /** The dueAt string exactly as supplied (not normalised). */
  dueAt: string;
  status: ReminderStatus;
  /** Set for personal follow-ups; null for official deadlines. */
  timezone: string | null;
}

const ISO_DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATE_TIME_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
const DAY_MS = 86_400_000;

/** Parses an ISO instant to epoch ms, or null when the value is not a valid ISO string. */
function parseInstant(value: unknown, allowDateOnly: boolean): number | null {
  if (typeof value !== "string") return null;
  const dateOnly = ISO_DATE_ONLY.test(value);
  if (!dateOnly && !ISO_DATE_TIME_WITH_OFFSET.test(value)) return null;
  if (dateOnly && !allowDateOnly) return null;
  const ms = Date.parse(value);
  if (Number.isNaN(ms)) return null;
  // Rejects impossible calendar dates such as 2025-02-30 that some parsers roll over.
  if (dateOnly && new Date(ms).toISOString().slice(0, 10) !== value) return null;
  return ms;
}

/**
 * Overdue: due on an earlier UTC day than now. Due: due on the same UTC day.
 * Upcoming: due on a later UTC day. Compared in UTC, with no extra threshold.
 */
function statusAt(dueMs: number, nowMs: number): ReminderStatus {
  const dueDay = Math.floor(dueMs / DAY_MS);
  const nowDay = Math.floor(nowMs / DAY_MS);
  if (dueDay < nowDay) return "overdue";
  if (dueDay === nowDay) return "due";
  return "upcoming";
}

/**
 * Builds reminders for one scheme. An official_deadline reminder is produced only for a valid
 * ISO date. Invalid inputs are skipped; this function never throws.
 */
export function buildReminders(input: ReminderInput): Reminder[] {
  const nowMs = parseInstant(input.nowIso, true);
  if (nowMs === null) return [];

  const reminders: Reminder[] = [];

  const deadlineMs = parseInstant(input.officialDeadline, true);
  if (input.officialDeadline !== null && deadlineMs !== null) {
    reminders.push({
      kind: "official_deadline",
      schemeId: input.schemeId,
      dueAt: input.officialDeadline,
      status: statusAt(deadlineMs, nowMs),
      timezone: null,
    });
  }

  const followUp = input.personalFollowUp;
  if (followUp && typeof followUp.timezone === "string" && followUp.timezone.trim() !== "") {
    const dueMs = parseInstant(followUp.dueAt, false);
    if (dueMs !== null) {
      reminders.push({
        kind: "personal_follow_up",
        schemeId: input.schemeId,
        dueAt: followUp.dueAt,
        status: statusAt(dueMs, nowMs),
        timezone: followUp.timezone,
      });
    }
  }

  return reminders;
}
