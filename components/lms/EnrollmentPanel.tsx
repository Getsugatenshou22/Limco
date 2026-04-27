"use client";

import { useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { Course } from "@/lib/lms-data";
import { AchievementToast } from "@/components/lms/AchievementToast";
import { bankingDetails, buildPaymentReference, EnrollmentStatus, PaymentProofRecord } from "@/lib/lms-store";

type EnrollmentPanelProps = {
  userId: string;
  course: Course;
  status: EnrollmentStatus;
  proof?: PaymentProofRecord;
  onSubmitProof: (file: File) => void;
};

export function EnrollmentPanel({ userId, course, status, proof, onSubmitProof }: EnrollmentPanelProps) {
  const [toastOpen, setToastOpen] = useState(false);
  const [selectedName, setSelectedName] = useState<string | null>(proof?.proofName ?? null);
  const reference = useMemo(() => buildPaymentReference(userId, course.id), [userId, course.id]);

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    onSubmitProof(file);
    setSelectedName(file.name);
    setToastOpen(true);
    window.setTimeout(() => setToastOpen(false), 2200);
  }

  return (
    <div className="space-y-6">
      <article className="premium-panel p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-navy">
            EFT Enrollment
          </span>
          <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate">
            R {course.price.toLocaleString("en-ZA")}
          </span>
        </div>

        <h2 className="mt-5 font-sans text-3xl font-semibold tracking-tight text-navy">{course.title}</h2>
        <p className="mt-3 text-sm leading-7 text-slate">
          Complete payment via EFT, then upload proof of payment for review before full course access is unlocked.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-mist/60 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Banking Details</p>
            <div className="mt-4 grid gap-3 text-sm leading-7 text-slate">
              <p><span className="font-semibold text-navy">Bank:</span> {bankingDetails.bankName}</p>
              <p><span className="font-semibold text-navy">Account Name:</span> {bankingDetails.accountName}</p>
              <p><span className="font-semibold text-navy">Account Number:</span> {bankingDetails.accountNumber}</p>
              <p><span className="font-semibold text-navy">Reference:</span> {reference}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Enrollment Status</p>
            <p className="mt-4 font-semibold text-navy">
              {status === "pending_payment"
                ? "Payment Under Review ⏳"
                : status === "rejected"
                  ? "Payment Rejected"
                  : "Enroll Now"}
            </p>
            <p className="mt-2 text-sm leading-7 text-slate">
              {status === "pending_payment"
                ? "Your proof of payment has been submitted and is awaiting admin approval."
                : status === "rejected"
                  ? "Your last payment proof was rejected. Please upload an updated POP to continue."
                  : "Make payment using the banking details provided, then upload your POP below."}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <label className="btn-primary cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Upload Proof of Payment
                <input type="file" accept=".pdf,image/*" className="hidden" onChange={handleUpload} />
              </label>
              {selectedName ? <span className="text-sm text-slate">{selectedName}</span> : null}
            </div>
          </div>
        </div>

        {proof ? (
          <div className="mt-6 rounded-2xl border border-line bg-white p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Latest POP</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-navy">{proof.proofName}</p>
                <p className="text-sm leading-7 text-slate">
                  Uploaded {new Date(proof.uploadedAt).toLocaleDateString("en-ZA", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <a href={proof.proofUrl} target="_blank" rel="noreferrer" className="btn-secondary-dark">
                View File
              </a>
            </div>
          </div>
        ) : null}
      </article>

      <AchievementToast
        open={toastOpen}
        title="Payment submitted successfully"
        description="Your proof of payment has been uploaded and is now awaiting review."
      />
    </div>
  );
}
