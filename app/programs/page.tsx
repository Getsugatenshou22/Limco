import { CTASection } from "@/components/CTASection";
import { ProgramsGrid } from "@/components/ProgramsGrid";

export default function ProgramsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="section-shell relative max-w-4xl space-y-6">
          <span className="eyebrow border-white/20 bg-white/10 text-white">Programmes</span>
          <h1 className="font-sans text-5xl font-bold leading-[1.04] tracking-tight md:text-6xl">
            Skills programmes and short courses aligned to workplace demand and learner progression.
          </h1>
          <p className="page-hero-copy">
            Our training portfolio supports digital, administrative, and technical pathways that help
            learners gain structured exposure while giving employers access to future-ready teams and
            practical upskilling options.
          </p>
        </div>
      </section>

      <ProgramsGrid intro={false} />
      <CTASection />
    </>
  );
}
