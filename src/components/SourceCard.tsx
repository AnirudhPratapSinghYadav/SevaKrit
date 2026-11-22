import type { SourceRecord } from "../domain/types";

type SourceCardProps = {
  /** Publisher named on the source record, e.g. the department. */
  authority: string;
  /** Official URL from the source record. */
  url: string;
  /** Review status exactly as recorded on the source. */
  status: SourceRecord["status"];
  /** Human verification date from the scheme record, or null when none is recorded. */
  verifiedOn: string | null;
};

/** Source metadata shown as text. The status and date are never inferred or invented. */
export default function SourceCard({ authority, url, status, verifiedOn }: SourceCardProps) {
  return (
    <section className="flex flex-col gap-2 rounded-md border border-sage bg-canvas px-3 py-2 text-sm">
      <h3 className="font-semibold text-ink">Source record</h3>
      <p>Authority: {authority}</p>
      <p>Status: {status}</p>
      <p>
        {verifiedOn === null ? "Human verification date not recorded" : `Human verification date: ${verifiedOn}`}
      </p>
      <a href={url} rel="noopener noreferrer" target="_blank" className="underline underline-offset-4">
        Open official source
      </a>
    </section>
  );
}
