"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/data";

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ease-out ${
        scrolled
          ? "border-b border-gray-100 bg-white/70 shadow-sm backdrop-blur-md"
          : "border-b border-white/10 bg-navy/95 backdrop-blur"
      }`}
    >
      <div className="section-shell py-4">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="flex min-w-0 items-center" onClick={() => setMenuOpen(false)}>
            <Image
              src="/branding/limco-logo.png"
              alt="Limco Consulting and Management Pty. Ltd. logo"
              width={320}
              height={78}
              className="h-16 w-auto sm:h-[4.5rem]"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`link-underline rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ease-out ${
                    active
                      ? scrolled
                        ? "bg-navy text-white"
                        : "bg-white/12 text-white"
                      : scrolled
                        ? "text-navy/72 hover:bg-navy/5 hover:text-navy"
                        : "text-white/78 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/apply" className="btn-primary hidden sm:inline-flex">
              Apply Now
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 ease-out lg:hidden ${
                scrolled ? "border-navy/10 bg-white text-navy shadow-sm" : "border-white/15 text-white"
              }`}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="premium-panel mt-4 grid gap-2 rounded-[1.75rem] p-3 lg:hidden">
            {navLinks.map((link) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active ? "bg-navy text-white" : "text-navy hover:bg-mist hover:text-navy"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href="/apply" onClick={() => setMenuOpen(false)} className="btn-primary mt-2 inline-flex justify-center">
              Apply Now
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
