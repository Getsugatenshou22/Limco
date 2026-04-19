import { SectionHeading } from '@/components/ui/section-heading';

const services = [
  'Strategic consulting and transformation advisory',
  'Custom training programme design and delivery',
  'Compliance and governance implementation support',
  'Operational optimisation and process redesign'
];

export default function ServicesPage() {
  return (
    <section className="mx-auto mt-14 w-[95%] max-w-6xl space-y-8">
      <SectionHeading
        eyebrow="Services"
        title="Consulting designed for execution"
        description="Premium advisory services that bridge boardroom vision and operational delivery."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <article key={service} className="glass rounded-2xl p-6">
            <h3 className="font-[var(--font-poppins)] text-xl font-semibold">{service}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
