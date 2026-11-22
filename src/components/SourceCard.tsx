import type { SourceRecord } from "../domain/types";
import { useLanguage } from "../i18n/Language";

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
  const { lang } = useLanguage();
  const hi = lang === "hi";

  return (
    <section className="glass-panel flex flex-col gap-3 rounded-2xl px-4 py-4 text-sm">
      <h3 className="font-display text-lg font-semibold text-ink">
        {hi ? "स्रोत रिकॉर्ड" : "Source record"}
      </h3>
      <p>{hi ? `प्राधिकरण: ${authority}` : `Authority: ${authority}`}</p>
      <p>{hi ? `स्थिति: ${status}` : `Status: ${status}`}</p>
      <p className="text-ink-soft">
        {verifiedOn === null
          ? hi
            ? "मानव सत्यापन तिथि दर्ज नहीं"
            : "Human verification date not recorded"
          : hi
            ? `मानव सत्यापन तिथि: ${verifiedOn}`
            : `Human verification date: ${verifiedOn}`}
      </p>
      <a href={url} rel="noopener noreferrer" target="_blank" className="btn-official pressable w-fit no-underline">
        {hi ? "आधिकारिक स्रोत खोलें" : "Open official source"}
      </a>
    </section>
  );
}
