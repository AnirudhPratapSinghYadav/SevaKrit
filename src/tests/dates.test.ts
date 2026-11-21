import { describe, expect, it } from "vitest";
import { effectiveOn, formatIstDate, isOnOrAfter, isStale } from "../domain/dates";

describe("isOnOrAfter", () => {
  it("is true on the same day and later days", () => {
    expect(isOnOrAfter("2025-01-01", "2025-01-01")).toBe(true);
    expect(isOnOrAfter("2025-01-02", "2025-01-01")).toBe(true);
  });

  it("is false on an earlier day", () => {
    expect(isOnOrAfter("2024-12-31", "2025-01-01")).toBe(false);
  });
});

describe("isStale", () => {
  const now = "2025-06-01";

  it("is not stale exactly 365 days before now", () => {
    expect(isStale("2024-06-01", now)).toBe(false);
  });

  it("is stale 366 days before now", () => {
    expect(isStale("2024-05-31", now)).toBe(true);
  });

  it("respects a custom day window", () => {
    expect(isStale("2025-05-01", now, 30)).toBe(true);
    expect(isStale("2025-05-03", now, 30)).toBe(false);
  });

  it("treats the not-yet-checked sentinel as stale", () => {
    expect(isStale("not-yet-checked", now)).toBe(true);
  });

  it("accepts a datetime for now by using its date part", () => {
    expect(isStale("2024-06-01", "2025-06-01T23:59:59Z")).toBe(false);
  });
});

describe("effectiveOn", () => {
  it("is inclusive at both ends", () => {
    expect(effectiveOn("2025-01-01", "2025-12-31", "2025-01-01")).toBe(true);
    expect(effectiveOn("2025-01-01", "2025-12-31", "2025-12-31")).toBe(true);
  });

  it("is false outside the range", () => {
    expect(effectiveOn("2025-01-01", "2025-12-31", "2024-12-31")).toBe(false);
    expect(effectiveOn("2025-01-01", "2025-12-31", "2026-01-01")).toBe(false);
  });

  it("treats undefined bounds as open", () => {
    expect(effectiveOn(undefined, undefined, "1990-01-01")).toBe(true);
    expect(effectiveOn("2025-01-01", undefined, "2099-01-01")).toBe(true);
    expect(effectiveOn(undefined, "2025-01-01", "2024-01-01")).toBe(true);
    expect(effectiveOn(undefined, "2025-01-01", "2025-01-02")).toBe(false);
  });
});

describe("formatIstDate", () => {
  it("moves a late-UTC instant to the next day in India Standard Time", () => {
    // 2025-01-01T23:30Z is 2025-01-02 05:00 in IST.
    expect(formatIstDate("2025-01-01T23:30:00Z")).toMatch(/2 Jan 2025/);
  });

  it("formats a date-only value with the day and year", () => {
    expect(formatIstDate("2025-03-15")).toMatch(/15 Mar 2025/);
  });
});
