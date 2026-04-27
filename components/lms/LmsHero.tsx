import Link from "next/link";

export function LmsHero() {
  return (
    <section className="bg-white">
      <div className="section-shell py-16 md:py-20">
        <div className="overflow-hidden rounded-[2rem] border border-line bg-navy text-white shadow-soft">
          <div className="grid gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-14 lg:py-14">
            <div className="space-y-6">
              <span className="eyebrow border-white/20 bg-white/10 text-white">New LMS Module</span>
              <div className="space-y-4">
                <h1 className="font-sans text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  Learning delivery, student progress, and admin oversight in one secure portal.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                  The LMS extension adds student dashboards, course access, progress tracking, and
                  admin management without disrupting the existing website experience.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/lms/student" className="btn-primary">
                  Open Student Portal
                </Link>
                <Link href="/lms/admin" className="btn-secondary-light">
                  Open Admin Portal
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/8 p-6 backdrop-blur-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Included</p>
                <ul className="mt-4 grid gap-3 text-sm leading-7 text-white/78">
                  <li>Student dashboard and enrolled courses</li>
                  <li>Course detail pages with module and lesson progress</li>
                  <li>Admin view for learner oversight and content operations</li>
                  <li>REST-ready API routes under `/api/lms/*`</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white p-6 text-navy">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate">Module design</p>
                <p className="mt-4 text-sm leading-7 text-slate">
                  This LMS is isolated into its own route namespace and shares the existing Tailwind
                  design system for a seamless production rollout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
