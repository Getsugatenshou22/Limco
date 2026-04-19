export function ProgrammeSkeletons() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="h-64 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  );
}
