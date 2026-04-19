import { SectionHeading } from '@/components/ui/section-heading';

export default function ContactPage() {
  return (
    <section className="mx-auto mt-14 w-[95%] max-w-4xl space-y-8">
      <SectionHeading
        eyebrow="Contact"
        title="Start your learning and transformation journey"
        description="Send us your requirements and our team will respond with a tailored advisory or programme recommendation."
      />
      <form className="glass space-y-4 rounded-2xl p-6">
        <input className="w-full rounded-xl border border-border bg-transparent px-4 py-3" placeholder="Name" required />
        <input className="w-full rounded-xl border border-border bg-transparent px-4 py-3" type="email" placeholder="Email" required />
        <input className="w-full rounded-xl border border-border bg-transparent px-4 py-3" placeholder="Organisation" />
        <textarea className="min-h-36 w-full rounded-xl border border-border bg-transparent px-4 py-3" placeholder="How can we help?" required />
        <button className="rounded-xl bg-primary px-5 py-3 text-white">Submit Enquiry</button>
      </form>
    </section>
  );
}
