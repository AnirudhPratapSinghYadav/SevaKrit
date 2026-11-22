import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../ui/LoadingSpinner";

/**
 * Soft session gate adapted from Nagarakshak ProtectedRoute.
 * Guests and signed-in users may continue; unsigned visitors are sent to login.
 * Does not invent municipal roles.
 */
export default function CitizenGate({ children }: { children: React.ReactNode }) {
  const { user, isGuest, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
        <LoadingSpinner size="lg" label="Loading session" />
        <p className="text-sm text-ink-soft">Loading your session…</p>
      </div>
    );
  }

  if (!user && !isGuest) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
