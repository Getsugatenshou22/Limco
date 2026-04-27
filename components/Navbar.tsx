"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, GraduationCap, LayoutDashboard, Menu, ShieldCheck, Building2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/data";
import { useLmsSession } from "@/components/lms/useLmsSession";

const portalLinks = [
  { href: "/lms/student", label: "Continue Learning", icon: LayoutDashboard },
  { href: "/lms/admin", label: "Admin Panel", icon: ShieldCheck },
  { href: "/lms/company", label: "Company Portal", icon: Building2 },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const { session, hydrated } = useLmsSession();

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
            <div className="relative hidden sm:block">
              <Link href="/lms" className={`btn-portal ${hydrated && session ? "pr-12" : ""}`}>
                <GraduationCap className="h-4 w-4" />
                <span>Student Portal</span>
              </Link>

              {hydrated && session ? (
                <>
                  <button
                    type="button"
                    aria-label="Open LMS portal menu"
                    aria-expanded={portalOpen}
                    onClick={() => setPortalOpen((open) => !open)}
                    className="absolute inset-y-1 right-1 inline-flex w-10 items-center justify-center rounded-2xl border border-white/20 bg-white/12 text-white transition hover:bg-white/20"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${portalOpen ? "rotate-180" : ""}`} />
                  </button>

                  {portalOpen ? (
                    <div className="absolute right-0 top-[calc(100%+0.75rem)] w-64 rounded-[1.5rem] border border-line bg-white p-3 shadow-[0_24px_70px_-34px_rgba(11,31,59,0.35)]">
                      <div className="mb-2 px-3 py-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">LMS Access</p>
                        <p className="mt-1 text-sm text-slate">{session.name}</p>
                      </div>
                      <div className="grid gap-1">
                        {portalLinks.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setPortalOpen(false)}
                              className="rounded-2xl px-3 py-3 text-sm font-medium text-navy transition hover:bg-mist"
                            >
                              <span className="flex items-center gap-3">
                                <Icon className="h-4 w-4" />
                                {item.label}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>

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
            <Link href="/lms" onClick={() => setMenuOpen(false)} className="btn-portal mt-2 justify-center">
              <GraduationCap className="h-4 w-4" />
              Student Portal
            </Link>
            <Link href="/apply" onClick={() => setMenuOpen(false)} className="btn-primary mt-2 inline-flex justify-center">
              Apply Now
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
