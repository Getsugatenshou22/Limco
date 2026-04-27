"use client";

import { useMemo, useState } from "react";
import { BookOpenCheck, CircleCheckBig, FolderCog, Users } from "lucide-react";
import { AchievementToast } from "@/components/lms/AchievementToast";
import { LmsStatCard } from "@/components/lms/LmsStatCard";
import { ReportingCharts } from "@/components/lms/ReportingCharts";
import { ReportsTable } from "@/components/lms/ReportsTable";
import { useAdminPortal } from "@/components/lms/useLmsPortalState";
import { CompletionFilter, getReportingRows, getReportingSummary } from "@/lib/lms-store";

export function AdminManagementPanel() {
  const { portalState, loading, approveEnrollment, rejectEnrollment, approveCorporateRequest, rejectCorporateRequest } =
    useAdminPortal();
  const [reportCourseFilter, setReportCourseFilter] = useState("all");
  const [reportStatusFilter, setReportStatusFilter] = useState<CompletionFilter>("all");
  const [reportCompanyFilter, setReportCompanyFilter] = useState("all");
  const [toast, setToast] = useState<{ open: boolean; title: string; description: string }>({
    open: false,
    title: "",
    description: "",
  });

  const reportRows = useMemo(
    () =>
      portalState
        ? getReportingRows(portalState, {
            courseId: reportCourseFilter,
            completionStatus: reportStatusFilter,
            companyId: reportCompanyFilter === "all" ? undefined : reportCompanyFilter,
          })
        : [],
    [portalState, reportCourseFilter, reportStatusFilter, reportCompanyFilter],
  );
  const reportSummary = useMemo(
    () =>
      portalState
        ? getReportingSummary(portalState, reportRows)
        : {
            totalLearners: 0,
            activeLearners: 0,
            completedCourses: 0,
            certificatesIssued: 0,
            revenue: 0,
            pendingPayments: 0,
            approvedPayments: 0,
          },
    [portalState, reportRows],
  );

  function showToast(title: string, description: string) {
    setToast({ open: true, title, description });
    window.setTimeout(() => setToast((current) => ({ ...current, open: false })), 2200);
  }

  if (loading || !portalState) {
    return <div className="rounded-2xl border border-line bg-white p-6 text-sm leading-7 text-slate shadow-sm">Loading admin workspace...</div>;
  }

  const paymentApprovals = portalState.paymentProofs
    .map((proof) => ({
      proof,
      user: portalState.users.find((student) => student.id === proof.userId),
      course: portalState.courses.find((course) => course.id === proof.courseId),
      enrollment: portalState.enrollments.find(
        (entry) => entry.userId === proof.userId && entry.courseId === proof.courseId,
      ),
    }))
    .filter((item) => item.user && item.course);

  const corporateRequests = portalState.corporateRequests.map((request) => ({
    request,
    company: portalState.companies.find((company) => company.id === request.companyId),
    course: portalState.courses.find((course) => course.id === request.courseId),
  }));
  const recentActivity = portalState.activityFeed.slice(0, 6);

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-4">
        <LmsStatCard
          label="Total Learners"
          value={String(reportSummary.totalLearners).padStart(2, "0")}
          detail="Learner accounts currently active in LMS reporting."
          icon={<Users className="h-5 w-5" />}
        />
        <LmsStatCard
          label="Active Learners"
          value={String(reportSummary.activeLearners).padStart(2, "0")}
          detail="Learners who have started at least one course."
          icon={<BookOpenCheck className="h-5 w-5" />}
        />
        <LmsStatCard
          label="Completed Courses"
          value={String(reportSummary.completedCourses).padStart(2, "0")}
          detail="Course enrollments currently marked as fully completed."
          icon={<FolderCog className="h-5 w-5" />}
        />
        <LmsStatCard
          label="Certificates Issued"
          value={String(reportSummary.certificatesIssued).padStart(2, "0")}
          detail="Certificates generated automatically from completed courses."
          icon={<CircleCheckBig className="h-5 w-5" />}
        />
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="premium-panel p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Course Management</p>
          <div className="mt-6 grid gap-4">
            {portalState.courses.map((course) => (
              <div key={course.id} className="rounded-2xl border border-line bg-white p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="font-sans text-2xl font-semibold tracking-tight text-navy">{course.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-slate">{course.description}</p>
                  </div>
                  <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate">
                    {course.modules.length} modules
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <ReportingCharts
            title="Enrollment and payment trends"
            series={[
              { label: "Revenue-backed enrollments", value: reportSummary.revenue, colorClass: "bg-gold" },
              { label: "Pending payments", value: reportSummary.pendingPayments, colorClass: "bg-navy" },
              { label: "Approved payments", value: reportSummary.approvedPayments, colorClass: "bg-emerald-500" },
            ]}
          />
          <div className="premium-panel p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Recent Activity</p>
            <div className="mt-6 space-y-4">
              {recentActivity.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-line bg-white p-5">
                  <p className="font-semibold text-navy">{entry.message}</p>
                  <p className="mt-2 text-sm leading-7 text-slate">
                    {new Date(entry.timestamp).toLocaleDateString("en-ZA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 premium-panel p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Payment Approvals</p>
        <div className="mt-6 grid gap-4">
          {paymentApprovals.map(({ proof, user, course, enrollment }) => (
            <div key={`${proof.userId}-${proof.courseId}`} className="rounded-2xl border border-line bg-white p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <h2 className="font-semibold text-navy">{user?.name}</h2>
                  <p className="text-sm leading-7 text-slate">{course?.title}</p>
                  <p className="text-sm leading-7 text-slate">Status: {enrollment?.status ?? proof.status}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a href={proof.proofUrl} target="_blank" rel="noreferrer" className="btn-secondary-dark">
                    View File
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      approveEnrollment(proof.userId, proof.courseId);
                      showToast("Enrollment approved", `${user?.name} can now access ${course?.title}.`);
                    }}
                    className="btn-primary"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      rejectEnrollment(proof.userId, proof.courseId);
                      showToast("Enrollment rejected", `Payment proof for ${user?.name} was marked as rejected.`);
                    }}
                    className="btn-secondary-dark"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!paymentApprovals.length ? (
            <div className="rounded-2xl border border-line bg-mist/60 px-4 py-3 text-sm leading-7 text-slate">
              No payment approvals are currently waiting for review.
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-10 premium-panel p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Corporate Requests</p>
        <div className="mt-6 grid gap-4">
          {corporateRequests.map(({ request, company, course }) => (
            <div key={request.id} className="rounded-2xl border border-line bg-white p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <h2 className="font-semibold text-navy">{company?.name ?? "Unknown company"}</h2>
                  <p className="text-sm leading-7 text-slate">{course?.title}</p>
                  <p className="text-sm leading-7 text-slate">
                    {request.learnerIds.length} learners • {request.invoiceReference}
                  </p>
                  <p className="text-sm leading-7 text-slate">Total amount: R {request.totalAmount.toLocaleString("en-ZA")}</p>
                  <p className="text-sm leading-7 text-slate">Status: {request.status}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      approveCorporateRequest(request.id);
                      showToast("Corporate enrollment approved", `${company?.name} now has active learner access.`);
                    }}
                    className="btn-primary"
                    disabled={request.status === "active"}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      rejectCorporateRequest(request.id);
                      showToast("Corporate request rejected", `${company?.name} was notified that the request needs review.`);
                    }}
                    className="btn-secondary-dark disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={request.status === "rejected"}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!corporateRequests.length ? (
            <div className="rounded-2xl border border-line bg-mist/60 px-4 py-3 text-sm leading-7 text-slate">
              No corporate enrollment requests are currently waiting for review.
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-10">
        <ReportsTable
          rows={reportRows}
          title="LMS performance report"
          courses={portalState.courses}
          courseFilter={reportCourseFilter}
          onCourseFilterChange={setReportCourseFilter}
          statusFilter={reportStatusFilter}
          onStatusFilterChange={setReportStatusFilter}
          companyFilter={reportCompanyFilter}
          onCompanyFilterChange={setReportCompanyFilter}
          companyOptions={portalState.companies.map((company) => ({ id: company.id, name: company.name }))}
        />
      </div>

      <AchievementToast open={toast.open} title={toast.title} description={toast.description} />
    </>
  );
}
