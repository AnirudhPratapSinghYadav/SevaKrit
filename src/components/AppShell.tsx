import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n/Language";

export default function AppShell() {
  const { t, toggle } = useLanguage();
  const { user, isGuest } = useAuth();
  const { pathname } = useLocation();
  const isImmersive = pathname === "/" || pathname === "/login" || pathname === "/workspace";
  const navItems = [
    { to: "/workspace", label: t("navWorkspace") },
    { to: "/discover", label: t("navDiscover") },
    { to: "/results", label: t("navResults") },
    { to: "/plan", label: t("navPlan") },
    { to: "/help", label: t("navHelp") },
    { to: "/privacy", label: t("navPrivacy") },
  ];

  return (
    <div className={`flex min-h-screen flex-col text-body ${isImmersive ? "atmosphere" : "bg-canvas"}`}>
      <header className="glass-nav sticky top-0 z-30">
        <div className="mx-auto flex w-full flex-col gap-2 px-4 py-3 lg:px-8 xl:px-10">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col">
              <Link
                to="/"
                className="inline-flex min-h-11 items-center font-display text-2xl font-semibold tracking-tight text-white md:text-[1.75rem]"
              >
                {t("brand")}
              </Link>
              <p className="text-sm text-white/80">{t("tagline")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {!user && !isGuest && (
                <Link
                  to="/login"
                  className="btn-gold inline-flex min-h-11 items-center rounded-full px-4 font-semibold"
                >
                  {t("navLogin")}
                </Link>
              )}
              <button
                type="button"
                onClick={toggle}
                className="inline-flex min-h-11 items-center rounded-full border border-white/35 bg-white/12 px-4 font-semibold text-white backdrop-blur-md"
              >
                {t("langToggle")}
              </button>
            </div>
          </div>
          <nav aria-label="Main" className="flex flex-wrap gap-x-3 gap-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex min-h-10 items-center rounded-full px-3 text-sm transition ${
                    isActive
                      ? "bg-accent-gold font-semibold text-ink"
                      : "text-white/90 hover:bg-white/12 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/assisted"
              className="inline-flex min-h-10 items-center rounded-full px-3 text-sm text-white/90 hover:bg-white/12 hover:text-white"
            >
              {t("navAssisted")}
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex min-h-10 items-center rounded-full px-3 text-sm text-white/90 hover:bg-white/12 hover:text-white"
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
          isImmersive
            ? "immersive-main w-full flex-1 outline-none"
            : "mx-auto w-full max-w-page flex-1 px-4 py-8 outline-none lg:px-8"
        }
      >
        <Outlet />
      </main>

      <footer className="border-t border-border/70 bg-[#0c1f1b] text-white/85">
        <div className="mx-auto flex w-full max-w-page flex-col gap-2 px-4 py-5 text-sm lg:px-8">
          <p>{t("footer")}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link to="/privacy" className="inline-flex min-h-11 items-center text-accent-gold underline underline-offset-4">
              {t("privacyLink")}
            </Link>
            <Link to="/glossary" className="inline-flex min-h-11 items-center text-accent-gold underline underline-offset-4">
              {t("glossaryTitle")}
            </Link>
            <Link to="/help" className="inline-flex min-h-11 items-center text-accent-gold underline underline-offset-4">
              {t("navHelp")}
            </Link>
            <Link to="/review" className="inline-flex min-h-11 items-center text-accent-gold underline underline-offset-4">
              Review
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
