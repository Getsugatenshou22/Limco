import Image from "next/image";
import { featuredPartners } from "@/lib/data";

export function SocialProofSection() {
  return (
    <section className="bg-white">
      <div className="section-shell py-12 md:py-16">
        <div data-reveal className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <span className="eyebrow">Trusted by Industry Leaders</span>
            <h2 className="section-title">Trusted by industry leaders.</h2>
          </div>
          <p className="section-copy max-w-2xl">
            Delivering skills development solutions across South Africa.
          </p>
        </div>

        <div data-reveal className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {featuredPartners.map((partner) => (
            <div
              key={partner.name}
              className="flex min-h-[96px] items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/80 px-6 py-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white hover:shadow-xl"
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                width={140}
                height={48}
                loading="lazy"
                className="h-12 w-auto max-w-[140px] object-contain grayscale transition duration-300 ease-out hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
