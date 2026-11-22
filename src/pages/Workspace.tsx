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
  const { t } = useLanguage();
  const { user, isGuest, signOut } = useAuth();
  const { profile } = useAppState();
  const factCount = Object.keys(profile.confirmedFacts).length;
  useScrollReveal();

  return (
    <CitizenGate>
      <section className="workspace-atmosphere relative flex min-h-[calc(100svh-8rem)] flex-col gap-8 py-2">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="orb orb-a absolute -right-10 -top-4 h-40 w-40 bg-[radial-gradient(circle,rgba(203,185,124,0.35),transparent_70%)]" />
          <div className="orb orb-b absolute bottom-20 left-[-2rem] h-48 w-48 bg-[radial-gradient(circle,rgba(23,59,53,0.18),transparent_70%)]" />
        </div>

        <header className="glass-panel relative flex flex-col gap-3 rounded-[1.75rem] p-6 md:p-8" data-reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-earth">{t("workspaceEyebrow")}</p>
          <h1 className="font-display text-4xl font-semibold text-ink md:text-5xl">{t("workspaceTitle")}</h1>
          <p className="max-w-2xl text-lg text-ink-soft">{t("workspaceIntro")}</p>
          <p className="text-sm">
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

        <div data-reveal>
          <FeatureRail />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            to="/discover"
            className="btn-primary-glow magnetic-cta flex min-h-32 flex-col justify-center rounded-3xl px-5 py-4 text-canvas transition hover:-translate-y-0.5"
            data-reveal
          >
            <span className="font-display text-2xl font-semibold">{t("navDiscover")}</span>
            <span className="text-sm opacity-90">
              {factCount > 0 ? `${factCount} ${t("workspaceFactsSaved")}` : t("workspaceStartFacts")}
            </span>
          </Link>
          <Link
            to="/results"
            className="glass-panel flex min-h-32 flex-col justify-center rounded-3xl px-5 py-4 transition hover:-translate-y-0.5"
            data-reveal
          >
            <span className="font-display text-2xl font-semibold text-ink">{t("navResults")}</span>
            <span className="text-sm text-ink-soft">{t("workspaceSeeOutcomes")}</span>
          </Link>
          <Link
            to="/plan"
            className="glass-panel flex min-h-32 flex-col justify-center rounded-3xl bg-sage/70 px-5 py-4 transition hover:-translate-y-0.5"
            data-reveal
          >
            <span className="font-display text-2xl font-semibold text-ink">{t("navPlan")}</span>
            <span className="text-sm text-ink-soft">{t("workspacePlanHint")}</span>
          </Link>
          <Link
            to="/assisted"
            className="glass-panel flex min-h-32 flex-col justify-center rounded-3xl px-5 py-4 transition hover:-translate-y-0.5"
            data-reveal
          >
            <span className="font-display text-2xl font-semibold text-ink">{t("navAssisted")}</span>
            <span className="text-sm text-ink-soft">{t("workspaceAssistedHint")}</span>
          </Link>
        </div>

        <div data-reveal>
          <ActivityInbox />
        </div>
      </section>
    </CitizenGate>
  );
}
