"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Building2, GraduationCap, ShieldCheck, LoaderCircle } from "lucide-react";
import { useLmsSession } from "@/components/lms/useLmsSession";

const accessOptions = [
  {
    role: "student" as const,
    title: "Student Access",
    description: "Resume lessons, view approved courses, and continue building skills with guided progress tracking.",
    icon: GraduationCap,
    email: "naledi@example.com",
  },
  {
    role: "company_admin" as const,
    title: "Company Access",
    description: "Manage learners, request team enrollment, and oversee invoice-based approvals for corporate cohorts.",
    icon: Building2,
    email: "karabo@ubuntuoperations.co.za",
  },
  {
    role: "admin" as const,
    title: "Admin Access",
    description: "Review approvals, activate enrollments, and monitor learning operations across the platform.",
    icon: ShieldCheck,
    email: "admin@limco.co.za",
  },
];

export function LoginExperience() {
  const searchParams = useSearchParams();
  const requestedRole = searchParams.get("role");
  const { session, signIn, signOut, loading } = useLmsSession();
  const defaultOption = useMemo(
    () => accessOptions.find((option) => option.role === requestedRole) ?? accessOptions[0],
    [requestedRole],
  );
  const [email, setEmail] = useState(defaultOption.email);
  const [password, setPassword] = useState("Pass@123");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await signIn(email, password);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {session ? (
        <div className="rounded-2xl border border-line bg-mist/60 px-5 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">Current Session</p>
          <p className="mt-2 font-semibold text-navy">{session.name}</p>
          <p className="text-sm leading-7 capitalize text-slate">{session.role.replace("_", " ")}</p>
          <button type="button" onClick={signOut} className="btn-secondary-dark mt-4">
            Sign Out
          </button>
        </div>
      ) : null}

      <div className="space-y-4">
        {accessOptions.map((option) => {
          const Icon = option.icon;
          const highlighted = defaultOption.role === option.role;

          return (
            <button
              key={option.role}
              type="button"
              onClick={() => {
                setEmail(option.email);
                setPassword("Pass@123");
              }}
              className={`interactive-card w-full rounded-[1.75rem] border p-6 text-left transition-all duration-300 ${
                highlighted ? "border-navy/25 bg-navy text-white shadow-soft" : "border-line bg-white hover:bg-mist/60"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`rounded-2xl p-3 ${highlighted ? "bg-white/12 text-white" : "bg-navy/6 text-navy"}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className={`font-sans text-2xl font-semibold tracking-tight ${highlighted ? "text-white" : "text-navy"}`}>
                    {option.title}
                  </p>
                  <p className={`mt-2 text-sm leading-7 ${highlighted ? "text-white/80" : "text-slate"}`}>
                    {option.description}
                  </p>
                  <p className={`mt-3 text-xs uppercase tracking-[0.16em] ${highlighted ? "text-white/70" : "text-slate"}`}>
                    Demo user: {option.email}
                  </p>
                  <span
                    className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                      highlighted ? "bg-white/12 text-white" : "bg-mist text-slate"
                    }`}
                  >
                    {highlighted ? "Recommended" : "Portal Access"}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="rounded-[1.75rem] border border-line bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Secure Sign In</p>
        <div className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-navy">
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-2xl border border-line bg-mist/40 px-4 py-3 text-sm font-normal text-navy outline-none transition focus:border-navy/30 focus:bg-white"
              autoComplete="email"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-navy">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-2xl border border-line bg-mist/40 px-4 py-3 text-sm font-normal text-navy outline-none transition focus:border-navy/30 focus:bg-white"
              autoComplete="current-password"
            />
          </label>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate">
          Seeded demo password for the imported LMS accounts: <span className="font-semibold text-navy">Pass@123</span>
        </p>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        <button type="submit" disabled={submitting || loading} className="btn-primary mt-5 disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
          Sign In
        </button>
      </form>
    </div>
  );
}
