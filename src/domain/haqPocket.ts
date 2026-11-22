import type { Scheme, SourceRecord } from "./types";

export interface PocketCard {
  schemeId: string;
  titleEn: string;
  titleHi?: string;
  department: string;
  applicationChannel: string;
  steps: string[];
  documents: string[];
  officialUrl: string | null;
  verificationNote: string;
  /** Public path only — never includes household facts. */
  publicPath: string;
  qrPayload: string;
}

/**
 * Build a privacy-safe pocket card. QR payload is only the public scheme URL origin+path.
 * Household answers, progress, and identifiers are never encoded.
 */
export function buildPocketCard(
  scheme: Scheme,
  sources: SourceRecord[],
  origin: string,
): PocketCard {
  const source = sources.find((item) => scheme.sourceIds.includes(item.id));
  const publicPath = `/public/schemes/${scheme.id}`;
  const base = origin.replace(/\/$/, "");
  return {
    schemeId: scheme.id,
    titleEn: scheme.title.en,
    ...(scheme.title.hi !== undefined ? { titleHi: scheme.title.hi } : {}),
    department: scheme.department,
    applicationChannel: scheme.applicationChannel,
    steps: scheme.steps,
    documents: scheme.documents,
    officialUrl: source?.url ?? null,
    verificationNote:
      scheme.lastVerified === null
        ? "Human verification date is not recorded on this catalogue entry."
        : `Last human verification on this catalogue entry: ${scheme.lastVerified}.`,
    publicPath,
    qrPayload: `${base}${publicPath}`,
  };
}

/** Refuse payloads that look like they embed household or identity data. */
export function assertPocketPrivacy(qrPayload: string): { ok: true } | { ok: false; reason: string } {
  const lower = qrPayload.toLowerCase();
  const banned = ["aadhaar", "aadhar", "otp", "account", "ifsc", "password", "confirmedfacts", "narrative"];
  for (const token of banned) {
    if (lower.includes(token)) {
      return { ok: false, reason: `QR payload must not contain "${token}".` };
    }
  }
  if (!qrPayload.includes("/public/schemes/")) {
    return { ok: false, reason: "QR payload must point at a public scheme page." };
  }
  return { ok: true };
}
