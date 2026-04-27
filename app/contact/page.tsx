import { Mail, MapPin, Phone } from "lucide-react";
import { contactDetails } from "@/lib/data";

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="section-shell relative max-w-4xl space-y-6">
          <span className="eyebrow border-white/20 bg-white/10 text-white">Contact</span>
          <h1 className="font-sans text-5xl font-bold leading-[1.04] tracking-tight md:text-6xl">
            Speak to Limco about programmes, partnerships, and workforce solutions.
          </h1>
          <p className="page-hero-copy">
            Whether you are an applicant, employer, or institutional partner, our team is ready to
            support your next step.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="section-shell section-space grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div data-reveal className="premium-panel bg-mist/60 p-8">
            <span className="eyebrow">Contact Details</span>
            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-navy text-gold">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-navy">Address</p>
                  <p className="mt-2 text-sm leading-7 text-slate">{contactDetails.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-navy text-gold">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-navy">Phone</p>
                  <a href="tel:0844256998" className="link-underline mt-2 inline-block text-sm leading-7 text-slate hover:text-navy">
                    {contactDetails.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-navy text-gold">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-navy">Email</p>
                  <a
                    href={`mailto:${contactDetails.email}`}
                    className="link-underline mt-2 inline-block text-sm leading-7 text-slate hover:text-navy"
                  >
                    {contactDetails.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div data-reveal className="premium-panel p-8">
            <span className="eyebrow">Enquiry Form</span>
            <div className="mt-6 grid gap-5">
              <div className="grid gap-2 md:grid-cols-2 md:gap-5">
                <div className="grid gap-2">
                  <label htmlFor="contact-name" className="text-sm font-semibold text-navy">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    className="input-field h-12"
                    placeholder="Your full name"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="contact-organisation" className="text-sm font-semibold text-navy">
                    Organisation
                  </label>
                  <input
                    id="contact-organisation"
                    type="text"
                    className="input-field h-12"
                    placeholder="Company or institution"
                  />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2 md:gap-5">
                <div className="grid gap-2">
                  <label htmlFor="contact-email" className="text-sm font-semibold text-navy">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    className="input-field h-12"
                    placeholder="name@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="contact-phone" className="text-sm font-semibold text-navy">
                    Phone Number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    className="input-field h-12"
                    placeholder="+27"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="contact-message" className="text-sm font-semibold text-navy">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={6}
                  className="input-field py-3"
                  placeholder="Tell us how we can help with programmes, partnerships, or staffing needs."
                />
              </div>
              <button
                type="button"
                className="btn-primary justify-center"
              >
                Send Enquiry
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
