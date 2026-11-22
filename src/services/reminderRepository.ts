import { z } from "zod";

// Demo storage: personal follow-up dates are saved only in this browser.
export const REMINDER_STORAGE_KEY = "haqpath.reminders.v1";

export interface StoredFollowUp {
  schemeId: string;
  dueAt: string;
  timezone: string;
}

const StoredFollowUpSchema = z
  .object({
    schemeId: z.string(),
    dueAt: z.string().datetime({ offset: true }),
    timezone: z.string().min(1),
  })
  .strict();
const FollowUpListSchema = z.array(StoredFollowUpSchema);

export type SaveResult = { ok: true } | { ok: false; error: string };

export function loadFollowUps(): StoredFollowUp[] {
  try {
    const raw = globalThis.localStorage.getItem(REMINDER_STORAGE_KEY);
    if (raw === null) return [];
    const parsed = FollowUpListSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

/** Stores one personal follow-up per scheme; a new save replaces the earlier one for that scheme. */
export function saveFollowUp(schemeId: string, dueAt: string, timezone: string): SaveResult {
  const entry = StoredFollowUpSchema.safeParse({ schemeId, dueAt, timezone });
  if (!entry.success) {
    return { ok: false, error: "This follow-up could not be saved because its date or timezone is invalid." };
  }
  try {
    const next = [...loadFollowUps().filter((item) => item.schemeId !== schemeId), entry.data];
    globalThis.localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(next));
    return { ok: true };
  } catch {
    return { ok: false, error: "This browser could not save your follow-up. Storage may be full or turned off." };
  }
}

export function clearFollowUps(): void {
  try {
    globalThis.localStorage.removeItem(REMINDER_STORAGE_KEY);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}
