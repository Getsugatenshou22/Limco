import { SectionHeading } from '@/components/ui/section-heading';

export default function AboutPage() {
  return (
    <section className="mx-auto mt-14 w-[95%] max-w-6xl space-y-8">
      <SectionHeading
        eyebrow="About LIMCO"
        title="A strategic partner for capability and growth"
        description="We combine advisory expertise and practical training delivery to help organisations become more agile, compliant, and competitive."
      />
      <div className="glass rounded-2xl p-8 leading-relaxed text-foreground/80">
        LIMCO works with public and private-sector organisations across South Africa. Our multidisciplinary consultants and facilitators
        co-design solutions that align strategy, people, and operations. From workforce development to governance transformation,
        we focus on outcomes you can measure.
      </div>
    </section>
  );
}
