import Link from "next/link";
import { Facebook, Mail, Phone } from "lucide-react";
import { PartnersSlider } from "@/components/PartnersSlider";
import { contactDetails, navLinks, socialLinks } from "@/lib/data";

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <PartnersSlider />
      <div className="section-shell grid gap-12 py-14 lg:grid-cols-[1.2fr_0.8fr_1fr_0.9fr]">
        <div className="space-y-4">
          <p className="font-sans text-2xl font-semibold tracking-tight">Limco Consulting and Management</p>
          <p className="max-w-xl text-sm leading-7 text-white/74">
            Helping organisations and learners unlock employability, compliance readiness, and workforce
            transformation through accredited skills development solutions.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Quick Links</p>
          <div className="grid gap-3 text-sm text-white/78">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="link-underline w-fit transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Contact</p>
          <div className="space-y-2 text-sm leading-7 text-white/78">
            <p>{contactDetails.address}</p>
            <a href="tel:0844256998" className="link-underline block w-fit transition hover:text-white">
              {contactDetails.phone}
            </a>
            <a href={`mailto:${contactDetails.email}`} className="link-underline block w-fit transition hover:text-white">
              {contactDetails.email}
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Connect</p>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <Facebook className="h-5 w-5" />
              </a>
            ))}
            <a
              href={`mailto:${contactDetails.email}`}
              aria-label="Email Limco"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href="tel:0844256998"
              aria-label="Call Limco"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <Phone className="h-5 w-5" />
            </a>
          </div>
          <p className="text-sm leading-7 text-white/68">
            Connect with our team for programme applications, partnerships, and workforce solutions.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-shell flex flex-col gap-3 py-5 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Limco Consulting and Management. All rights reserved.</p>
          <p>Skills development, compliance support, and workforce solutions.</p>
        </div>
      </div>
    </footer>
  );
}
