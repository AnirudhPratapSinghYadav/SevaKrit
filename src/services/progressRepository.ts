import { z } from "zod";
import { ProgressEventSchema, type ProgressEvent } from "../domain/types";

// Demo storage: saved only in this browser. Never store identity numbers, bank details, OTPs or scans.
export const PROGRESS_STORAGE_KEY = "haqpath.progress.v1";

const ProgressListSchema = z.array(ProgressEventSchema);

export type SaveResult = { ok: true } | { ok: false; error: string };

export function loadProgress(): ProgressEvent[] {
  try {
    const raw = globalThis.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (raw === null) return [];
    const parsed = ProgressListSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function addProgress(schemeId: string, kind: string, nowIso: string): SaveResult {
  const event = ProgressEventSchema.safeParse({ schemeId, kind, at: nowIso, enteredBy: "user" });
  if (!event.success) {
    return { ok: false, error: "This record could not be saved because its details are invalid." };
  }
  try {
    const next = [...loadProgress(), event.data];
    globalThis.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
    return { ok: true };
  } catch {
    return { ok: false, error: "This browser could not save your record. Storage may be full or turned off." };
  }
}

export function clearProgress(): void {
  try {
    globalThis.localStorage.removeItem(PROGRESS_STORAGE_KEY);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}
