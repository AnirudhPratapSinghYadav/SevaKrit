import type { EvaluationDetail } from "./evaluate";
import type { Scheme, SourceRecord } from "./types";
import { loadProgress } from "../services/progressRepository";

export type ResolveIssueKind =
  | "missing_information"
  | "incomplete_preparation"
  | "unclear_instructions"
  | "pending_self_progress"
  | "contradictory_sources"
  | "reported_rejection";

export interface ResolveAdvice {
  kind: ResolveIssueKind;
  title: string;
  known: string[];
  needsConfirmation: string[];
  nextSteps: string[];
  enquiryRoute: string | null;
  disclaimer: string;
}

function sourceFor(scheme: Scheme, sources: SourceRecord[]): SourceRecord | undefined {
  return sources.find((item) => scheme.sourceIds.includes(item.id));
}

/** Guided troubleshooting from verified catalogue fields + evaluation state. No invented appeals. */
export function diagnoseIssue(
  kind: ResolveIssueKind,
  scheme: Scheme,
  detail: EvaluationDetail,
  sources: SourceRecord[],
): ResolveAdvice {
  const source = sourceFor(scheme, sources);
  const enquiryRoute = source?.url ?? null;
  const baseDisclaimer =
    "HaqResolve does not access government application status and does not guarantee outcomes.";

  switch (kind) {
    case "missing_information":
      return {
        kind,
        title: "Missing supporting information",
        known: [
          `Current outcome: ${detail.assessment.outcome}.`,
          detail.assessment.unknown.length > 0
            ? `Rules still unknown: ${detail.assessment.unknown.join(", ")}.`
            : "No unknown rules are listed on this evaluation.",
        ],
        needsConfirmation: detail.assessment.unknown.map((id) => `Confirm the fact behind rule ${id}.`),
        nextSteps: [
          "Return to Describe household and answer the follow-up questions marked unknown.",
          "Do not invent answers to force a likely-fit result.",
        ],
        enquiryRoute,
        disclaimer: baseDisclaimer,
      };
    case "incomplete_preparation":
      return {
        kind,
        title: "Incomplete preparation",
        known: [
          scheme.documents.length > 0
            ? `Catalogue documents: ${scheme.documents.join(" · ")}`
            : "No document list is recorded on the verified source.",
          `Application channel on record: ${scheme.applicationChannel}`,
        ],
        needsConfirmation: [
          "Confirm with the Gram Panchayat or listed portal which proofs they currently accept.",
        ],
        nextSteps: scheme.steps.length > 0 ? [...scheme.steps] : ["Ask the designated office for the preparation checklist."],
        enquiryRoute,
        disclaimer: baseDisclaimer,
      };
    case "unclear_instructions":
      return {
        kind,
        title: "Unclear department instructions",
        known: [`Channel on file: ${scheme.applicationChannel}`],
        needsConfirmation: ["Ask the office which written instruction applies to your village."],
        nextSteps: [
          "Bring the official source link printed from HaqPath.",
          "Request the instruction in writing from the designated officer listed on the scheme page when available.",
        ],
        enquiryRoute,
        disclaimer: baseDisclaimer,
      };
    case "pending_self_progress": {
      const events = loadProgress().filter((event) => event.schemeId === scheme.id);
      return {
        kind,
        title: "Pending self-reported progress",
        known: [
          `Self-reported steps saved in this browser: ${events.length}.`,
          "These marks are not an official status.",
        ],
        needsConfirmation: ["Confirm any real filing only with the department."],
        nextSteps: [
          "Use Plan to review or undo self-reported steps.",
          "Follow the recorded application path; do not treat browser progress as approval.",
        ],
        enquiryRoute,
        disclaimer: baseDisclaimer,
      };
    }
    case "contradictory_sources":
      return {
        kind,
        title: "Contradictory or conflicting sources",
        known: [
          source ? `Primary source status: ${source.status}.` : "Primary source record is not loaded.",
          detail.assessment.outcome === "source_review_needed"
            ? "Evaluation is already blocked for source review."
            : "Evaluation is not currently blocked; still verify before applying.",
        ],
        needsConfirmation: ["Ask the office which circular is current."],
        nextSteps: [
          "Open the official source URL recorded on the scheme.",
          "Do not treat HaqPath as resolving a conflict between government documents.",
        ],
        enquiryRoute,
        disclaimer: baseDisclaimer,
      };
    case "reported_rejection":
      return {
        kind,
        title: "Reported rejection or correction request",
        known: [
          "HaqPath has no access to the department file.",
          "Appeal routes are only shown when listed on the verified catalogue entry.",
        ],
        needsConfirmation: [
          "Confirm the written reason given by the office.",
          "Confirm whether a correction window was stated in writing.",
        ],
        nextSteps: scheme.steps.filter((step) => /appeal|appellate|correction|gram sabha/i.test(step)),
        enquiryRoute,
        disclaimer:
          `${baseDisclaimer} Appeal procedures or deadlines are never invented; only catalogue text is shown.`,
      };
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}
