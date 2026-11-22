import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import { AppStateProvider } from "./context/AppState";
import { LanguageProvider, useLanguage } from "./i18n/Language";
import ActionSheet from "./pages/ActionSheet";
import Assisted from "./pages/Assisted";
import Help from "./pages/Help";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import Intake from "./pages/Intake";
import NotFound from "./pages/NotFound";
import Plan from "./pages/Plan";
import Privacy from "./pages/Privacy";
import Results from "./pages/Results";
import Review from "./pages/Review";
import SchemeDetail from "./pages/SchemeDetail";

function SkipLink() {
  const { t } = useLanguage();
  return (
    <a href="#main-content" className="skip-link">
      {t("skip")}
    </a>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppStateProvider>
        <BrowserRouter>
          <SkipLink />
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Intake />} />
              <Route path="/intake" element={<Navigate to="/discover" replace />} />
              <Route path="/results" element={<Results />} />
              <Route path="/schemes/:slug" element={<SchemeDetail />} />
              <Route path="/plan" element={<Plan />} />
              <Route path="/plan/print" element={<ActionSheet />} />
              <Route path="/assisted" element={<Assisted />} />
              <Route path="/help" element={<Help />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/review" element={<Review />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppStateProvider>
    </LanguageProvider>
  );
}
