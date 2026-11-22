import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase } from "../services/supabaseBrowser";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

type AuthValue = {
  user: AuthUser | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, name: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  isGuest: boolean;
};

const AuthContext = createContext<AuthValue | null>(null);
const GUEST_KEY = "haqpath.guest.v1";

function toAuthUser(user: User): AuthUser {
  const meta = user.user_metadata as { name?: string } | undefined;
  return {
    id: user.id,
    email: user.email ?? "",
    name: meta?.name || user.email?.split("@")[0] || "Citizen",
  };
}

function fromSession(session: Session | null): AuthUser | null {
  return session?.user ? toAuthUser(session.user) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = getSupabase();
  const configured = client !== null;
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isGuest, setIsGuest] = useState(() => {
    try {
      return globalThis.localStorage?.getItem(GUEST_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (client === null) {
      setLoading(false);
      return;
    }
    let mounted = true;
    const safety = window.setTimeout(() => {
      if (mounted) setLoading(false);
    }, 3000);

    void client.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(fromSession(data.session));
      setLoading(false);
    });

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      setUser(fromSession(session));
      if (session) {
        try {
          globalThis.localStorage?.removeItem(GUEST_KEY);
        } catch {
          /* ignore */
        }
        setIsGuest(false);
      }
    });

    return () => {
      mounted = false;
      window.clearTimeout(safety);
      data.subscription.unsubscribe();
    };
  }, [client]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (client === null) return "Sign-in needs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.";
      const { error } = await client.auth.signInWithPassword({ email, password });
      return error ? error.message : null;
    },
    [client],
  );

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      if (client === null) return "Sign-up needs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.";
      const { error } = await client.auth.signUp({
        email,
        password,
        options: { data: { name, role: "citizen" } },
      });
      return error ? error.message : null;
    },
    [client],
  );

  const signOut = useCallback(async () => {
    if (client) await client.auth.signOut();
    try {
      globalThis.localStorage?.removeItem(GUEST_KEY);
    } catch {
      /* ignore */
    }
    setIsGuest(false);
    setUser(null);
  }, [client]);

  const continueAsGuest = useCallback(() => {
    try {
      globalThis.localStorage?.setItem(GUEST_KEY, "1");
    } catch {
      /* ignore */
    }
    setIsGuest(true);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      loading,
      configured,
      signIn,
      signUp,
      signOut,
      continueAsGuest,
      isGuest,
    }),
    [user, loading, configured, signIn, signUp, signOut, continueAsGuest, isGuest],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (value === null) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
