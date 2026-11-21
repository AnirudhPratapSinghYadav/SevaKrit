import { BrowserRouter, Route, Routes } from "react-router-dom";

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
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
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
  );
}
