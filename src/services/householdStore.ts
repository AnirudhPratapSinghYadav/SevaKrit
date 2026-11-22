import { z } from "zod";

export const HOUSEHOLD_STORAGE_KEY = "haqpath.household.v1";

const FactValue = z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]);

const StoredHouseholdSchema = z
  .object({
    confirmedFacts: z.record(z.string(), FactValue),
    followUpAnswers: z.record(z.string(), FactValue),
    unknownFacts: z.array(z.string()),
  })
  .strict();

export type StoredHousehold = z.infer<typeof StoredHouseholdSchema>;

export const EMPTY_HOUSEHOLD: StoredHousehold = {
  confirmedFacts: {},
  followUpAnswers: {},
  unknownFacts: [],
};

export function loadHousehold(): StoredHousehold {
  try {
    const raw = globalThis.localStorage.getItem(HOUSEHOLD_STORAGE_KEY);
    if (raw === null) return EMPTY_HOUSEHOLD;
    const parsed = StoredHouseholdSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : EMPTY_HOUSEHOLD;
  } catch {
    return EMPTY_HOUSEHOLD;
  }
}

export function saveHousehold(value: StoredHousehold): void {
  const parsed = StoredHouseholdSchema.safeParse(value);
  if (!parsed.success) return;
  try {
    globalThis.localStorage.setItem(HOUSEHOLD_STORAGE_KEY, JSON.stringify(parsed.data));
  } catch {
    // Storage may be unavailable; the in-memory session still works.
  }
}

export function clearHouseholdStorage(): void {
  try {
    globalThis.localStorage.removeItem(HOUSEHOLD_STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}
