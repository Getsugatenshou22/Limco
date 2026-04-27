"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { CompanyProfile } from "@/lib/lms-store";

type CompanyLearnerManagerProps = {
  company: CompanyProfile;
  onAddLearner: (name: string, email: string) => void;
  onImportLearners: (rows: Array<{ name: string; email: string }>) => void;
};

export function CompanyLearnerManager({
  company,
  onAddLearner,
  onImportLearners,
}: CompanyLearnerManagerProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const learnerCountLabel = useMemo(
    () => `${company.learners.length} learner${company.learners.length === 1 ? "" : "s"}`,
    [company.learners.length],
  );

  function handleSubmit() {
    if (!name.trim() || !email.trim()) {
      return;
    }

    onAddLearner(name.trim(), email.trim());
    setName("");
    setEmail("");
  }

  function handleCsvUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    file
      .text()
      .then((content) => {
        const rows = content
          .split(/\r?\n/)
          .slice(1)
          .map((line) => line.split(","))
          .map(([rowName, rowEmail]) => ({
            name: rowName?.trim() ?? "",
            email: rowEmail?.trim() ?? "",
          }))
          .filter((row) => row.name && row.email);

        if (rows.length) {
          onImportLearners(rows);
        }
      })
      .finally(() => {
        event.target.value = "";
      });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Add Learners</p>
        <h2 className="mt-4 font-sans text-2xl font-semibold tracking-tight text-navy">Grow your learning cohort</h2>
        <p className="mt-3 text-sm leading-7 text-slate">
          Add learners one by one or upload a simple CSV with `name,email` columns to prepare a bulk enrollment request.
        </p>

        <div className="mt-6 space-y-4">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Learner name"
            className="w-full rounded-2xl border border-line bg-mist/40 px-4 py-3 text-sm text-navy outline-none transition focus:border-navy/30 focus:bg-white"
          />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Learner email"
            type="email"
            className="w-full rounded-2xl border border-line bg-mist/40 px-4 py-3 text-sm text-navy outline-none transition focus:border-navy/30 focus:bg-white"
          />
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleSubmit} className="btn-primary">
              Add Learner
            </button>
            <label className="btn-secondary-dark cursor-pointer">
              <Upload className="h-4 w-4" />
              Upload CSV
              <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleCsvUpload} />
            </label>
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Your Team</p>
            <h2 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-navy">{learnerCountLabel}</h2>
          </div>
          <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate">
            {company.status}
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {company.learners.map((learner) => (
            <div key={learner.id} className="rounded-2xl border border-line bg-mist/60 px-4 py-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-navy">{learner.name}</p>
                  <p className="text-sm leading-7 text-slate">{learner.email}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate shadow-sm">
                  {learner.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
