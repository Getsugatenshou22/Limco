"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Building2, GraduationCap, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLmsSession } from "@/components/lms/useLmsSession";

const accessCards = [
  {
    title: "Student Access",
    description: "Continue learning, track progress, and move through your assigned courses with a focused learner workspace.",
    href: "/login?role=student",
    cta: "Open Student Portal",
    icon: GraduationCap,
  },
  {
    title: "Company Access",
    description: "Manage teams, submit bulk enrollments, and coordinate invoice-based learning requests from one corporate dashboard.",
    href: "/login?role=company_admin",
    cta: "Open Company Portal",
    icon: Building2,
  },
  {
    title: "Admin Access",
    description: "Review approvals, manage course operations, and oversee learner activity across the LMS environment.",
    href: "/login?role=admin",
    cta: "Open Admin Portal",
    icon: ShieldCheck,
  },
];

export function LmsEntryGate() {
  const router = useRouter();
  const { hydrated, session, loading } = useLmsSession();

  useEffect(() => {
    if (!hydrated || !session) {
      return;
    }

    const destination =
      session.role === "student"
        ? "/lms/student"
        : session.role === "company_admin"
          ? "/lms/company"
          : "/lms/admin";

    router.replace(destination);
  }, [hydrated, router, session]);

  if ((hydrated && session) || loading) {
    return (
      <section className="bg-white">
        <div className="section-shell pb-16 md:pb-24">
          <div className="premium-panel p-8 text-center">
            <p className="text-sm leading-7 text-slate">Preparing your portal...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <div className="section-shell pb-16 md:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Portal Access</span>
          <h2 className="mt-5 font-sans text-3xl font-semibold tracking-tight text-navy md:text-5xl">
            Choose the workspace that matches your learning role
          </h2>
          <p className="mt-4 section-copy max-w-none">
            Sign in to continue learning, manage corporate cohorts, or review platform approvals through the LMS.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {accessCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="premium-panel p-8">
                <div className="inline-flex rounded-2xl bg-navy/6 p-3 text-navy">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-sans text-2xl font-semibold tracking-tight text-navy">{card.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate">{card.description}</p>
                <div className="mt-6">
                  <Link href={card.href} className="btn-secondary-dark">
                    {card.cta}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
