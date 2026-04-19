import Link from 'next/link';
import { HeroSection } from '@/components/sections/hero';
import { HighlightStats } from '@/components/sections/highlights';
import { SectionHeading } from '@/components/ui/section-heading';
import { getProgrammes } from '@/lib/cms';

export default async function HomePage() {
  const programmes = await getProgrammes();
  const featured = programmes.filter((programme) => programme.featured).slice(0, 3);

  return (
    <>
      <HeroSection />
      <HighlightStats />

      <section className="mx-auto mt-16 w-[95%] max-w-6xl space-y-8">
        <SectionHeading
          eyebrow="Flagship Programmes"
          title="Future-ready learning tracks"
          description="Discover accredited and industry-relevant programmes built for measurable workplace impact."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {featured.map((programme) => (
            <article key={programme.slug} className="glass rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-accent">{programme.category}</p>
              <h3 className="mt-2 font-[var(--font-poppins)] text-xl font-semibold">{programme.title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{programme.shortDescription}</p>
            </article>
          ))}
        </div>
        <Link href="/programmes" className="inline-block rounded-xl bg-primary px-5 py-3 text-white">
          View Full Catalogue
        </Link>
      </section>
    </>
  );
}
