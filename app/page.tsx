import { AboutSection } from "@/components/AboutSection";
import { CTASection } from "@/components/CTASection";
import { Hero } from "@/components/Hero";
import { ProgramsGrid } from "@/components/ProgramsGrid";
import { ServicesGrid } from "@/components/ServicesGrid";
import { SocialProofSection } from "@/components/SocialProofSection";
import { trustItems } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SocialProofSection />

      <section className="bg-gradient-to-b from-white to-gray-50/60">
        <div className="section-shell py-16 md:py-20">
          <div data-reveal className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <span className="eyebrow">Why Us</span>
              <h2 className="section-title">A trusted delivery partner for skills development, compliance, and workforce readiness.</h2>
            </div>
            <p className="section-copy max-w-2xl">
              Limco brings together accredited delivery, employer alignment, and implementation experience to support both learner outcomes and institutional priorities.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {trustItems.map((item) => (
            <div
              key={item.title}
              data-reveal
              className="interactive-card rounded-2xl border border-gray-100 bg-white/90 p-5 shadow-sm backdrop-blur-sm"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-navy">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-slate">{item.description}</p>
            </div>
          ))}
          </div>
        </div>
      </section>

      <ProgramsGrid />
      <ServicesGrid />
      <AboutSection compact />
      <CTASection />
    </>
  );
}
