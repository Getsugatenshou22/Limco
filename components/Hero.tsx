import Image from "next/image";
import Link from "next/link";
import { featuredPartners } from "@/lib/data";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(245,197,66,0.18),_transparent_28%),linear-gradient(135deg,_rgba(255,255,255,0.08),_transparent_48%)]" />
      <div className="absolute inset-0 bg-hero-grid bg-[size:42px_42px] opacity-30" />
      <div className="hero-glow absolute right-[-4rem] top-[-3rem] h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute left-[8%] top-[22%] h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy via-navy/80 to-transparent" />

      <div className="section-shell relative grid min-h-[78svh] items-center gap-14 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
        <div className="max-w-3xl space-y-8">
          <span className="eyebrow hero-fade-up border-white/20 bg-white/10 text-white">
            Accredited Skills Development Partner
          </span>
          <div className="space-y-5">
            <h1 className="hero-fade-up hero-delay-1 font-sans text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
              Empowering Skills Development &amp; Workforce Transformation in South Africa
            </h1>
            <p className="hero-fade-up hero-delay-2 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
              SETA-aligned programmes, employability-focused training, and measurable workforce outcomes
              for learners, employers, and institutions across South Africa.
            </p>
          </div>
          <div className="hero-fade-up hero-delay-3 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/apply"
              className="btn-primary text-base font-semibold"
            >
              Apply Now
            </Link>
            <Link
              href="/contact"
              className="btn-secondary-light text-base"
            >
              Partner With Us
            </Link>
          </div>
          <div className="hero-fade-up hero-delay-3 space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/78">
              Trusted by Government &amp; Corporate Clients
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {featuredPartners.slice(0, 4).map((partner) => (
                <div
                  key={partner.name}
                  className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/8 px-4 backdrop-blur-sm"
                >
                  <Image
                    src={partner.src}
                    alt={partner.alt}
                    width={96}
                    height={32}
                    loading="lazy"
                    className="h-8 w-auto max-w-[96px] object-contain opacity-80 grayscale transition duration-300 ease-out hover:opacity-100 hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <div className="hero-fade-up hero-delay-2 rounded-2xl border border-white/10 bg-white/8 p-6 shadow-soft backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.18em] text-gold">National focus</p>
            <p className="mt-3 text-2xl font-semibold">Skills pathways for youth and workforce growth</p>
            <p className="mt-3 text-sm leading-7 text-white/74">
              Skills development delivery aligned to employability, transformation outcomes, and sector-based
              workforce priorities.
            </p>
          </div>
          <div className="hero-fade-up hero-delay-3 rounded-2xl border border-white/10 bg-white/95 p-6 text-navy shadow-soft backdrop-blur">
            <p className="text-sm uppercase tracking-[0.18em] text-slate">Delivery model</p>
            <div className="mt-5 grid gap-4 text-sm leading-7 text-slate">
              <div className="flex items-start justify-between gap-6 border-b border-line pb-4">
                <span>Corporate and institutional partnerships</span>
                <span className="font-semibold text-navy">Active</span>
              </div>
              <div className="flex items-start justify-between gap-6 border-b border-line pb-4">
                <span>Accredited programme implementation</span>
                <span className="font-semibold text-navy">Managed</span>
              </div>
              <div className="flex items-start justify-between gap-6">
                <span>Learner readiness and placement support</span>
                <span className="font-semibold text-navy">Ongoing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
