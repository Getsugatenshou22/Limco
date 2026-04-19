'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative mx-auto mt-8 w-[95%] max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-mesh p-8 md:p-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <p className="text-sm uppercase tracking-[0.3em] text-accent">Future of learning and consulting</p>
        <h1 className="mt-4 max-w-3xl font-[var(--font-poppins)] text-4xl font-bold leading-tight md:text-6xl">
          Build resilient teams with premium consulting and accredited programmes.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-foreground/75">
          LIMCO partners with organisations to upskill people, optimise operations, and unlock measurable performance gains.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/programmes" className="rounded-xl bg-primary px-5 py-3 text-white shadow-glow">
            Explore Programmes
          </Link>
          <Link href="/contact" className="glass rounded-xl px-5 py-3">Book a Consultation</Link>
        </div>
      </motion.div>
    </section>
  );
}
