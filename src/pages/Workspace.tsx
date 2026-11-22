import { Link } from "react-router-dom";
import ActivityInbox from "../components/ActivityInbox";
import CitizenGate from "../components/auth/CitizenGate";
import FeatureRail from "../components/FeatureRail";
import { useAuth } from "../context/AuthContext";
import { useAppState } from "../context/AppState";
import { useLanguage } from "../i18n/Language";
import { useScrollReveal } from "../hooks/useScrollReveal";

/** Full-screen product surface: journey hub, not a boxed dashboard. */
export default function Workspace() {
  const { t, lang } = useLanguage();
  const { user, isGuest, signOut } = useAuth();
  const { profile } = useAppState();
  const factCount = Object.keys(profile.confirmedFacts).length;
  const hi = lang === "hi";
  useScrollReveal();

  return (
    <CitizenGate>
      <section className="workspace-atmosphere relative flex min-h-[calc(100svh-7rem)] flex-col gap-8 px-4 py-4 lg:px-8 xl:px-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="orb orb-a absolute -right-10 -top-4 h-48 w-48 bg-[radial-gradient(circle,rgba(223,191,99,0.4),transparent_70%)]" />
          <div className="orb orb-b absolute bottom-16 left-[-2rem] h-56 w-56 bg-[radial-gradient(circle,rgba(23,59,53,0.22),transparent_70%)]" />
        </div>

        <header className="glass-panel relative flex flex-col gap-3 rounded-[1.85rem] p-6 md:flex-row md:items-end md:justify-between md:p-8" data-reveal>
          <div className="flex max-w-3xl flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-earth">{t("workspaceEyebrow")}</p>
            <h1 className="font-display text-4xl font-semibold text-ink md:text-5xl">{t("workspaceTitle")}</h1>
            <p className="text-lg text-ink-soft">{t("workspaceIntro")}</p>
          </div>
          <p className="text-sm text-ink-soft">
            {user
              ? `${t("workspaceSignedIn")}: ${user.name}`
              : isGuest
                ? t("workspaceGuest")
                : t("workspaceOpen")}
            {user && (
              <>
                {" · "}
                <button type="button" onClick={() => void signOut()} className="underline underline-offset-4">
                  {t("loginSignOut")}
                </button>
              </>
            )}
          </p>
        </header>

        <div className="workspace-dash" data-reveal>
          <div className="flex flex-col gap-4">
            <FeatureRail />
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                to="/discover"
                className="workspace-tile btn-primary-glow magnetic-cta flex flex-col justify-center px-5 py-5 text-canvas"
              >
                <span className="font-display text-2xl font-semibold">{t("navDiscover")}</span>
                <span className="text-sm opacity-90">
                  {factCount > 0 ? `${factCount} ${t("workspaceFactsSaved")}` : t("workspaceStartFacts")}
                </span>
              </Link>
              <Link
                to="/results"
                className="workspace-tile glass-panel flex flex-col justify-center px-5 py-5"
              >
                <span className="font-display text-2xl font-semibold text-ink">{t("navResults")}</span>
                <span className="text-sm text-ink-soft">{t("workspaceSeeOutcomes")}</span>
              </Link>
              <Link
                to="/plan"
                className="workspace-tile glass-panel flex flex-col justify-center bg-sage/70 px-5 py-5"
              >
                <span className="font-display text-2xl font-semibold text-ink">{t("navPlan")}</span>
                <span className="text-sm text-ink-soft">{t("workspacePlanHint")}</span>
              </Link>
              <Link
                to="/assisted"
                className="workspace-tile glass-panel flex flex-col justify-center px-5 py-5"
              >
                <span className="font-display text-2xl font-semibold text-ink">{t("navAssisted")}</span>
                <span className="text-sm text-ink-soft">{t("workspaceAssistedHint")}</span>
              </Link>
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <figure className="overflow-hidden rounded-[1.6rem] border border-white/50 shadow-[var(--shadow-soft)]">
              <img
                src="/images/ui/workspace-empty.jpg"
                width={640}
                height={480}
                alt=""
                className="h-48 w-full object-cover md:h-56"
              />
              <figcaption className="bg-surface/90 px-4 py-3 text-sm text-ink-soft">
                {hi ? "जो जानते हैं, वहीं से शुरू करें।" : "Start with what you know."}
              </figcaption>
            </figure>
            <ActivityInbox />
          </aside>
        </div>
      </section>
    </CitizenGate>
  );
}
