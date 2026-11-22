import { Link, NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/intake", label: "Describe household" },
  { to: "/results", label: "Results" },
  { to: "/plan", label: "Plan" },
  { to: "/privacy", label: "Privacy" },
];

export default function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-body">
      <header className="border-b border-border bg-canvas">
        <div className="mx-auto flex w-full max-w-page flex-col gap-2 px-4 py-3 md:max-w-content">
          <div className="flex flex-col">
            <Link to="/" className="inline-flex min-h-11 items-center text-2xl font-semibold text-ink">
              HaqPath
            </Link>
            <p className="text-sm text-ink-soft">by SevaKrit · Independent guide — not a government portal</p>
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
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-page flex-1 px-4 py-8 outline-none md:max-w-content">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-surface-muted">
        <div className="mx-auto flex w-full max-w-page flex-col gap-2 px-4 py-4 text-sm md:max-w-content">
          <p>
            Demo mode: progress and reminders stay in this browser. Household answers stay in the current
            session only until you leave or refresh.
          </p>
          <Link
            to="/privacy"
            className="inline-flex min-h-11 items-center text-accent-earth underline underline-offset-4"
          >
            Privacy and data handling
          </Link>
        </div>
      </footer>
    </div>
  );
}
