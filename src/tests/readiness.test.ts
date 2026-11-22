import { describe, expect, it } from "vitest";
import { documentRows } from "../domain/readiness";

describe("documentRows", () => {
  it("does not call an empty list 'not required'", () => {
    const rows = documentRows([]);
    expect(rows[0]?.readiness).toBe("verify_with_department");
    expect(rows[0]?.text.toLowerCase()).not.toContain("not required");
  });

  it("keeps an unstated official list as verify", () => {
    const rows = documentRows(["Document list is not stated on the CM Helpline scheme page"]);
    expect(rows[0]?.readiness).toBe("verify_with_department");
  });
});
