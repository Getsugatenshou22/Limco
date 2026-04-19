'use client';

import { useMemo, useState } from 'react';
import { Programme } from '@/lib/types';
import { ProgrammeCard } from './programme-card';

const categories = ['All', 'IT', 'Business', 'Finance', 'Compliance', 'Leadership'] as const;

export function ProgrammeCatalogue({ programmes }: { programmes: Programme[] }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>('All');

  const filtered = useMemo(() => {
    return programmes.filter((programme) => {
      const byCategory = selectedCategory === 'All' || programme.category === selectedCategory;
      const bySearch = [programme.title, programme.shortDescription, programme.category]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase());
      return byCategory && bySearch;
    });
  }, [programmes, query, selectedCategory]);

  return (
    <section className="space-y-6">
      <div className="glass rounded-2xl p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            placeholder="Search programmes, outcomes, categories..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="rounded-xl border border-border bg-transparent px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
            aria-label="Search programmes"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-lg px-3 py-2 text-sm ${
                  selectedCategory === category ? 'bg-primary text-white' : 'border border-border'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-foreground/70">Showing {filtered.length} programme(s)</p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((programme) => (
          <ProgrammeCard key={programme.slug} programme={programme} />
        ))}
      </div>
    </section>
  );
}
