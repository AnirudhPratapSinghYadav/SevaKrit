import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n/Language";

export default function Login() {
  const { t } = useLanguage();
  const { user, isGuest, configured, loading, signIn, signUp, continueAsGuest } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
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
    <section className="relative mx-auto flex w-full max-w-md flex-col gap-6 py-10">
      <div className="pointer-events-none absolute -left-20 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(203,185,124,0.35),transparent_70%)] blur-xl" />
      <header className="relative flex flex-col gap-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-earth">{t("brand")}</p>
        <h1 className="font-display text-4xl font-semibold text-ink">{t("loginTitle")}</h1>
        <p className="text-ink-soft">{t("loginIntro")}</p>
      </header>

      {!configured && (
        <p className="glass-panel rounded-2xl px-4 py-3 text-sm">{t("loginNoSupabase")}</p>
      )}

      <form onSubmit={onSubmit} className="glass-panel relative flex flex-col gap-3 rounded-3xl p-5">
        {mode === "up" && (
          <>
            <label htmlFor="login-name" className="font-semibold text-ink">
              {t("loginName")}
            </label>
            <input
              id="login-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="min-h-11 rounded-xl border border-border bg-surface/80 px-3"
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
          className="min-h-11 rounded-xl border border-border bg-surface/80 px-3"
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
          className="min-h-11 rounded-xl border border-border bg-surface/80 px-3"
        />
        <button
          type="submit"
          disabled={!configured}
          className="btn-primary-glow min-h-11 rounded-full px-4 font-semibold text-canvas disabled:opacity-50"
        >
          {mode === "in" ? t("loginSignIn") : t("loginSignUp")}
        </button>
        <button
          type="button"
          onClick={() => setMode((current) => (current === "in" ? "up" : "in"))}
          className="min-h-11 text-sm underline underline-offset-4"
        >
          {mode === "in" ? t("loginNeedAccount") : t("loginHaveAccount")}
        </button>
        {message !== null && <p role="status">{message}</p>}
      </form>

      <button
        type="button"
        onClick={() => {
          continueAsGuest();
          navigate("/workspace");
        }}
        className="glass-panel min-h-11 rounded-full px-4 font-semibold text-ink"
      >
        {t("loginGuest")}
      </button>

      <Link to="/" className="text-center underline underline-offset-4">
        {t("notFoundHome")}
      </Link>
    </section>
  );
}
