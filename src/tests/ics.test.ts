import { describe, expect, it } from "vitest";
import { buildPersonalFollowUpIcs, escapeIcsText } from "../services/ics";

describe("ICS export", () => {
  it("builds a calendar with a personal follow-up and no household narrative", () => {
    const ics = buildPersonalFollowUpIcs({
      uid: "haqpath-demo@local",
      summary: "HaqPath personal follow-up",
      description: "Personal reminder. Not an official government deadline.",
      startIso: "2026-12-01T09:30:00.000Z",
      nowIso: "2026-11-22T12:00:00.000Z",
      durationMinutes: 30,
    });
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("VERSION:2.0");
    expect(ics).toContain("PRODID:-//HaqPath//SevaKrit//EN");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("UID:haqpath-demo@local");
    expect(ics).toContain("DTSTART:20261201T093000Z");
    expect(ics).toContain("DTEND:20261201T100000Z");
    expect(ics).toContain("DTSTAMP:20261122T120000Z");
    expect(ics).toContain("END:VEVENT");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).not.toMatch(/aadhaar|Baiga|Dindori/i);
  });

  it("escapes commas and newlines in text", () => {
    expect(escapeIcsText("a,b;c\n")).toBe("a\\,b\\;c\\n");
  });
});
