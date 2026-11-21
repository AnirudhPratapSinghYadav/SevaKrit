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
      <header className="border-b border-sage bg-canvas">
        <div className="mx-auto flex max-w-2xl flex-col gap-2 px-4 py-3">
          <div className="flex flex-col">
            <Link to="/" className="inline-flex min-h-11 items-center text-2xl font-semibold text-ink">
              HaqPath
            </Link>
            <p className="text-sm text-body">Independent guide — not a government portal</p>
          </div>
          <nav aria-label="Main" className="flex flex-wrap gap-x-4 gap-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex min-h-11 items-center underline-offset-4 hover:underline ${
                    isActive ? "font-semibold text-ink" : "text-terracotta-text"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-sage bg-sage">
        <div className="mx-auto flex max-w-2xl flex-col gap-2 px-4 py-4 text-sm">
          <p>Demo mode: your answers and progress are stored only in this browser.</p>
          <Link
            to="/privacy"
            className="inline-flex min-h-11 items-center text-terracotta-text underline underline-offset-4"
          >
            Privacy and data handling
          </Link>
        </div>
      </footer>
    </div>
  );
}

