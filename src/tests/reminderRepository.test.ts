import { afterEach, describe, expect, it, vi } from "vitest";
import {
  loadFollowUps,
  REMINDER_STORAGE_KEY,
  saveFollowUp,
} from "../services/reminderRepository";

// Synthetic in-memory Storage used in place of the browser's localStorage.
function mockStorage() {
  const data = new Map<string, string>();
  return {
    data,
    storage: {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => {
        data.set(key, value);
      },
      removeItem: (key: string) => {
        data.delete(key);
      },
      clear: () => data.clear(),
      key: () => null,
      get length() {
        return data.size;
      },
    },
  };
}

const DUE = "2025-02-01T10:00:00+05:30";

describe("reminderRepository", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("round-trips a saved follow-up and replaces the one for the same scheme", () => {
    const { storage, data } = mockStorage();
    vi.stubGlobal("localStorage", storage);

    expect(saveFollowUp("synthetic-scheme", DUE, "Asia/Kolkata")).toEqual({ ok: true });
    expect(data.has(REMINDER_STORAGE_KEY)).toBe(true);
    expect(loadFollowUps()).toEqual([
      { schemeId: "synthetic-scheme", dueAt: DUE, timezone: "Asia/Kolkata" },
    ]);

    saveFollowUp("synthetic-scheme", "2025-03-01T09:00:00Z", "UTC");
    expect(loadFollowUps()).toEqual([
      { schemeId: "synthetic-scheme", dueAt: "2025-03-01T09:00:00Z", timezone: "UTC" },
    ]);
  });

  it("returns an empty list for corrupt JSON", () => {
    const { storage, data } = mockStorage();
    data.set(REMINDER_STORAGE_KEY, "{not valid json");
    vi.stubGlobal("localStorage", storage);
    expect(loadFollowUps()).toEqual([]);
  });

  it("returns an empty list when stored data has the wrong shape", () => {
    const { storage, data } = mockStorage();
    data.set(REMINDER_STORAGE_KEY, JSON.stringify([{ schemeId: 1, dueAt: "not a date" }]));
    vi.stubGlobal("localStorage", storage);
    expect(loadFollowUps()).toEqual([]);
  });

  it("rejects a save with an invalid date without writing", () => {
    const { storage, data } = mockStorage();
    vi.stubGlobal("localStorage", storage);
    const result = saveFollowUp("synthetic-scheme", "tomorrow", "Asia/Kolkata");
    expect(result.ok).toBe(false);
    expect(data.has(REMINDER_STORAGE_KEY)).toBe(false);
  });

  it("returns ok false when setItem throws", () => {
    const { storage } = mockStorage();
    vi.stubGlobal("localStorage", {
      ...storage,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    });
    const result = saveFollowUp("synthetic-scheme", DUE, "Asia/Kolkata");
    expect(result.ok).toBe(false);
  });

  it("returns an empty list when getItem throws", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("SecurityError");
      },
    });
    expect(loadFollowUps()).toEqual([]);
  });
});
