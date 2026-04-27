import { serviceGroups } from "@/lib/data";

type ServicesGridProps = {
  intro?: boolean;
  light?: boolean;
};

export function ServicesGrid({ intro = true, light = false }: ServicesGridProps) {
  return (
    <section className={light ? "bg-white" : "bg-mist"}>
      <div className="section-shell section-space">
        {intro ? (
          <div data-reveal className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <span className="eyebrow">Services</span>
              <h2 className="section-title">End-to-End Skills Development Solutions</h2>
            </div>
            <p className="section-copy max-w-2xl">
              From training to workforce placement, we deliver complete solutions for employers,
              institutions, and programme delivery partners.
            </p>
          </div>
        ) : null}

        <div className="grid gap-8 xl:grid-cols-3">
          {serviceGroups.map((group) => (
            <div key={group.title} data-reveal className="premium-panel p-6">
              <div className="space-y-4">
                <div className="inline-flex rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-navy">
                  {group.title}
                </div>
                <p className="text-sm leading-7 text-slate">{group.intro}</p>
              </div>

              <div className="mt-6 grid gap-4">
                {group.items.map((service, index) => (
                  <article
                    key={service}
                    className="interactive-card rounded-2xl border border-gray-100 bg-gradient-to-b from-white to-gray-50/80 p-5 shadow-sm"
                  >
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 text-xs font-semibold text-navy">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <h3 className="mt-4 font-sans text-xl font-semibold leading-tight tracking-tight text-navy">{service}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate">
                      Results-driven support tailored to training delivery, compliance readiness, and workforce execution.
                    </p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
