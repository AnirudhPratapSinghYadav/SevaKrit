import { useLanguage } from "../i18n/Language";
import { getSupabase } from "../services/supabaseBrowser";

/** Honest connection state: local catalogue vs configured public Supabase URL. */
export default function ConnectionBadge() {
  const { t } = useLanguage();
  const online = getSupabase() !== null;
  return (
    <p
      className={`rounded-md px-3 py-2 text-sm ${
        online ? "bg-info-bg text-info-ink" : "bg-surface-muted text-ink-soft"
      }`}
      role="status"
    >
      {online ? t("onlineBadge") : t("offlineBadge")}
    </p>
  );
}
