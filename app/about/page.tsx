import { values } from "@/lib/data";
import { AboutSection } from "@/components/AboutSection";
import { CTASection } from "@/components/CTASection";

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="section-shell relative max-w-4xl space-y-6">
          <span className="eyebrow border-white/20 bg-white/10 text-white">About Us</span>
          <h1 className="font-sans text-5xl font-bold leading-[1.04] tracking-tight md:text-6xl">
            Institutional skills development with a national growth mindset.
          </h1>
          <p className="page-hero-copy">
            Limco Consulting and Management exists to connect South Africans to credible training,
            workplace opportunities, and organisational support that advances inclusive economic participation.
          </p>
        </div>
      </section>

      <AboutSection />

      <section className="bg-white">
        <div className="section-shell section-space">
          <div data-reveal className="mb-12 space-y-4">
            <span className="eyebrow">Why Limco</span>
            <h2 className="section-title">A delivery model anchored in trust, access, and outcomes.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  data-reveal
                  className="interactive-card rounded-2xl border border-gray-100 bg-gradient-to-b from-white to-gray-50/70 p-6 shadow-sm"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-gold">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-sans text-2xl font-semibold tracking-tight text-navy">{value.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate">{value.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
