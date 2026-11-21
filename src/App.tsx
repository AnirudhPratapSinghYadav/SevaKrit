import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { AppStateProvider } from "./context/AppState";
import Intake from "./pages/Intake";
import Plan from "./pages/Plan";
import Results from "./pages/Results";

function Home() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-ink">HaqPath</h1>
      <p className="mt-4">
        Independent, plain-language help for households to understand benefits, documents and next
        steps. Not a government portal.
      </p>
      <p className="mt-4 text-terracotta-text">
        Scheme information is draft and not yet verified against official sources.
      </p>
      <p className="mt-6">
        <Link to="/intake" className="font-semibold text-ink underline underline-offset-4">
          Describe your household
        </Link>
      </p>
    </main>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/intake"
            element={
              <main className="mx-auto max-w-2xl px-4 py-10">
                <Intake />
              </main>
            }
          />
          <Route
            path="/results"
            element={
              <main className="mx-auto max-w-2xl px-4 py-10">
                <Results />
              </main>
            }
          />
          <Route
            path="/plan"
            element={
              <main className="mx-auto max-w-2xl px-4 py-10">
                <Plan />
              </main>
            }
          />
          <Route
            path="*"
            element={
              <main className="mx-auto max-w-2xl px-4 py-10">
                <p>Page not found.</p>
              </main>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  );
}
