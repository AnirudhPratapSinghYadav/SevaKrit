import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import { AppStateProvider } from "./context/AppState";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider, useLanguage } from "./i18n/Language";
import ActionSheet from "./pages/ActionSheet";
import Assisted from "./pages/Assisted";
import Glossary from "./pages/Glossary";
import HaqCompass from "./pages/HaqCompass";
import HaqPocket from "./pages/HaqPocket";
import HaqResolve from "./pages/HaqResolve";
import HaqWatch from "./pages/HaqWatch";
import Help from "./pages/Help";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import Intake from "./pages/Intake";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Plan from "./pages/Plan";
import Privacy from "./pages/Privacy";
import PublicScheme from "./pages/PublicScheme";
import Results from "./pages/Results";
import Review from "./pages/Review";
import Samples from "./pages/Samples";
import SchemeDetail from "./pages/SchemeDetail";
import SevaRoutePage from "./pages/SevaRoutePage";
import Workspace from "./pages/Workspace";

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
          <AuthProvider>
            <SkipLink />
            <Routes>
              <Route element={<AppShell />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/workspace" element={<Workspace />} />
                <Route path="/discover" element={<Intake />} />
                <Route path="/intake" element={<Navigate to="/discover" replace />} />
                <Route path="/results" element={<Results />} />
                <Route path="/schemes/:slug" element={<SchemeDetail />} />
                <Route path="/public/schemes/:slug" element={<PublicScheme />} />
                <Route path="/plan" element={<Plan />} />
                <Route path="/plan/print" element={<ActionSheet />} />
                <Route path="/tools/compass" element={<HaqCompass />} />
                <Route path="/tools/pocket" element={<HaqPocket />} />
                <Route path="/tools/resolve" element={<HaqResolve />} />
                <Route path="/tools/watch" element={<HaqWatch />} />
                <Route path="/tools/route" element={<SevaRoutePage />} />
                <Route path="/assisted" element={<Assisted />} />
                <Route path="/help" element={<Help />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/glossary" element={<Glossary />} />
                <Route path="/samples" element={<Samples />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/review" element={<Review />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </AppStateProvider>
    </LanguageProvider>
  );
}
