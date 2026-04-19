'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';

const links = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['Programmes', '/programmes'],
  ['Projects', '/projects'],
  ['Contact', '/contact']
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 mx-auto mt-4 w-[95%] max-w-6xl rounded-2xl glass"
    >
      <nav className="flex items-center justify-between px-5 py-3">
        <Link href="/" className="font-[var(--font-poppins)] text-lg font-semibold tracking-wide">
          LIMCO
        </Link>
        <div className="hidden gap-1 md:flex">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm transition hover:bg-black/5 dark:hover:bg-white/10',
                pathname === href && 'bg-black/10 dark:bg-white/15'
              )}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/contact" className="rounded-lg bg-primary px-4 py-2 text-sm text-white shadow-glow">
            Enquire Now
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </motion.header>
  );
}
