"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BriefcaseBusiness, CircleCheckBig, FileClock, GraduationCap, Layers3, Users } from "lucide-react";
import { AchievementToast } from "@/components/lms/AchievementToast";
import { CertificateGenerator } from "@/components/lms/CertificateGenerator";
import { CompanyLearnerManager } from "@/components/lms/CompanyLearnerManager";
import { LmsStatCard } from "@/components/lms/LmsStatCard";
import { ReportingCharts } from "@/components/lms/ReportingCharts";
import { ReportsTable } from "@/components/lms/ReportsTable";
import {
  CompletionFilter,
  getCertificatesForCompany,
  getReportingRows,
} from "@/lib/lms-store";
import { useCompanyPortal } from "@/components/lms/useLmsPortalState";
import { useLmsSession } from "@/components/lms/useLmsSession";

export function CompanyDashboardPanel() {
  const { session } = useLmsSession();
  const companyId = session?.companyId ?? "";
  const { company, overview, requests, addLearner, importLearners, requestEnrollment, portalState, loading } = useCompanyPortal(companyId);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedLearnerIds, setSelectedLearnerIds] = useState<string[]>([]);
  const [reportCourseFilter, setReportCourseFilter] = useState("all");
  const [reportStatusFilter, setReportStatusFilter] = useState<CompletionFilter>("all");
  const [toast, setToast] = useState<{ open: boolean; title: string; description: string }>({
    open: false,
    title: "",
    description: "",
  });

  const courseOptions = useMemo(() => portalState?.courses ?? [], [portalState]);
  const effectiveSelectedCourseId = selectedCourseId || courseOptions[0]?.id || "";
  const selectedCourse = useMemo(
    () => courseOptions.find((course) => course.id === effectiveSelectedCourseId) ?? null,
    [courseOptions, effectiveSelectedCourseId],
  );
  const pendingRequests = requests.filter((request) => request.status === "pending_invoice");
  const activeRequests = requests.filter((request) => request.status === "active");
  const reportRows = useMemo(
    () =>
      portalState
        ? getReportingRows(portalState, {
            companyId,
            courseId: reportCourseFilter,
            completionStatus: reportStatusFilter,
          })
        : [],
    [companyId, portalState, reportCourseFilter, reportStatusFilter],
  );
  const companyCertificates = useMemo(
    () => (portalState ? getCertificatesForCompany(portalState, companyId) : []),
    [companyId, portalState],
  );
  const recentCompanyActivity = portalState?.activityFeed.filter((entry) => entry.companyId === companyId).slice(0, 5) ?? [];

  function showToast(title: string, description: string) {
    setToast({ open: true, title, description });
    window.setTimeout(() => setToast((current) => ({ ...current, open: false })), 2200);
  }

  if (loading || !portalState) {
    return <div className="rounded-2xl border border-line bg-white p-6 text-sm leading-7 text-slate shadow-sm">Loading company workspace...</div>;
  }

  if (!company) {
    return (
      <div className="rounded-2xl border border-line bg-white p-6 text-sm leading-7 text-slate shadow-sm">
        Company profile could not be loaded.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-4">
        <LmsStatCard
          label="Company"
          value={company.name.split(" ")[0]}
          detail={`Primary contact: ${company.contactPerson}`}
          icon={<BriefcaseBusiness className="h-5 w-5" />}
        />
        <LmsStatCard
          label="Total Learners"
          value={String(overview.reportingSummary.totalLearners).padStart(2, "0")}
          detail="Learners currently managed inside your company workspace."
          icon={<Users className="h-5 w-5" />}
        />
        <LmsStatCard
          label="Active Learners"
          value={String(overview.reportingSummary.activeLearners).padStart(2, "0")}
          detail="Learners who have started at least one approved course."
          icon={<GraduationCap className="h-5 w-5" />}
        />
        <LmsStatCard
          label="Certificates Issued"
          value={String(overview.reportingSummary.certificatesIssued).padStart(2, "0")}
          detail="Certificates earned by learners inside your company cohort."
          icon={<CircleCheckBig className="h-5 w-5" />}
        />
      </div>

      <div className="mt-10">
        <CompanyLearnerManager
          company={company}
          onAddLearner={(name, email) => {
            addLearner(name, email);
            showToast("Learner added", `${name} was added to your company roster.`);
          }}
          onImportLearners={(rows) => {
            importLearners(rows);
            showToast("CSV imported", `${rows.length} learners were added to your roster.`);
          }}
        />
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="premium-panel p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Bulk Enrollment</p>
          <h2 className="mt-4 font-sans text-2xl font-semibold tracking-tight text-navy">Request team access by invoice</h2>
          <p className="mt-3 text-sm leading-7 text-slate">
            Select a course, choose multiple learners, and generate a single invoice-ready enrollment request for admin review.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-navy">Course</label>
              <select
                value={effectiveSelectedCourseId}
                onChange={(event) => setSelectedCourseId(event.target.value)}
                className="w-full rounded-2xl border border-line bg-mist/40 px-4 py-3 text-sm text-navy outline-none transition focus:border-navy/30 focus:bg-white"
              >
                {courseOptions.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-navy">Learners</label>
              <div className="grid gap-3 sm:grid-cols-2">
                {company.learners.map((learner) => {
                  const checked = selectedLearnerIds.includes(learner.id);

                  return (
                    <label
                      key={learner.id}
                      className={`cursor-pointer rounded-2xl border px-4 py-3 transition-all duration-300 ${
                        checked ? "border-navy bg-navy text-white shadow-soft" : "border-line bg-white hover:-translate-y-0.5 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setSelectedLearnerIds((current) =>
                              current.includes(learner.id)
                                ? current.filter((item) => item !== learner.id)
                                : [...current, learner.id],
                            )
                          }
                          className="mt-1 h-4 w-4 rounded border-line"
                        />
                        <div>
                          <p className={`font-semibold ${checked ? "text-white" : "text-navy"}`}>{learner.name}</p>
                          <p className={`text-sm leading-7 ${checked ? "text-white/80" : "text-slate"}`}>{learner.email}</p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-mist/60 px-4 py-4">
              <p className="text-sm leading-7 text-slate">
                {selectedCourse
                  ? `Invoice total: R ${(selectedCourse.price * selectedLearnerIds.length).toLocaleString("en-ZA")} for ${selectedLearnerIds.length} learner${selectedLearnerIds.length === 1 ? "" : "s"}.`
                  : "Select a course to generate invoice totals."}
              </p>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                if (!selectedCourse || !selectedLearnerIds.length) {
                  return;
                }

                requestEnrollment(selectedCourse.id, selectedLearnerIds);
                showToast("Enrollment request sent", "Your invoice-based enrollment request is now pending admin review.");
                setSelectedLearnerIds([]);
              }}
            >
              Request Enrollment
            </button>
          </div>
        </article>

        <article className="premium-panel p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Enrollment Status</p>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-line bg-white p-5">
              <h3 className="font-semibold text-navy">Pending Requests</h3>
              <div className="mt-4 space-y-3">
                {pendingRequests.map((request) => {
                  const course = courseOptions.find((item) => item.id === request.courseId);
                  return (
                    <div key={request.id} className="rounded-2xl border border-line bg-mist/60 px-4 py-3">
                      <p className="font-semibold text-navy">{course?.title}</p>
                      <p className="text-sm leading-7 text-slate">
                        {request.learnerIds.length} learners • {request.invoiceReference}
                      </p>
                      <p className="text-sm leading-7 text-slate">Total: R {request.totalAmount.toLocaleString("en-ZA")}</p>
                    </div>
                  );
                })}
                {!pendingRequests.length ? <p className="text-sm leading-7 text-slate">No pending invoice requests right now.</p> : null}
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5">
              <h3 className="font-semibold text-navy">Recent Activity</h3>
              <div className="mt-4 space-y-3">
                {recentCompanyActivity.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-line bg-mist/60 px-4 py-3">
                    <p className="font-semibold text-navy">{entry.message}</p>
                    <p className="text-sm leading-7 text-slate">
                      {new Date(entry.timestamp).toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                ))}
                {!recentCompanyActivity.length ? (
                  <p className="text-sm leading-7 text-slate">Recent activity will appear here as learners and requests progress.</p>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-gradient-to-br from-white to-mist/60 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Portal Access</p>
              <p className="mt-3 text-sm leading-7 text-slate">
                Your learners will get course access automatically once an admin marks the invoice request as paid.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/lms/student/courses" className="btn-secondary-dark">
                  View Course Library
                </Link>
                <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate shadow-sm">
                  Admin: admin@limco.co.za
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div className="mt-10">
        <ReportingCharts
          title="Company learner insights"
          series={[
            { label: "Active learners", value: overview.reportingSummary.activeLearners, colorClass: "bg-navy" },
            { label: "Certificates issued", value: overview.reportingSummary.certificatesIssued, colorClass: "bg-gold" },
            { label: "Completed courses", value: overview.reportingSummary.completedCourses, colorClass: "bg-emerald-500" },
          ]}
        />
      </div>

      <div className="mt-10">
        <ReportsTable
          rows={reportRows}
          title="Company learner performance"
          courses={courseOptions}
          courseFilter={reportCourseFilter}
          onCourseFilterChange={setReportCourseFilter}
          statusFilter={reportStatusFilter}
          onStatusFilterChange={setReportStatusFilter}
        />
      </div>

      <div className="mt-10">
        <div className="mb-6">
          <span className="eyebrow">Certificates</span>
          <h2 className="mt-4 font-sans text-3xl font-semibold tracking-tight text-navy">Learner certificates</h2>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          {companyCertificates.map((certificate) => (
            <CertificateGenerator key={certificate.id} certificate={certificate} />
          ))}
          {!companyCertificates.length ? (
            <div className="rounded-2xl border border-line bg-white p-6 text-sm leading-7 text-slate shadow-sm">
              Certificates will appear here as learners complete their courses.
            </div>
          ) : null}
        </div>
      </div>

      <AchievementToast open={toast.open} title={toast.title} description={toast.description} />
    </>
  );
}
