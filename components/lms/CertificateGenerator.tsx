"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { CertificateRecord } from "@/lib/lms-store";

type CertificateGeneratorProps = {
  certificate: CertificateRecord;
};

export function CertificateGenerator({ certificate }: CertificateGeneratorProps) {
  const completionDate = new Date(certificate.completionDate).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="rounded-2xl border border-line bg-white p-6 shadow-sm">
      <div className="rounded-[1.5rem] border border-gold/20 bg-gradient-to-br from-white via-mist/40 to-gold/10 p-6">
        <div className="flex items-center justify-between gap-4">
          <Image
            src="/branding/limco-logo.png"
            alt="Limco logo"
            width={180}
            height={44}
            className="h-10 w-auto"
          />
          <span className="rounded-full border border-navy/10 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate">
            {certificate.id}
          </span>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Certificate of Completion</p>
          <h3 className="mt-4 font-sans text-3xl font-semibold tracking-tight text-navy">{certificate.learnerName}</h3>
          <p className="mt-3 text-sm leading-7 text-slate">
            has successfully completed the course
          </p>
          <p className="mt-3 font-sans text-2xl font-semibold tracking-tight text-navy">{certificate.courseTitle}</p>
          <p className="mt-4 text-sm leading-7 text-slate">Completed on {completionDate}</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="border-t border-navy/15 pt-3 text-center text-sm text-slate">Training Director</div>
          <div className="border-t border-navy/15 pt-3 text-center text-sm text-slate">Programme Lead</div>
        </div>
      </div>

      <div className="mt-5">
        <a href={certificate.downloadUrl} className="btn-secondary-dark" download>
          Download PDF
          <Download className="ml-2 h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
