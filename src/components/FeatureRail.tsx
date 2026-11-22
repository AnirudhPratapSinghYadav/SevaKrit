import { NavLink } from "react-router-dom";
import { useLanguage } from "../i18n/Language";

const TOOLS = [
  { to: "/tools/compass", key: "toolCompass" as const },
  { to: "/tools/pocket", key: "toolPocket" as const },
  { to: "/tools/resolve", key: "toolResolve" as const },
  { to: "/tools/watch", key: "toolWatch" as const },
  { to: "/tools/route", key: "toolRoute" as const },
];

/** Compact rail so the five innovations sit inside the citizen journey, not a separate dashboard. */
export default function FeatureRail() {
  const { t } = useLanguage();
  return (
    <nav
      aria-label={t("toolsNav")}
      className="glass-panel flex flex-wrap gap-2 rounded-2xl px-3 py-3"
    >
      <p className="basis-full text-sm font-semibold text-ink">{t("toolsNav")}</p>
      {TOOLS.map((tool) => (
        <NavLink
          key={tool.to}
          to={tool.to}
          className={({ isActive }) =>
            `inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold underline-offset-4 transition ${
              isActive
                ? "bg-ink text-canvas shadow-[0_8px_24px_rgba(23,59,53,0.2)]"
                : "border border-border/70 bg-surface/70 text-ink hover:-translate-y-0.5 hover:underline"
            }`
          }
        >
          {t(tool.key)}
        </NavLink>
      ))}
    </nav>
  );
}
