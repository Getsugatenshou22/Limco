import { CTASection } from "@/components/CTASection";
import { ServicesGrid } from "@/components/ServicesGrid";

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="section-shell relative max-w-4xl space-y-6">
          <span className="eyebrow border-white/20 bg-white/10 text-white">Services</span>
          <h1 className="font-sans text-5xl font-bold leading-[1.04] tracking-tight md:text-6xl">
            End-to-end support for skills implementation and workforce development.
          </h1>
          <p className="page-hero-copy">
            Limco partners with employers and institutions to coordinate programme delivery, improve
            compliance readiness, and strengthen recruitment and project execution.
          </p>
        </div>
      </section>

      <ServicesGrid intro={false} light />
      <CTASection />
    </>
  );
}
