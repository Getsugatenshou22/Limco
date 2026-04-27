import Link from "next/link";
import type { Program } from "@/lib/data";

type ProgramCardProps = {
  program: Program;
};

export function ProgramCard({ program }: ProgramCardProps) {
  const nqfBadge = program.nqfLabel ?? (program.nqfLevel !== null ? `NQF ${program.nqfLevel}` : "Short Course");
  const isShortCourse = program.nqfLevel === null;

  return (
    <article
      data-reveal
      className="interactive-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-b from-white to-gray-50/70 p-6 shadow-sm"
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
      <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-6 opacity-0 transition duration-300 ease-out group-hover:opacity-100">
        <span className="rounded-full bg-navy px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg">
          View Programme
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-navy">
          {program.category}
        </span>
        <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate">
          {nqfBadge}
        </span>
        {isShortCourse ? (
          <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-navy">
            Popular Short Courses
          </span>
        ) : null}
      </div>
      <h3 className="mt-5 font-sans text-2xl font-semibold tracking-tight text-navy">{program.title}</h3>
      <p className="mt-4 text-sm leading-7 text-slate">
        {isShortCourse
          ? "Flexible short-course training designed for practical upskilling, workplace relevance, and quick capability gains."
          : "Structured institutional learning designed to support workplace readiness, accredited progression, and sector-aligned capability development."}
      </p>
      <div className="mt-6 h-px bg-gray-100" />
      <p className="mt-5 text-sm font-semibold text-navy">
        {isShortCourse ? "Fast-track support for course selection and enrolment" : "Application support and screening included"}
      </p>
      <Link href={isShortCourse ? "/contact" : "/apply"} className="link-underline mt-5 w-fit text-sm font-semibold text-navy">
        {isShortCourse ? "Enquire Now" : "Get Started"}
      </Link>
    </article>
  );
}
