import Link from "next/link";
import { aboutPoints, capabilityHighlights } from "@/lib/data";

type AboutSectionProps = {
  compact?: boolean;
};

export function AboutSection({ compact = false }: AboutSectionProps) {
  return (
    <section className={compact ? "bg-gradient-to-b from-white to-gray-50/60" : "bg-mist/60"}>
      <div className="section-shell section-space grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div data-reveal className="space-y-6">
          <span className="eyebrow">About Limco</span>
          <div className="space-y-5">
            <h2 className="section-title">A trusted South African partner in skills development.</h2>
            {aboutPoints.map((point) => (
              <p key={point} className="section-copy max-w-none">
                {point}
              </p>
            ))}
          </div>
          <Link
            href="/about"
            className="btn-secondary-dark"
          >
            Get Started
          </Link>
        </div>

        <div data-reveal className="premium-panel p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Core Capabilities</p>
          <div className="mt-6 grid gap-4">
            {capabilityHighlights.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-gray-100 bg-mist/70 px-5 py-4 text-sm leading-7 text-ink transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
