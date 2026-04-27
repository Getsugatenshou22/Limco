import { ProgramCard } from "@/components/ProgramCard";
import { programGroups } from "@/lib/data";

type ProgramsGridProps = {
  intro?: boolean;
};

export function ProgramsGrid({ intro = true }: ProgramsGridProps) {
  return (
    <section className="bg-white">
      <div className="section-shell section-space">
        {intro ? (
          <div data-reveal className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <span className="eyebrow">Programmes</span>
              <h2 className="section-title">Structured programmes organised for clear learner and employer pathways.</h2>
            </div>
            <p className="section-copy max-w-2xl">
              Nationally recognised programmes designed to build real-world skills, improve employability,
              and support workforce readiness across priority sectors.
            </p>
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {programGroups.map((group) => [
            <div key={group.title} data-reveal className="space-y-3 md:col-span-2 xl:col-span-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{group.title}</p>
              <h3 className="font-sans text-2xl font-semibold tracking-tight text-navy">{group.description}</h3>
            </div>,
            ...group.items.map((program) => (
              <ProgramCard key={`${group.title}-${program.title}`} program={program} />
            )),
          ])}
        </div>
      </div>
    </section>
  );
}
