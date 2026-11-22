// Deterministic keyword parser. Proposes facts only; never confirms them. No AI, no network.
import { z } from "zod";

export const FACT_KEYS = [
  "tribalGroup",
  "district",
  "houseType",
  "dairyIntent",
  "hasGovernmentEmployee",
  "settlementArea",
] as const;
export const FactKeySchema = z.enum(FACT_KEYS);
export type FactKey = z.infer<typeof FactKeySchema>;

export const ProposedFactSchema = z
  .object({
    factKey: FactKeySchema,
    value: z.union([z.string(), z.boolean()]),
    evidenceSnippet: z.string(),
    confirmed: z.literal(false),
  })
  .strict();
export type ProposedFact = z.infer<typeof ProposedFactSchema>;

export const FACT_LABELS: Record<FactKey, string> = {
  tribalGroup: "Tribal group",
  district: "District",
  houseType: "House type",
  dairyIntent: "Wants to keep dairy animals",
  hasGovernmentEmployee: "Any household member is a government employee",
  settlementArea: "Settlement area",
};

export const EXAMPLE_NARRATIVE =
  "We are a Baiga family in Dindori; our house is kutcha, my mother does not work for the government, and I want to start keeping dairy animals.";

export const MAX_NARRATIVE_LENGTH = 2000;

const TRIBAL_GROUPS = ["Baiga", "Bharia", "Sahariya"] as const;
/** Districts named on the verified PM-JANMAN CM Helpline listing (Schemeid=974). */
const DISTRICTS = [
  "Anuppur",
  "Ashoknagar",
  "Bhind",
  "Balaghat",
  "Chhindwara",
  "Datia",
  "Dindori",
  "Guna",
  "Gwalior",
  "Katni",
  "Jabalpur",
  "Narsinghpur",
  "Mandla",
  "Morena",
  "Shahdol",
  "Sheopur",
  "Shivpuri",
  "Raisen",
  "Satna",
  "Singrauli",
  "Sidhi",
  "Seoni",
  "Vidisha",
  "Umaria",
] as const;
const KUTCHA_WORDS = ["kutcha", "kachcha", "kachha"] as const;
const PUCCA_WORDS = ["pucca", "pakka", "pakki"] as const;
const DAIRY_PATTERN =
  /\b(start|starting|keep|keeping|rear|rearing|raise|raising|buy|buying|begin|beginning)\b[^.;!?]*?\b(dairy|cows?|buffal(?:o|oes)|goats?|animals?|livestock|milch)\b/i;

/** True when the clause before the index (split on punctuation) contains a negation. */
function negatedBefore(text: string, index: number): boolean {
  const clause = text.slice(0, index).split(/[.;!?,]/).pop() ?? "";
  return /\b(not|never|no|isn't|aren't|don't|doesn't)\b/i.test(clause);
}

interface Hit {
  value: string;
  snippet: string;
}

/** First listed word found in text and not negated. Returns the canonical (list) spelling. */
function findWord(text: string, words: readonly string[]): Hit | null {
  for (const word of words) {
    const match = new RegExp(`\\b${word}\\b`, "i").exec(text);
    if (match && !negatedBefore(text, match.index)) {
      return { value: word, snippet: match[0] };
    }
  }
  return null;
}

function findHouseType(text: string): Hit | null {
  const kutcha = findWord(text, KUTCHA_WORDS);
  if (kutcha) return { value: "kutcha", snippet: kutcha.snippet };
  const pucca = findWord(text, PUCCA_WORDS);
  if (pucca) return { value: "pucca", snippet: pucca.snippet };
  return null;
}

function findDairyIntent(text: string): Hit | null {
  const match = DAIRY_PATTERN.exec(text);
  if (!match || negatedBefore(text, match.index)) return null;
  return { value: "true", snippet: match[0] };
}

/**
 * Proposes facts found in the typed text. Output is never confirmed.
 * Unclear or negated mentions produce no proposal. Text that is not about household facts
 * (for example instructions to the tool) produces no proposal either.
 */
export function parseNarrative(input: string): ProposedFact[] {
  if (typeof input !== "string") return [];
  const text = input.slice(0, MAX_NARRATIVE_LENGTH);
  if (text.trim() === "") return [];

  const proposals: ProposedFact[] = [];

  const tribal = findWord(text, TRIBAL_GROUPS);
  if (tribal) {
    proposals.push({ factKey: "tribalGroup", value: tribal.value, evidenceSnippet: tribal.snippet, confirmed: false });
  }
  const district = findWord(text, DISTRICTS);
  if (district) {
    proposals.push({ factKey: "district", value: district.value, evidenceSnippet: district.snippet, confirmed: false });
  }
  const house = findHouseType(text);
  if (house) {
    proposals.push({ factKey: "houseType", value: house.value, evidenceSnippet: house.snippet, confirmed: false });
  }
  const dairy = findDairyIntent(text);
  if (dairy) {
    proposals.push({ factKey: "dairyIntent", value: true, evidenceSnippet: dairy.snippet, confirmed: false });
  }

  return z.array(ProposedFactSchema).parse(proposals);
}
