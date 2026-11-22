import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n/Language";

export default function AppShell() {
  const { t, toggle } = useLanguage();
  const { user, isGuest } = useAuth();
  const { pathname } = useLocation();
  const isLanding = pathname === "/";
  const navItems = [
    { to: "/workspace", label: t("navWorkspace") },
    { to: "/discover", label: t("navDiscover") },
    { to: "/results", label: t("navResults") },
    { to: "/plan", label: t("navPlan") },
    { to: "/help", label: t("navHelp") },
    { to: "/privacy", label: t("navPrivacy") },
  ];

  return (
    <div className={`flex min-h-screen flex-col text-body ${isLanding ? "atmosphere" : "bg-canvas"}`}>
      <header className="glass-nav sticky top-0 z-30">
        <div
          className={`mx-auto flex w-full flex-col gap-2 px-4 py-3 ${
            isLanding ? "max-w-page lg:px-6" : "max-w-page md:max-w-content"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col">
              <Link
                to="/"
                className="inline-flex min-h-11 items-center font-display text-2xl font-semibold tracking-tight text-ink md:text-[1.75rem]"
              >
                {t("brand")}
              </Link>
              <p className="text-sm text-ink-soft">{t("tagline")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {!user && !isGuest && (
                <Link
                  to="/login"
                  className="btn-primary-glow inline-flex min-h-11 items-center rounded-full px-4 font-semibold text-canvas"
                >
                  {t("navLogin")}
                </Link>
              )}
              <button
                type="button"
                onClick={toggle}
                className="glass-panel min-h-11 rounded-full px-4 font-semibold text-ink"
              >
                {t("langToggle")}
              </button>
            </div>
          </div>
          <nav aria-label="Main" className="flex flex-wrap gap-x-4 gap-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex min-h-11 items-center rounded-full px-2 underline-offset-4 transition hover:underline ${
                    isActive ? "bg-ink px-3 font-semibold text-canvas" : "text-accent-earth"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/assisted"
              className="inline-flex min-h-11 items-center text-accent-earth underline-offset-4 hover:underline"
            >
              {t("navAssisted")}
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex min-h-11 items-center text-accent-earth underline-offset-4 hover:underline"
            >
              {t("navHow")}
            </Link>
          </nav>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className={
          isLanding
            ? "w-full flex-1 outline-none"
            : "mx-auto w-full max-w-page flex-1 px-4 py-8 outline-none md:max-w-content"
        }
      >
        <Outlet />
      </main>

      <footer className="border-t border-border/70 bg-surface-muted/80 backdrop-blur-md">
        <div
          className={`mx-auto flex w-full flex-col gap-2 px-4 py-5 text-sm ${
            isLanding ? "max-w-page lg:px-6" : "max-w-page md:max-w-content"
          }`}
        >
          <p>{t("footer")}</p>
          <p>{t("langNote")}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link to="/privacy" className="inline-flex min-h-11 items-center text-accent-earth underline underline-offset-4">
              {t("privacyLink")}
            </Link>
            <Link to="/glossary" className="inline-flex min-h-11 items-center text-accent-earth underline underline-offset-4">
              {t("glossaryTitle")}
            </Link>
            <Link to="/samples" className="inline-flex min-h-11 items-center text-accent-earth underline underline-offset-4">
              Samples
            </Link>
            <Link to="/review" className="inline-flex min-h-11 items-center text-accent-earth underline underline-offset-4">
              Review
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
