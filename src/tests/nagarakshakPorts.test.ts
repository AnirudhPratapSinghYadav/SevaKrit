import { describe, expect, it } from "vitest";
import { cn } from "../lib/cn";
import { queryWithTimeout } from "../lib/queryWithTimeout";
import { assertPocketPrivacy } from "../domain/haqPocket";
import { clearActivity, loadActivity, pushActivity } from "../services/activityInbox";

describe("Nagarakshak-adapted utilities", () => {
  it("cn joins truthy class fragments", () => {
    expect(cn("a", false, null, "b", undefined)).toBe("a b");
  });

  it("queryWithTimeout resolves fast promises and rejects slow ones", async () => {
    await expect(queryWithTimeout(Promise.resolve(7), 200, "fast")).resolves.toBe(7);
    await expect(
      queryWithTimeout(new Promise(() => undefined), 30, "slow"),
    ).rejects.toThrow(/timed out/i);
  });

  it("activity inbox stores local notes without government status claims", () => {
    clearActivity();
    pushActivity("watch_baseline", "Remembered", "Local baseline only");
    const items = loadActivity();
    expect(items).toHaveLength(1);
    expect(items[0]?.body).not.toMatch(/approved|rejected by department/i);
    clearActivity();
  });

  it("keeps HaqPocket QR privacy invariant", () => {
    expect(assertPocketPrivacy("https://example.com/public/schemes/x").ok).toBe(true);
  });
});
