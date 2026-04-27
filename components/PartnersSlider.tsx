import Image from "next/image";
import { partners } from "@/lib/data";

const repeatedPartners = [...partners, ...partners];

export function PartnersSlider() {
  return (
    <section className="overflow-hidden border-y border-white/10 bg-[#08162b]">
      <div className="section-shell py-8">
        <div data-reveal className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Trusted by Industry Leaders</p>
            <h2 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-white sm:text-3xl">Trusted by leading organisations.</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-white/68">
            Delivering skills development solutions across South Africa.
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#08162b] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#08162b] to-transparent" />
          <div className="partners-marquee flex w-max items-center gap-5">
            {repeatedPartners.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                aria-hidden={index >= partners.length}
                className="flex min-h-[88px] min-w-[220px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:border-white/20 hover:bg-white/[0.08]"
              >
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={160}
                  height={56}
                  loading="lazy"
                  className="h-14 w-auto max-w-[160px] object-contain grayscale transition duration-300 ease-out hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
