import { useState } from "react";
import { loadActivity, markActivityRead, type ActivityItem } from "../services/activityInbox";
import { useLanguage } from "../i18n/Language";

/** Local activity list — Nagarakshak notification panel idea without claiming government status. */
export default function ActivityInbox() {
  const { t } = useLanguage();
  const [items, setItems] = useState<ActivityItem[]>(() => loadActivity());

  return (
    <section className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4">
      <h2 className="font-semibold text-ink">{t("activityTitle")}</h2>
      <p className="text-sm text-ink-soft">{t("activityDisclaimer")}</p>
      {items.length === 0 ? (
        <p className="text-sm">{t("activityEmpty")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.slice(0, 8).map((item) => (
            <li key={item.id} className="rounded-md border border-sage px-3 py-2 text-sm">
              <p className="font-semibold text-ink">{item.title}</p>
              <p className="text-ink-soft">{item.body}</p>
              {!item.read && (
                <button
                  type="button"
                  className="mt-1 underline underline-offset-4"
                  onClick={() => {
                    markActivityRead(item.id);
                    setItems(loadActivity());
                  }}
                >
                  Mark read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
