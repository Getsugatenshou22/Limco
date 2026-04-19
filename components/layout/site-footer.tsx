import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-20 w-[95%] max-w-6xl rounded-2xl glass px-6 py-10">
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="font-[var(--font-poppins)] text-xl font-semibold">LIMCO</h3>
          <p className="mt-3 text-sm text-foreground/70">Consulting and accredited training programmes for future-focused teams.</p>
        </div>
        <div>
          <h4 className="font-semibold">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-foreground/70">
            <li><Link href="/programmes">Programmes</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/projects">Projects</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Contact</h4>
          <p className="mt-3 text-sm text-foreground/70">info@limco.co.za</p>
          <p className="text-sm text-foreground/70">Johannesburg, South Africa</p>
        </div>
      </div>
    </footer>
  );
}
