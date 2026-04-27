import Link from "next/link";

export function CTASection() {
  return (
    <section className="bg-white">
      <div className="section-shell pb-16 md:pb-24">
        <div data-reveal className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy via-[#10284b] to-[#1b365d] px-6 py-12 text-white shadow-soft sm:px-10 lg:px-14 lg:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(245,197,66,0.18),_transparent_24%),linear-gradient(135deg,_rgba(255,255,255,0.06),_transparent_48%)]" />
          <div className="absolute right-10 top-8 h-32 w-32 rounded-full bg-gold/15 blur-3xl" />
          <div className="relative space-y-8">
            <div className="space-y-4">
              <span className="eyebrow border-white/20 bg-white/10 text-white">Ready To Build Skills That Matter?</span>
              <h2 className="max-w-4xl font-sans text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-white md:text-5xl">
                Ready to Build Skills That Matter?
              </h2>
              <p className="max-w-3xl text-base leading-8 text-white/80 md:text-lg">
                Partner with us or enrol today and take the next step in your career or organisation.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/apply"
                className="btn-primary"
              >
                Apply Now
              </Link>
              <Link
                href="/contact"
                className="btn-secondary-light"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
