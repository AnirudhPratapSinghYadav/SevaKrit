import { describe, expect, it } from "vitest";
import { assertPocketPrivacy, buildPocketCard } from "../domain/haqPocket";
import { getPublishedSchemes, getSources } from "../services/schemeRepository";

describe("HaqPocket", () => {
  it("encodes only a public scheme path in the QR payload", () => {
    const scheme = getPublishedSchemes()[0]!;
    const card = buildPocketCard(scheme, getSources(), "http://127.0.0.1:5173");
    expect(card.qrPayload).toBe(`http://127.0.0.1:5173/public/schemes/${scheme.id}`);
    expect(assertPocketPrivacy(card.qrPayload)).toEqual({ ok: true });
  });

  it("rejects payloads that look like household or identity data", () => {
    expect(assertPocketPrivacy("http://x/public/schemes/a?aadhaar=1").ok).toBe(false);
    expect(assertPocketPrivacy("http://x/private").ok).toBe(false);
  });
});
