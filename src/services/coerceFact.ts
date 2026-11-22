import type { HouseholdProfile } from "../domain/types";

type FactValue = HouseholdProfile["confirmedFacts"][string];

export type CoerceResult =
  | { kind: "value"; value: FactValue }
  | { kind: "unknown" }
  | { kind: "invalid"; message: string };

const UNKNOWN_ANSWERS = new Set(["i don't know", "dont know", "don't know", "unknown", "not sure", "unsure"]);

/**
 * Converts a free-text follow-up answer into a typed fact value used by the rule engine.
 * Returns unknown for honest "I don't know" answers instead of inventing a boolean/string.
 */
export function coerceFollowUpAnswer(factKey: string, raw: string): CoerceResult {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return { kind: "invalid", message: "Please enter an answer, or say you don't know." };
  }
  const lowered = trimmed.toLowerCase();
  if (UNKNOWN_ANSWERS.has(lowered)) {
    return { kind: "unknown" };
  }

  if (factKey === "hasGovernmentEmployee") {
    if (["yes", "y", "true"].includes(lowered)) return { kind: "value", value: true };
    if (["no", "n", "false"].includes(lowered)) return { kind: "value", value: false };
    return {
      kind: "invalid",
      message: "Answer Yes, No, or I don't know.",
    };
  }

  if (factKey === "settlementArea") {
    if (lowered === "rural") return { kind: "value", value: "rural" };
    if (lowered === "urban") return { kind: "value", value: "urban" };
    return {
      kind: "invalid",
      message: "Answer rural, urban, or I don't know.",
    };
  }

  if (factKey === "houseType") {
    if (["kutcha", "kachcha", "kachha"].includes(lowered)) return { kind: "value", value: "kutcha" };
    if (["pucca", "pakka", "pakki"].includes(lowered)) return { kind: "value", value: "pucca" };
    return { kind: "invalid", message: "Answer kutcha, pucca, or I don't know." };
  }

  // Default: keep trimmed text for string rules (district, tribal group, etc.).
  return { kind: "value", value: trimmed };
}
