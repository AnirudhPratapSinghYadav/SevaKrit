import { Link } from "react-router-dom";
import ActivityInbox from "../components/ActivityInbox";
import CitizenGate from "../components/auth/CitizenGate";
import FeatureRail from "../components/FeatureRail";
import { useAuth } from "../context/AuthContext";
import { useAppState } from "../context/AppState";
import { useLanguage } from "../i18n/Language";

/** Post-entry hub (Nagarakshak dashboard idea → HaqPath tools + journey). */
export default function Workspace() {
  const { t } = useLanguage();
  const { user, isGuest, signOut } = useAuth();
  const { profile } = useAppState();
  const factCount = Object.keys(profile.confirmedFacts).length;

  return (
    <CitizenGate>
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent-earth">{t("workspaceEyebrow")}</p>
        <h1 className="font-display text-4xl font-semibold text-ink">{t("workspaceTitle")}</h1>
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

      <FeatureRail />

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to="/discover"
          className="btn-primary-glow flex min-h-32 flex-col justify-center rounded-3xl px-5 py-4 text-canvas transition hover:-translate-y-0.5"
        >
          <span className="font-display text-2xl font-semibold">{t("navDiscover")}</span>
          <span className="text-sm opacity-90">
            {factCount > 0 ? `${factCount} ${t("workspaceFactsSaved")}` : t("workspaceStartFacts")}
          </span>
        </Link>
        <Link
          to="/results"
          className="glass-panel flex min-h-32 flex-col justify-center rounded-3xl px-5 py-4 transition hover:-translate-y-0.5"
        >
          <span className="font-display text-2xl font-semibold text-ink">{t("navResults")}</span>
          <span className="text-sm text-ink-soft">{t("workspaceSeeOutcomes")}</span>
        </Link>
        <Link
          to="/plan"
          className="glass-panel flex min-h-32 flex-col justify-center rounded-3xl bg-sage/70 px-5 py-4 transition hover:-translate-y-0.5"
        >
          <span className="font-display text-2xl font-semibold text-ink">{t("navPlan")}</span>
          <span className="text-sm text-ink-soft">{t("workspacePlanHint")}</span>
        </Link>
        <Link
          to="/assisted"
          className="glass-panel flex min-h-32 flex-col justify-center rounded-3xl px-5 py-4 transition hover:-translate-y-0.5"
        >
          <span className="font-display text-2xl font-semibold text-ink">{t("navAssisted")}</span>
          <span className="text-sm text-ink-soft">{t("workspaceAssistedHint")}</span>
        </Link>
      </div>

      <ActivityInbox />
    </section>
    </CitizenGate>
  );
}
