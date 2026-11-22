import { useState } from "react";
import EmptyState from "./ui/EmptyState";
import { loadActivity, markActivityRead, type ActivityItem } from "../services/activityInbox";
import { useLanguage } from "../i18n/Language";

/** Local activity list — Nagarakshak notification panel idea without claiming government status. */
export default function ActivityInbox() {
  const { t, lang } = useLanguage();
  const [items, setItems] = useState<ActivityItem[]>(() => loadActivity());
  const hi = lang === "hi";

  return (
    <section className="glass-panel flex flex-col gap-4 rounded-[1.6rem] p-5 md:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl font-semibold text-ink">{t("activityTitle")}</h2>
        <p className="text-sm text-ink-soft">{t("activityDisclaimer")}</p>
      </div>
      {items.length === 0 ? (
        <EmptyState
          title={t("activityEmpty")}
          description={hi ? "उपकरण चलाने पर नोट यहाँ दिखेंगे।" : "Notes appear here when you use tools."}
          imageSrc="/images/ui/workspace-empty.jpg"
          className="border-0 bg-transparent py-8 shadow-none"
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {items.slice(0, 8).map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-border/70 bg-surface/85 px-4 py-3 text-sm shadow-[0_8px_24px_rgba(23,59,53,0.08)]"
            >
              <p className="font-semibold text-ink">{item.title}</p>
              <p className="text-ink-soft">{item.body}</p>
              {!item.read && (
                <button
                  type="button"
                  className="mt-2 text-accent-earth underline underline-offset-4"
                  onClick={() => {
                    markActivityRead(item.id);
                    setItems(loadActivity());
                  }}
                >
                  {hi ? "पढ़ा चिह्नित करें" : "Mark read"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
