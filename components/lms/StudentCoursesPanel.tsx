"use client";

import { useStudentPortal } from "@/components/lms/useLmsPortalState";
import { useLmsSession } from "@/components/lms/useLmsSession";
import { LmsCourseCard } from "@/components/lms/LmsCourseCard";
import { getEnrollmentRecord, getPortalCourseState } from "@/lib/lms-store";

export function StudentCoursesPanel() {
  const { session } = useLmsSession();
  const { portalState, loading } = useStudentPortal(session?.userId ?? "");

  if (loading || !portalState || !session) {
    return <div className="rounded-2xl border border-line bg-white p-6 text-sm leading-7 text-slate shadow-sm">Loading course library...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Course Library</p>
          <h2 className="mt-2 font-sans text-3xl font-semibold tracking-tight text-navy">All LMS courses</h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-slate">
          Browse enrolled courses, upload EFT proof for locked courses, and resume approved learning paths.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {portalState.courses.map((course) => {
          const enrollment = getEnrollmentRecord(portalState, session.userId, course.id);
          const courseState = getPortalCourseState(portalState, session.userId, course.id);
          const approved = enrollment?.status === "approved";
          const completed = (courseState?.progressPercentage ?? 0) >= 100;

          return (
            <LmsCourseCard
              key={course.id}
              course={course}
              progressPercentage={courseState?.progressPercentage ?? 0}
              status={
                completed
                  ? "completed"
                  : approved && (courseState?.progressPercentage ?? 0) > 0
                    ? "in_progress"
                    : enrollment?.status ?? "not_enrolled"
              }
              href={`/lms/student/courses/${course.id}${courseState?.lastOpenedLessonId ? `?lesson=${courseState.lastOpenedLessonId}` : ""}`}
              ctaLabel={
                enrollment?.status === "approved"
                  ? "Resume"
                  : enrollment?.status === "pending_payment"
                    ? "View Status"
                    : enrollment?.status === "rejected"
                      ? "Retry Payment"
                      : "Enroll Now"
              }
            />
          );
        })}
      </div>
    </div>
  );
}
