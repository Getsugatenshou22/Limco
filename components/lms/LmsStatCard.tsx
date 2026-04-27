import type { ReactNode } from "react";

type LmsStatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
};

export function LmsStatCard({ label, value, detail, icon }: LmsStatCardProps) {
  return (
    <article className="premium-panel p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate">{label}</p>
          <p className="mt-4 font-sans text-3xl font-semibold tracking-tight text-navy">{value}</p>
          <p className="mt-3 text-sm leading-7 text-slate">{detail}</p>
        </div>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-navy">
          {icon}
        </div>
      </div>
    </article>
  );
}
