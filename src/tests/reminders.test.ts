import { describe, expect, it } from "vitest";
import { buildReminders } from "../services/reminders";

const NOW = "2025-01-15T10:00:00.000Z";

describe("buildReminders", () => {
  it("produces no official reminder when the deadline is null", () => {
    const result = buildReminders({
      schemeId: "synthetic-scheme",
      officialDeadline: null,
      personalFollowUp: null,
      nowIso: NOW,
    });
    expect(result).toEqual([]);
  });

  it("produces one official_deadline reminder for a valid deadline", () => {
    const result = buildReminders({
      schemeId: "synthetic-scheme",
      officialDeadline: "2025-02-01",
      personalFollowUp: null,
      nowIso: NOW,
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      kind: "official_deadline",
      schemeId: "synthetic-scheme",
      dueAt: "2025-02-01",
      status: "upcoming",
    });
  });

  it("produces one personal_follow_up reminder", () => {
    const result = buildReminders({
      schemeId: "synthetic-scheme",
      officialDeadline: null,
      personalFollowUp: { dueAt: "2025-02-01T10:00:00+05:30", timezone: "Asia/Kolkata" },
      nowIso: NOW,
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ kind: "personal_follow_up", schemeId: "synthetic-scheme" });
  });

  it("skips an invalid deadline date without throwing", () => {
    const invalid = ["2025-02-30", "not a date", "15/01/2025", ""];
    for (const value of invalid) {
      expect(() =>
        buildReminders({
          schemeId: "synthetic-scheme",
          officialDeadline: value,
          personalFollowUp: null,
          nowIso: NOW,
        }),
      ).not.toThrow();
      expect(
        buildReminders({
          schemeId: "synthetic-scheme",
          officialDeadline: value,
          personalFollowUp: null,
          nowIso: NOW,
        }),
      ).toEqual([]);
    }
  });

  it("skips an invalid follow-up date and an invalid now without throwing", () => {
    expect(
      buildReminders({
        schemeId: "synthetic-scheme",
        officialDeadline: null,
        personalFollowUp: { dueAt: "tomorrow morning", timezone: "Asia/Kolkata" },
        nowIso: NOW,
      }),
    ).toEqual([]);
    expect(
      buildReminders({
        schemeId: "synthetic-scheme",
        officialDeadline: "2025-02-01",
        personalFollowUp: null,
        nowIso: "garbage",
      }),
    ).toEqual([]);
  });

  it("marks a past deadline overdue and a future one upcoming relative to nowIso", () => {
    const past = buildReminders({
      schemeId: "synthetic-scheme",
      officialDeadline: "2025-01-10",
      personalFollowUp: null,
      nowIso: NOW,
    });
    expect(past[0]?.status).toBe("overdue");

    const future = buildReminders({
      schemeId: "synthetic-scheme",
      officialDeadline: "2025-02-01",
      personalFollowUp: null,
      nowIso: NOW,
    });
    expect(future[0]?.status).toBe("upcoming");
  });

  it("marks a deadline on the same UTC day as nowIso as due", () => {
    const result = buildReminders({
      schemeId: "synthetic-scheme",
      officialDeadline: "2025-01-15",
      personalFollowUp: null,
      nowIso: NOW,
    });
    expect(result[0]?.status).toBe("due");
  });

  it("preserves the timezone and the offset of a personal follow-up", () => {
    const dueAt = "2025-02-01T10:00:00+05:30";
    const result = buildReminders({
      schemeId: "synthetic-scheme",
      officialDeadline: null,
      personalFollowUp: { dueAt, timezone: "Asia/Kolkata" },
      nowIso: NOW,
    });
    expect(result[0]).toMatchObject({ dueAt, timezone: "Asia/Kolkata", status: "upcoming" });
  });
});
