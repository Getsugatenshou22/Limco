'use client';

import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';

const gallery = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1573164713712-03790a178651?auto=format&fit=crop&w=1400&q=80'
];

export default function ProjectsPage() {
  return (
    <section className="mx-auto mt-14 w-[95%] max-w-6xl space-y-8">
      <SectionHeading
        eyebrow="Projects"
        title="Impact highlights"
        description="A visual snapshot of learning engagements, consulting workshops, and client collaboration moments."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {gallery.map((src) => (
          <Dialog.Root key={src}>
            <Dialog.Trigger asChild>
              <button className="overflow-hidden rounded-2xl border border-border">
                <Image src={src} alt="Project gallery" width={800} height={600} className="h-64 w-full object-cover transition hover:scale-105" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/70" />
              <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-black p-2">
                <Image src={src} alt="Project lightbox" width={1400} height={900} className="h-auto w-full rounded-xl" />
                <Dialog.Close className="absolute right-3 top-3 rounded-full bg-white/20 p-2 text-white"><X className="h-4 w-4" /></Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        ))}
      </div>
    </section>
  );
}
