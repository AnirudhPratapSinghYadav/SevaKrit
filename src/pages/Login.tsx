import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n/Language";

export default function Login() {
  const { t, lang } = useLanguage();
  const { user, isGuest, configured, loading, signIn, signUp, continueAsGuest } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const hi = lang === "hi";

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user || isGuest) {
    return <Navigate to="/workspace" replace />;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const error =
      mode === "in" ? await signIn(email, password) : await signUp(email, password, name || "Citizen");
    if (error) {
      setMessage(error);
      return;
    }
    setMessage(mode === "up" ? t("loginCheckEmail") : null);
    navigate("/workspace");
  }

  return (
    <section className="atmosphere relative left-1/2 right-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(212,180,90,0.45),transparent_70%)] blur-2xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(10,42,36,0.35),transparent_70%)] blur-2xl" />
        <div className="absolute left-1/3 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(168,74,31,0.22),transparent_70%)] blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-8.5rem)] w-full max-w-page grid-cols-1 items-stretch gap-0 px-4 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8 lg:py-10">
        {/* Left: brand story — uses the width */}
        <aside className="atmosphere-ink relative flex flex-col justify-between overflow-hidden rounded-[2rem] p-8 text-canvas shadow-[0_40px_100px_rgba(6,26,22,0.45)] md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[url('/images/story/hero-village.webp')] bg-cover bg-center opacity-[0.18]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061a16] via-transparent to-transparent" />
          <div className="relative z-10 flex flex-col gap-5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent-gold">
              {hi ? "हक़पथ · सेवाकृत" : "HaqPath · SevaKrit"}
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.08] md:text-5xl lg:text-[3.4rem]">
              {hi
                ? "पात्रता का रास्ता, योजना का नाम जाने बिना।"
                : "Eligibility, without needing the scheme’s name."}
            </h1>
            <p className="max-w-md text-lg text-canvas/85">
              {hi
                ? "मध्य प्रदेश के बैगा, भारिया और सहरिया परिवारों के लिए स्रोत-बद्ध संभावित सहायता। सरकारी पोर्टल नहीं।"
                : "Source-backed likely fits for Baiga, Bharia and Sahariya households in Madhya Pradesh. Not a government portal."}
            </p>
          </div>
          <ul className="relative z-10 mt-10 grid gap-3 text-sm text-canvas/80 sm:grid-cols-2">
            <li className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-sm">
              {hi ? "नियम + स्रोत दिखते हैं" : "Rules and sources on every outcome"}
            </li>
            <li className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-sm">
              {hi ? "आधार / OTP नहीं" : "No Aadhaar or OTP on this path"}
            </li>
            <li className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-sm">
              {hi ? "अतिथि मोड तुरंत" : "Guest mode starts in one tap"}
            </li>
            <li className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-sm">
              {hi ? "विभाग ही अंतिम निर्णय" : "Departments still decide eligibility"}
            </li>
          </ul>
        </aside>

        {/* Right: wide glass plate */}
        <div className="login-plate relative flex flex-col justify-center gap-6 rounded-[2rem] p-7 md:p-10">
          <header className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent-earth">{t("brand")}</p>
            <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">{t("loginTitle")}</h2>
            <p className="max-w-lg text-base text-ink-soft md:text-lg">{t("loginIntro")}</p>
          </header>

          {!configured && (
            <p className="rounded-2xl border border-accent-earth/25 bg-warning-bg px-4 py-3 text-sm text-warning-ink">
              {t("loginNoSupabase")}
            </p>
          )}

          <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
            {mode === "up" && (
              <>
                <label htmlFor="login-name" className="font-semibold text-ink">
                  {t("loginName")}
                </label>
                <input
                  id="login-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="min-h-12 rounded-xl border border-border bg-surface px-4 text-ink"
                />
              </>
            )}
            <label htmlFor="login-email" className="font-semibold text-ink">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              required={configured}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-12 rounded-xl border border-border bg-surface px-4 text-ink"
            />
            <label htmlFor="login-password" className="font-semibold text-ink">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete={mode === "in" ? "current-password" : "new-password"}
              required={configured}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-12 rounded-xl border border-border bg-surface px-4 text-ink"
            />
            <button
              type="submit"
              disabled={!configured}
              className="btn-primary-glow mt-1 min-h-12 rounded-full px-4 font-semibold text-canvas disabled:opacity-50"
            >
              {mode === "in" ? t("loginSignIn") : t("loginSignUp")}
            </button>
            <button
              type="button"
              onClick={() => setMode((current) => (current === "in" ? "up" : "in"))}
              className="min-h-11 text-sm font-semibold text-accent-earth underline-offset-4 hover:underline"
            >
              {mode === "in" ? t("loginNeedAccount") : t("loginHaveAccount")}
            </button>
            {message !== null && (
              <p role="status" className="text-sm text-ink">
                {message}
              </p>
            )}
          </form>

          <div className="flex flex-col gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => {
                continueAsGuest();
                navigate("/workspace");
              }}
              className="btn-gold min-h-12 flex-1 rounded-full px-4 font-semibold"
            >
              {t("loginGuest")}
            </button>
            <Link
              to="/"
              className="inline-flex min-h-12 items-center justify-center px-3 font-semibold text-ink underline-offset-4 hover:underline"
            >
              {t("notFoundHome")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
