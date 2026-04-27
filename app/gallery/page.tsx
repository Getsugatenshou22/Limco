import { CTASection } from "@/components/CTASection";
import { GalleryGrid } from "@/components/GalleryGrid";

export default function GalleryPage() {
  return (
    <>
      <section className="page-hero">
        <div className="section-shell relative max-w-4xl space-y-6">
          <span className="eyebrow border-white/20 bg-white/10 text-white">Gallery</span>
          <h1 className="font-sans text-5xl font-bold leading-[1.04] tracking-tight md:text-6xl">
            Moments from Limco training, graduations, and learner development.
          </h1>
          <p className="page-hero-copy">
            A curated gallery showcasing programme delivery, learner milestones, and institutional activity across
            Limco Consulting and Management&apos;s training environment.
          </p>
        </div>
      </section>

      <GalleryGrid />
      <CTASection />
    </>
  );
}
