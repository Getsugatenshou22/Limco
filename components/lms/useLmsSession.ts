"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type LmsSession } from "@/lib/lms-session";

export function useLmsSession() {
  const router = useRouter();
  const [session, setSession] = useState<LmsSession | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/lms/auth/me", {
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        setSession(null);
        return null;
      }

      const payload = (await response.json()) as { session: LmsSession };
      setSession(payload.session);
      return payload.session;
    } finally {
      setHydrated(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const response = await fetch("/api/lms/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({ message: "Unable to sign in." }))) as { message?: string };
        throw new Error(payload.message ?? "Unable to sign in.");
      }

      const payload = (await response.json()) as { session: LmsSession };
      setSession(payload.session);

      const destination =
        payload.session.role === "student"
          ? "/lms/student"
          : payload.session.role === "company_admin"
            ? "/lms/company"
            : "/lms/admin";

      router.push(destination);
      router.refresh();
      return payload.session;
    },
    [router],
  );

  const signOut = useCallback(async () => {
    await fetch("/api/lms/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setSession(null);
    router.push("/login");
    router.refresh();
  }, [router]);

  return {
    hydrated,
    loading,
    session,
    signIn,
    signOut,
    refreshSession,
  };
}
