function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** UTC stamp in basic iCalendar form: YYYYMMDDTHHMMSSZ */
export function toIcsUtc(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

export function escapeIcsText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export interface IcsEventInput {
  uid: string;
  summary: string;
  description: string;
  startIso: string;
  durationMinutes?: number;
  nowIso: string;
}

/** Personal reminder only. Callers must not pass household narratives or ID numbers. */
export function buildPersonalFollowUpIcs(input: IcsEventInput): string {
  const start = new Date(input.startIso);
  if (Number.isNaN(start.getTime())) {
    throw new Error("Invalid start");
  }
  const end = new Date(start.getTime() + (input.durationMinutes ?? 30) * 60 * 1000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//HaqPath//SevaKrit//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(input.uid)}`,
    `DTSTAMP:${toIcsUtc(input.nowIso)}`,
    `DTSTART:${toIcsUtc(start.toISOString())}`,
    `DTEND:${toIcsUtc(end.toISOString())}`,
    `SUMMARY:${escapeIcsText(input.summary)}`,
    `DESCRIPTION:${escapeIcsText(input.description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `${lines.join("\r\n")}\r\n`;
}
