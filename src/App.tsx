import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import { AppStateProvider } from "./context/AppState";
import Home from "./pages/Home";
import Intake from "./pages/Intake";
import Plan from "./pages/Plan";
import Privacy from "./pages/Privacy";
import Results from "./pages/Results";
import Review from "./pages/Review";

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <a
          href="#main-content"
          className="skip-link"
        >
          Skip to main content
        </a>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/intake" element={<Intake />} />
            <Route path="/results" element={<Results />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/review" element={<Review />} />
            <Route path="*" element={<p>Page not found.</p>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  );
}
