"use client";

type ReportingChartsProps = {
  title: string;
  series: Array<{
    label: string;
    value: number;
    colorClass: string;
  }>;
};

export function ReportingCharts({ title, series }: ReportingChartsProps) {
  const max = Math.max(...series.map((item) => item.value), 1);

  return (
    <article className="premium-panel p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Visual Insights</p>
      <h3 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-navy">{title}</h3>
      <div className="mt-6 space-y-4">
        {series.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-navy">{item.label}</span>
              <span className="text-slate">{item.value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-mist">
              <div
                className={`h-full rounded-full ${item.colorClass}`}
                style={{ width: `${Math.max((item.value / max) * 100, item.value > 0 ? 12 : 0)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
