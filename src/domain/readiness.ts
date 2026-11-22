export type DocumentReadiness = "verify_with_department" | "listed";

export interface DocumentRow {
  text: string;
  readiness: DocumentReadiness;
}

/**
 * Official document lines. Text that says the source did not list documents
 * stays "verify", never "not required".
 */
export function documentRows(documents: string[]): DocumentRow[] {
  if (documents.length === 0) {
    return [
      {
        text: "The official source did not specify these documents; confirm with the department.",
        readiness: "verify_with_department",
      },
    ];
  }
  return documents.map((text) => ({
    text,
    readiness: /not stated|did not specify|confirm/i.test(text) ? "verify_with_department" : "listed",
  }));
}
