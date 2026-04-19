'use client';

import { motion } from 'framer-motion';

const highlights = [
  ['25+', 'Years combined advisory experience'],
  ['8k+', 'Learners trained across industries'],
  ['94%', 'Client satisfaction on programme outcomes']
];

export function HighlightStats() {
  return (
    <section className="mx-auto mt-10 grid w-[95%] max-w-6xl gap-4 md:grid-cols-3">
      {highlights.map(([value, label], idx) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: idx * 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <p className="font-[var(--font-poppins)] text-3xl font-semibold">{value}</p>
          <p className="mt-2 text-foreground/70">{label}</p>
        </motion.div>
      ))}
    </section>
  );
}
