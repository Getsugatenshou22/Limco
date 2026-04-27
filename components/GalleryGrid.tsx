import Image from "next/image";
import { galleryItems } from "@/lib/data";

export function GalleryGrid() {
  return (
    <section className="bg-white">
      <div className="section-shell section-space">
        <div data-reveal className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <span className="eyebrow">Gallery</span>
            <h2 className="section-title">A visual record of Limco programmes, learners, and delivery moments.</h2>
          </div>
          <p className="section-copy max-w-2xl">
            Selected images from programme activity, graduations, workplace readiness support, and accredited
            training environments across Limco&apos;s portfolio.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {galleryItems.map((item) => (
            <article
              key={item.src}
              data-reveal
              className="interactive-card group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                  className="object-cover transition duration-300 ease-out group-hover:scale-105"
                />
              </div>
              <div className="space-y-3 p-5">
                <span className="inline-flex rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-navy">
                  {item.category}
                </span>
                <h3 className="font-sans text-2xl font-semibold tracking-tight text-navy">{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
