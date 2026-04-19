'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Programme } from '@/lib/types';

export function ProgrammeCard({ programme }: { programme: Programme }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="glass flex h-full flex-col rounded-2xl p-5 transition"
    >
      <div className="mb-4 flex items-center justify-between text-xs">
        <span className="rounded-full bg-primary/15 px-3 py-1 text-primary">{programme.category}</span>
        <span className="text-foreground/60">{programme.duration}</span>
      </div>
      <h3 className="font-[var(--font-poppins)] text-xl font-semibold">{programme.title}</h3>
      <p className="mt-2 flex-1 text-sm text-foreground/70">{programme.shortDescription}</p>
      <dl className="mt-4 space-y-1 text-sm text-foreground/70">
        {programme.nqfLevel && <div><dt className="inline font-medium">NQF:</dt> <dd className="inline">{programme.nqfLevel}</dd></div>}
        {programme.credits && <div><dt className="inline font-medium">Credits:</dt> <dd className="inline">{programme.credits}</dd></div>}
      </dl>
      <div className="mt-5 flex gap-2">
        <Link href={`/programmes/${programme.slug}`} className="rounded-lg bg-primary px-3 py-2 text-sm text-white">View Details</Link>
        <Link href="/contact" className="rounded-lg border border-border px-3 py-2 text-sm">Apply</Link>
      </div>
    </motion.article>
  );
}
