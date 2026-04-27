import Link from "next/link";
import { Suspense } from "react";
import { LoginExperience } from "@/components/lms/LoginExperience";

export default function LoginPage() {
  return (
    <section className="bg-mist/70">
      <div className="section-shell section-space">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-line bg-white shadow-soft">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-gradient-to-br from-navy to-[#14305d] px-8 py-10 text-white sm:px-10">
              <span className="eyebrow border-white/20 bg-white/10 text-white">LMS Sign In</span>
              <h1 className="mt-5 font-sans text-4xl font-semibold tracking-tight">Access your learning workspace</h1>
              <p className="mt-4 text-base leading-8 text-white/80">
                Choose a portal role to preview the LMS experience. This lightweight sign-in keeps the current architecture intact while enabling smart portal entry.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/lms" className="btn-secondary-light">
                  Back to LMS
                </Link>
                <Link href="/" className="btn-secondary-light">
                  Main Website
                </Link>
              </div>
            </div>

            <div className="px-8 py-10 sm:px-10">
              <Suspense fallback={<div className="rounded-2xl border border-line bg-mist/60 px-4 py-3 text-sm text-slate">Loading sign-in options...</div>}>
                <LoginExperience />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
