import { applicationSteps, programs } from "@/lib/data";

export default function ApplyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="section-shell relative max-w-4xl space-y-6">
          <span className="eyebrow border-white/20 bg-white/10 text-white">Apply</span>
          <h1 className="font-sans text-5xl font-bold leading-[1.04] tracking-tight md:text-6xl">
            Apply for a programme with confidence and clarity.
          </h1>
          <p className="page-hero-copy">
            Begin your application for learnerships, internships, WIL programmes, or other skills development pathways delivered by Limco.
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-b from-gray-50 to-white">
        <div className="section-shell section-space grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div data-reveal className="premium-panel p-8">
            <span className="eyebrow">Application Form</span>
            <div className="mt-6 grid gap-5">
              <div className="grid gap-2">
                <label htmlFor="full-name" className="text-sm font-semibold text-navy">
                  Full Name
                </label>
                <input
                  id="full-name"
                  type="text"
                  className="input-field h-12"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="grid gap-2 md:grid-cols-2 md:gap-5">
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-semibold text-navy">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="input-field h-12"
                    placeholder="yourname@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="phone" className="text-sm font-semibold text-navy">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="input-field h-12"
                    placeholder="+27"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="programme" className="text-sm font-semibold text-navy">
                  Programme of Interest
                </label>
                <select
                  id="programme"
                  className="input-field h-12"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a programme
                  </option>
                  {programs.map((program) => (
                    <option key={program.title} value={program.title}>
                      {program.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="message" className="text-sm font-semibold text-navy">
                  Additional Information
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="input-field py-3"
                  placeholder="Share your current studies, work experience, or career goals."
                />
              </div>
              <button
                type="button"
                className="btn-secondary-dark justify-center bg-navy text-white hover:border-navy"
              >
                Submit Application
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div data-reveal className="premium-panel p-8">
              <span className="eyebrow">Process</span>
              <div className="mt-6 space-y-6">
                {applicationSteps.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/20 text-sm font-semibold text-navy">
                      0{index + 1}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-navy">{step.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-slate">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div data-reveal className="overflow-hidden rounded-2xl border border-white/10 bg-navy p-8 text-white shadow-soft">
              <p className="text-sm uppercase tracking-[0.18em] text-gold">Eligibility</p>
              <p className="mt-4 text-2xl font-sans font-semibold tracking-tight">Prepared for learners, graduates, and emerging professionals.</p>
              <p className="mt-4 text-sm leading-7 text-white/78">
                Specific entry requirements may differ by programme and partner placement. Applicants
                should ensure that submitted information is accurate and current.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
