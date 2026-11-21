// Pure date helpers. No Date.now(): callers pass the reference instant explicitly.

const DAY_MS = 86_400_000;
const ISO_DAY = /^(\d{4})-(\d{2})-(\d{2})/;

/** ISO date strings (YYYY-MM-DD) compare correctly as strings. */
export function isOnOrAfter(a: string, b: string): boolean {
  return a >= b;
}

/** UTC day number for the YYYY-MM-DD prefix of an ISO string, or null if unparseable. */
function utcDayNumber(iso: string): number | null {
  const match = ISO_DAY.exec(iso);
  if (!match) return null;
  const ms = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(ms) ? null : Math.floor(ms / DAY_MS);
}

/**
 * True when `checkedAt` is more than `days` days before `now`.
 * Unparseable values (e.g. the "not-yet-checked" sentinel) count as stale.
 */
export function isStale(checkedAt: string, now: string, days = 365): boolean {
  const checked = utcDayNumber(checkedAt);
  const current = utcDayNumber(now);
  if (checked === null || current === null) return true;
  return current - checked > days;
}

/** Inclusive check: `date` is within [effectiveFrom, effectiveTo]; undefined bounds are open. */
export function effectiveOn(
  effectiveFrom: string | undefined,
  effectiveTo: string | undefined,
  date: string,
): boolean {
  if (effectiveFrom !== undefined && date < effectiveFrom) return false;
  if (effectiveTo !== undefined && date > effectiveTo) return false;
  return true;
}

const IST_DATE = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Formats an ISO timestamp or date as a day in India Standard Time, e.g. "2 Jan 2025". */
export function formatIstDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return IST_DATE.format(date);
}
