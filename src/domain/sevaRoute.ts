import type { Scheme, SourceRecord } from "./types";
import { loadProgress, addProgress, undoLastProgress } from "../services/progressRepository";

export type VisitTaskStatus = "open" | "done" | "verification_needed";

export interface VisitTask {
  id: string;
  schemeId: string;
  label: string;
  prerequisiteOf: string[];
  materials: string[];
  status: VisitTaskStatus;
  officialLocationKnown: boolean;
}

export interface VisitPlan {
  schemeId: string;
  titleEn: string;
  tasks: VisitTask[];
  groupingNote: string;
  locationNote: string;
  printableLines: string[];
}

/**
 * Dependency-aware visit planner from verified scheme steps only.
 * Does not invent addresses, hours, travel times, or appointments.
 */
export function buildSevaRoute(scheme: Scheme, sources: SourceRecord[]): VisitPlan {
  const source = sources.find((item) => scheme.sourceIds.includes(item.id));
  const progress = loadProgress().filter((event) => event.schemeId === scheme.id);
  const applied = progress.some((event) => event.kind === "applied");

  const officialLocationKnown = /gram panchayat|janpad|portal|pmayg|office|helpline/i.test(
    scheme.applicationChannel,
  );

  const tasks: VisitTask[] = scheme.steps.map((step, index) => {
    const id = `${scheme.id}:step:${index}`;
    const materials =
      index === 0
        ? scheme.documents.length > 0
          ? [...scheme.documents]
          : ["Ask the office which documents they currently accept — list not fully stated on source."]
        : [];
    const verificationNeeded =
      !officialLocationKnown ||
      /confirm|not stated|verify|department still decides/i.test(step) ||
      scheme.documents.some((doc) => /not stated|confirm/i.test(doc));

    return {
      id,
      schemeId: scheme.id,
      label: step,
      prerequisiteOf: index < scheme.steps.length - 1 ? [`${scheme.id}:step:${index + 1}`] : [],
      materials,
      status: applied && index === 0 ? "done" : verificationNeeded ? "verification_needed" : "open",
      officialLocationKnown,
    };
  });

  const locationNote = officialLocationKnown
    ? `Application channel on the verified record: ${scheme.applicationChannel}. Exact street address and hours are not invented here.`
    : "Verification needed: the catalogue does not state a precise visit location.";

  return {
    schemeId: scheme.id,
    titleEn: scheme.title.en,
    tasks,
    groupingNote:
      "Tasks follow the order listed on the verified scheme record. Related preparation is grouped with the first step when documents are listed.",
    locationNote,
    printableLines: [
      scheme.title.en,
      locationNote,
      ...tasks.map((task, index) => `${index + 1}. [${task.status}] ${task.label}`),
      source ? `Official source: ${source.url}` : "Official source URL not loaded.",
      "Personal checklist only — not an official appointment slip.",
    ],
  };
}

export function markVisitApplied(schemeId: string, nowIso: string) {
  return addProgress(schemeId, "applied", nowIso);
}

export function undoVisitApplied(schemeId: string) {
  return undoLastProgress(schemeId);
}
