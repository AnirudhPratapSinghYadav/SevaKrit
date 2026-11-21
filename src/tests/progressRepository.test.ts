import { afterEach, describe, expect, it, vi } from "vitest";
import { addProgress, clearProgress, loadProgress, PROGRESS_STORAGE_KEY } from "../services/progressRepository";

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

const NOW = "2025-01-15T10:00:00.000Z";

describe("progressRepository", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("round-trips an added event", () => {
    const { storage, data } = mockStorage();
    vi.stubGlobal("localStorage", storage);

    const result = addProgress("synthetic-scheme", "applied", NOW);
    expect(result).toEqual({ ok: true });
    expect(data.has(PROGRESS_STORAGE_KEY)).toBe(true);
    expect(loadProgress()).toEqual([
      { schemeId: "synthetic-scheme", kind: "applied", at: NOW, enteredBy: "user" },
    ]);

    clearProgress();
    expect(loadProgress()).toEqual([]);
  });

  it("returns an empty list for corrupt JSON", () => {
    const { storage, data } = mockStorage();
    data.set(PROGRESS_STORAGE_KEY, "{not valid json");
    vi.stubGlobal("localStorage", storage);
    expect(loadProgress()).toEqual([]);
  });

  it("returns an empty list when stored data has the wrong shape", () => {
    const { storage, data } = mockStorage();
    data.set(PROGRESS_STORAGE_KEY, JSON.stringify([{ schemeId: 1, enteredBy: "someone-else" }]));
    vi.stubGlobal("localStorage", storage);
    expect(loadProgress()).toEqual([]);
  });

  it("returns ok false when setItem throws", () => {
    const { storage } = mockStorage();
    vi.stubGlobal("localStorage", {
      ...storage,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    });
    const result = addProgress("synthetic-scheme", "applied", NOW);
    expect(result.ok).toBe(false);
  });
});
