import { Suspense } from 'react';
import { SectionHeading } from '@/components/ui/section-heading';
import { getProgrammes } from '@/lib/cms';
import { ProgrammeCatalogue } from '@/components/programmes/programme-catalogue';
import { ProgrammeSkeletons } from '@/components/programmes/programme-skeletons';

async function CatalogueContainer() {
  const programmes = await getProgrammes();
  return <ProgrammeCatalogue programmes={programmes} />;
}

export default function ProgrammesPage() {
  return (
    <section className="mx-auto mt-14 w-[95%] max-w-6xl space-y-8">
      <SectionHeading
        eyebrow="Programmes"
        title="Explore accredited and market-ready training"
        description="Filter by category, search by need, and compare programme outcomes to find the right learning pathway."
      />
      <Suspense fallback={<ProgrammeSkeletons />}>
        <CatalogueContainer />
      </Suspense>
    </section>
  );
}
