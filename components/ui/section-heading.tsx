import { cn } from '@/lib/utils';

export function SectionHeading({
  eyebrow,
  title,
  description,
  className
}: {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn('max-w-2xl space-y-3', className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <h2 className="font-[var(--font-poppins)] text-3xl font-semibold md:text-4xl">{title}</h2>
      <p className="text-foreground/70">{description}</p>
    </div>
  );
}
