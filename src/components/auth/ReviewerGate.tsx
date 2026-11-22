import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../ui/LoadingSpinner";

/**
 * Reviewer shell adapted from Nagarakshak StaffRoute.
 * Publication rights still come from database RLS / RPC — this only gates the UI session.
 */
export default function ReviewerGate({ children }: { children: React.ReactNode }) {
  const { user, loading, configured, isGuest } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
        <LoadingSpinner size="md" />
        <p className="text-sm text-ink-soft">Checking reviewer session…</p>
      </div>
    );
  }

  if (!configured) {
    return (
      <section className="flex flex-col gap-3 rounded-md border border-border bg-surface-muted p-4">
        <h2 className="font-semibold text-ink">Reviewer sign-in unavailable</h2>
        <p className="text-sm">
          Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then use a reviewer membership in the
          database. Guest mode cannot publish schemes.
        </p>
        <Link to="/login" className="underline underline-offset-4">
          Open sign-in
        </Link>
      </section>
    );
  }

  if (isGuest || user === null) {
    return (
      <section className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4">
        <h2 className="font-semibold text-ink">Reviewer authentication required</h2>
        <p className="text-sm">
          Sign in with a Supabase account that has an active reviewer_memberships row. Browser-only
          guest sessions cannot edit or publish.
        </p>
        <Link
          to="/login"
          className="inline-flex min-h-11 items-center self-start rounded-md bg-ink px-4 font-semibold text-canvas"
        >
          Sign in
        </Link>
      </section>
    );
  }

  return children;
}
