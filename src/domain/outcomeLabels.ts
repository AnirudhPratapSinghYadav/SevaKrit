import type { Outcome } from "./types";

/** Display labels for evaluation outcomes. Strings match the Results page. */
export const OUTCOME_LABELS: Record<Outcome, string> = {
  likely_fit: "Likely fit",
  needs_information: "Needs information",
  likely_mismatch: "Likely mismatch",
  source_review_needed: "Source under review",
};
