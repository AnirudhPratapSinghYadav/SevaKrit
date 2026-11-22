import type { CSSProperties } from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../i18n/Language";

const TOOLS = [
  { to: "/tools/compass", key: "toolCompass" as const, hintEn: "What-if", hintHi: "क्या-अगर", glyph: "◎" },
  { to: "/tools/pocket", key: "toolPocket" as const, hintEn: "Card", hintHi: "कार्ड", glyph: "▣" },
  { to: "/tools/resolve", key: "toolResolve" as const, hintEn: "Unstick", hintHi: "अटकाव", glyph: "✦" },
  { to: "/tools/watch", key: "toolWatch" as const, hintEn: "Versions", hintHi: "संस्करण", glyph: "◉" },
  { to: "/tools/route", key: "toolRoute" as const, hintEn: "Visit", hintHi: "भेंट", glyph: "⇢" },
];

/** Glass command dock for the five Haq tools inside the citizen journey. */
export default function FeatureRail() {
  const { t, lang } = useLanguage();
  const hi = lang === "hi";

  return (
    <nav aria-label={t("toolsNav")} className="feature-rail-host tool-dock tool-dock-compact">
      <p className="basis-full text-sm font-semibold uppercase tracking-[0.16em] text-accent-earth">
        {t("toolsNav")}
      </p>
      {TOOLS.map((tool, index) => (
        <NavLink
          key={tool.to}
          to={tool.to}
          style={{ "--i": index } as CSSProperties}
          className={({ isActive }) =>
            `tool-dock-item pressable ${isActive ? "tool-dock-item-active" : ""}`
          }
        >
          <span className="text-lg leading-none text-accent-gold" aria-hidden>
            {tool.glyph}
          </span>
          <span className="font-display text-base font-semibold text-ink">{t(tool.key)}</span>
          <span className="text-xs text-ink-soft">{hi ? tool.hintHi : tool.hintEn}</span>
        </NavLink>
      ))}
    </nav>
  );
}
