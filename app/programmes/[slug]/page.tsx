import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProgrammeBySlug, getProgrammes } from '@/lib/cms';

export async function generateStaticParams() {
  const programmes = await getProgrammes();
  return programmes.map((programme) => ({ slug: programme.slug }));
}

export default async function ProgrammeDetailPage({ params }: { params: { slug: string } }) {
  const programme = await getProgrammeBySlug(params.slug);

  if (!programme) notFound();

  return (
    <section className="mx-auto mt-14 w-[95%] max-w-4xl space-y-8">
      <div className="glass rounded-2xl p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">{programme.category}</p>
        <h1 className="mt-2 font-[var(--font-poppins)] text-4xl font-semibold">{programme.title}</h1>
        <p className="mt-4 text-foreground/80">{programme.fullDescription}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass rounded-xl p-4"><p className="text-sm text-foreground/60">Duration</p><p className="font-semibold">{programme.duration}</p></div>
        <div className="glass rounded-xl p-4"><p className="text-sm text-foreground/60">NQF Level</p><p className="font-semibold">{programme.nqfLevel ?? 'N/A'}</p></div>
        <div className="glass rounded-xl p-4"><p className="text-sm text-foreground/60">Credits</p><p className="font-semibold">{programme.credits ?? 'N/A'}</p></div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="glass rounded-2xl p-6">
          <h2 className="font-[var(--font-poppins)] text-xl font-semibold">Outcomes & Benefits</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-foreground/80">
            {programme.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
          </ul>
        </article>
        <article className="glass rounded-2xl p-6">
          <h2 className="font-[var(--font-poppins)] text-xl font-semibold">Entry Requirements</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-foreground/80">
            {programme.requirements.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
      </div>

      <article className="glass rounded-2xl p-6">
        <h2 className="font-[var(--font-poppins)] text-xl font-semibold">Certification</h2>
        <p className="mt-2 text-foreground/80">{programme.certification}</p>
        <div className="mt-5 flex gap-3">
          <Link href="/contact" className="rounded-xl bg-primary px-5 py-3 text-white">Apply Now</Link>
          <Link href="/contact" className="rounded-xl border border-border px-5 py-3">Enquire</Link>
        </div>
      </article>
    </section>
  );
}
