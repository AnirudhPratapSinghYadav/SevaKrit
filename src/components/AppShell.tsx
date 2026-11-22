import { Link, NavLink, Outlet } from "react-router-dom";
import { useLanguage } from "../i18n/Language";

export default function AppShell() {
  const { t, toggle } = useLanguage();
  const navItems = [
    { to: "/discover", label: t("navDiscover") },
    { to: "/results", label: t("navResults") },
    { to: "/plan", label: t("navPlan") },
    { to: "/help", label: t("navHelp") },
    { to: "/privacy", label: t("navPrivacy") },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-body">
      <header className="border-b border-border bg-canvas">
        <div className="mx-auto flex w-full max-w-page flex-col gap-2 px-4 py-3 md:max-w-content">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col">
              <Link to="/" className="inline-flex min-h-11 items-center text-2xl font-semibold text-ink">
                {t("brand")}
              </Link>
              <p className="text-sm text-ink-soft">{t("tagline")}</p>
            </div>
            <button
              type="button"
              onClick={toggle}
              className="min-h-11 rounded-md border border-ink px-3 font-semibold text-ink"
            >
              {t("langToggle")}
            </button>
          </div>
          <nav aria-label="Main" className="flex flex-wrap gap-x-4 gap-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex min-h-11 items-center underline-offset-4 hover:underline ${
                    isActive ? "font-semibold text-ink" : "text-accent-earth"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/assisted" className="inline-flex min-h-11 items-center text-accent-earth underline-offset-4 hover:underline">
              Assisted
            </Link>
            <Link to="/how-it-works" className="inline-flex min-h-11 items-center text-accent-earth underline-offset-4 hover:underline">
              How it works
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-page flex-1 px-4 py-8 outline-none md:max-w-content">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-surface-muted">
        <div className="mx-auto flex w-full max-w-page flex-col gap-2 px-4 py-4 text-sm md:max-w-content">
          <p>{t("footer")}</p>
          <p>{t("langNote")}</p>
          <Link
            to="/privacy"
            className="inline-flex min-h-11 items-center text-accent-earth underline underline-offset-4"
          >
            {t("privacyLink")}
          </Link>
        </div>
      </footer>
    </div>
  );
}
