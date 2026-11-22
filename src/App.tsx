import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import { AppStateProvider } from "./context/AppState";
import Home from "./pages/Home";
import Intake from "./pages/Intake";
import Plan from "./pages/Plan";
import Privacy from "./pages/Privacy";
import Results from "./pages/Results";
import Review from "./pages/Review";
import SchemeDetail from "./pages/SchemeDetail";

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Intake />} />
            <Route path="/intake" element={<Navigate to="/discover" replace />} />
            <Route path="/results" element={<Results />} />
            <Route path="/schemes/:slug" element={<SchemeDetail />} />
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
