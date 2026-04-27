"use client";

import { PDFDocument, StandardFonts } from "pdf-lib";
import { Download } from "lucide-react";
import { CompletionFilter, ReportingRow, exportReportingRowsToCsv } from "@/lib/lms-store";
import { Course } from "@/lib/lms-data";

type ReportsTableProps = {
  rows: ReportingRow[];
  title: string;
  courses?: Course[];
  courseFilter: string;
  onCourseFilterChange: (value: string) => void;
  statusFilter: CompletionFilter;
  onStatusFilterChange: (value: CompletionFilter) => void;
  companyFilter?: string;
  onCompanyFilterChange?: (value: string) => void;
  companyOptions?: Array<{ id: string; name: string }>;
};

export function ReportsTable({
  rows,
  title,
  courses = [],
  courseFilter,
  onCourseFilterChange,
  statusFilter,
  onStatusFilterChange,
  companyFilter,
  onCompanyFilterChange,
  companyOptions = [],
}: ReportsTableProps) {
  function handleExport() {
    const csv = exportReportingRowsToCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${title.toLowerCase().replaceAll(" ", "-")}-report.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function handlePdfExport() {
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const page = pdf.addPage([842, 595]);
    page.drawText(title, { x: 40, y: 545, size: 22, font: bold });
    let y = 505;
    page.drawText("Learner", { x: 40, y, size: 11, font: bold });
    page.drawText("Course", { x: 220, y, size: 11, font: bold });
    page.drawText("Progress", { x: 520, y, size: 11, font: bold });
    page.drawText("Status", { x: 620, y, size: 11, font: bold });

    for (const row of rows.slice(0, 18)) {
      y -= 24;
      page.drawText(row.learnerName.slice(0, 28), { x: 40, y, size: 10, font });
      page.drawText(row.courseTitle.slice(0, 40), { x: 220, y, size: 10, font });
      page.drawText(`${row.progressPercentage}%`, { x: 520, y, size: 10, font });
      page.drawText(row.status.replaceAll("_", " "), { x: 620, y, size: 10, font });
    }

    const bytes = await pdf.save();
    const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${title.toLowerCase().replaceAll(" ", "-")}-report.pdf`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <article className="premium-panel p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Reporting</p>
          <h3 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-navy">{title}</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={courseFilter}
            onChange={(event) => onCourseFilterChange(event.target.value)}
            className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-navy outline-none"
          >
            <option value="all">All courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value as CompletionFilter)}
            className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-navy outline-none"
          >
            <option value="all">All statuses</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In progress</option>
            <option value="not_started">Not started</option>
          </select>
          {onCompanyFilterChange ? (
            <select
              value={companyFilter}
              onChange={(event) => onCompanyFilterChange(event.target.value)}
              className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-navy outline-none"
            >
              <option value="all">All companies</option>
              {companyOptions.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          ) : null}
          <button type="button" onClick={handleExport} className="btn-secondary-dark">
            Export CSV
            <Download className="ml-2 h-4 w-4" />
          </button>
          <button type="button" onClick={() => void handlePdfExport()} className="btn-secondary-dark">
            Export PDF
            <Download className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate">
              <th className="px-4">Learner name</th>
              <th className="px-4">Course</th>
              <th className="px-4">Progress %</th>
              <th className="px-4">Status</th>
              <th className="px-4">Certificate</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="rounded-2xl bg-white shadow-sm">
                <td className="rounded-l-2xl border-y border-l border-line px-4 py-4">
                  <p className="font-semibold text-navy">{row.learnerName}</p>
                  <p className="text-sm text-slate">{row.companyName ?? "Independent learner"}</p>
                </td>
                <td className="border-y border-line px-4 py-4 text-sm text-slate">{row.courseTitle}</td>
                <td className="border-y border-line px-4 py-4 text-sm text-slate">{row.progressPercentage}%</td>
                <td className="border-y border-line px-4 py-4">
                  <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate">
                    {row.status.replaceAll("_", " ")}
                  </span>
                </td>
                <td className="rounded-r-2xl border-y border-r border-line px-4 py-4 text-sm font-semibold text-navy">
                  {row.hasCertificate ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length ? (
          <div className="rounded-2xl border border-line bg-mist/60 px-4 py-3 text-sm leading-7 text-slate">
            No report rows match the current filters.
          </div>
        ) : null}
      </div>
    </article>
  );
}
