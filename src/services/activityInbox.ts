import { z } from "zod";

/**
 * Browser-local activity inbox adapted from Nagarakshak notification list UX.
 * Never claims government application status or SMS delivery.
 */
export const ACTIVITY_STORAGE_KEY = "haqpath.activity.v1";

const ActivityItemSchema = z
  .object({
    id: z.string(),
    kind: z.enum(["watch_baseline", "progress_saved", "pocket_printed", "resolve_opened"]),
    title: z.string(),
    body: z.string(),
    at: z.string(),
    read: z.boolean(),
  })
  .strict();

export type ActivityItem = z.infer<typeof ActivityItemSchema>;
const ListSchema = z.array(ActivityItemSchema);

export function loadActivity(): ActivityItem[] {
  try {
    const raw = globalThis.localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (raw === null) return [];
    const parsed = ListSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function pushActivity(
  kind: ActivityItem["kind"],
  title: string,
  body: string,
  at = new Date().toISOString(),
): void {
  const item: ActivityItem = {
    id: `${kind}-${at}-${Math.random().toString(36).slice(2, 8)}`,
    kind,
    title,
    body,
    at,
    read: false,
  };
  try {
    const next = [item, ...loadActivity()].slice(0, 40);
    globalThis.localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* best-effort */
  }
}

export function markActivityRead(id: string): void {
  try {
    const next = loadActivity().map((item) => (item.id === id ? { ...item, read: true } : item));
    globalThis.localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function clearActivity(): void {
  try {
    globalThis.localStorage.removeItem(ACTIVITY_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
