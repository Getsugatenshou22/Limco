"use client";

type ProgressBarProps = {
  completedLessons: number;
  totalLessons: number;
  percentage: number;
};

export function ProgressBar({ completedLessons, totalLessons, percentage }: ProgressBarProps) {
  return (
    <div className="premium-panel p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Course Progress</p>
          <p className="mt-2 font-sans text-3xl font-semibold tracking-tight text-navy">{percentage}% complete</p>
        </div>
        <p className="text-sm leading-7 text-slate">
          {completedLessons} of {totalLessons} lessons marked complete
        </p>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-mist">
        <div
          className="h-full rounded-full bg-gradient-to-r from-navy to-[#214980] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
