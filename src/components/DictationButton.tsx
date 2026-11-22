import { useSpeechDictation } from "../hooks/useSpeechDictation";
import { useLanguage } from "../i18n/Language";

type DictationButtonProps = {
  onChunk: (text: string) => void;
};

/** Optional voice input for household narrative — never writes identity fields by itself. */
export default function DictationButton({ onChunk }: DictationButtonProps) {
  const { lang, t } = useLanguage();
  const { supported, listening, error, toggle } = useSpeechDictation({
    lang,
    onTranscript: onChunk,
  });

  if (!supported) {
    return (
      <p className="text-sm text-ink-soft">{t("dictationUnsupported")}</p>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={toggle}
        className="min-h-11 self-start rounded-md border border-ink px-4 font-semibold text-ink"
        aria-pressed={listening}
      >
        {listening ? t("dictationStop") : t("dictationStart")}
      </button>
      {error !== null && (
        <p role="alert" className="text-sm text-error-ink">
          {error}
        </p>
      )}
      <p className="text-sm text-ink-soft">{t("dictationHint")}</p>
    </div>
  );
}
