"use client";

import Link from "next/link";
import { BookOpen, ChartNoAxesCombined, CircleCheckBig, Sparkles } from "lucide-react";
import { CertificateGenerator } from "@/components/lms/CertificateGenerator";
import { LmsStatCard } from "@/components/lms/LmsStatCard";
import { useStudentPortal } from "@/components/lms/useLmsPortalState";
import { useLmsSession } from "@/components/lms/useLmsSession";
import { getFirstIncompleteLesson, getLearnerOverview } from "@/lib/lms-store";

export function StudentDashboardPanel() {
  const { session } = useLmsSession();
  const { portalState, loading } = useStudentPortal(session?.userId ?? "");

  if (loading || !portalState || !session) {
    return <div className="rounded-2xl border border-line bg-white p-6 text-sm leading-7 text-slate shadow-sm">Loading learner dashboard...</div>;
  }

  const overview = getLearnerOverview(session.userId, portalState);
  const activeCourses = overview.approvedCourseIds;
  const enrolledCourses = portalState.courseStates.filter((entry) => entry.userId === session.userId);
  const completedCourses = enrolledCourses.filter((entry) => entry.progressPercentage === 100).length;
  const averageProgress = enrolledCourses.length
    ? Math.round(enrolledCourses.reduce((sum, entry) => sum + entry.progressPercentage, 0) / enrolledCourses.length)
    : 0;

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-4">
        <LmsStatCard
          label="Courses Enrolled"
          value={String(activeCourses.length).padStart(2, "0")}
          detail="Approved courses currently active in your learning plan."
          icon={<BookOpen className="h-5 w-5" />}
        />
        <LmsStatCard
          label="Average Progress"
          value={`${averageProgress}%`}
          detail="Overall completion progress across approved learning paths."
          icon={<ChartNoAxesCombined className="h-5 w-5" />}
        />
        <LmsStatCard
          label="Completed"
          value={String(completedCourses).padStart(2, "0")}
          detail="Courses fully completed and ready for review or certification."
          icon={<CircleCheckBig className="h-5 w-5" />}
        />
        <LmsStatCard
          label="XP Earned"
          value={`${overview.xpEarned} XP`}
          detail="Experience points earned from completed LMS lessons."
          icon={<Sparkles className="h-5 w-5" />}
        />
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="premium-panel p-8">
          <span className="eyebrow">Continue Learning</span>
          {overview.continueCourse ? (
            <div className="mt-5 space-y-4">
              <div>
                <h2 className="font-sans text-3xl font-semibold tracking-tight text-navy">{overview.continueCourse.course.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate">
                  Continue with{" "}
                  <span className="font-semibold text-navy">
                    {getFirstIncompleteLesson(
                      overview.continueCourse.course,
                      overview.continueCourse.state?.completedLessons ?? [],
                    )?.title ?? "your next lesson"}
                  </span>{" "}
                  and keep your progress moving forward.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/lms/student/courses/${overview.continueCourse.course.id}${overview.continueCourse.state?.lastOpenedLessonId ? `?lesson=${overview.continueCourse.state.lastOpenedLessonId}` : ""}`}
                  className="btn-primary"
                >
                  Resume Learning
                </Link>
                <Link href="/lms/student/courses" className="btn-secondary-dark">
                  View All Courses
                </Link>
              </div>
            </div>
          ) : (
            <p className="mt-5 text-sm leading-7 text-slate">
              You do not have an approved course in progress yet. Browse the course library and submit EFT proof to enroll.
            </p>
          )}
        </article>

        <article className="premium-panel p-8">
          <span className="eyebrow">Recent Activity</span>
          <div className="mt-5 space-y-3">
            {overview.recentActivity.slice(0, 5).map((item) => (
              <div key={item.id} className="rounded-2xl border border-line bg-mist/60 px-4 py-3">
                <p className="font-semibold text-navy">{item.message}</p>
                <p className="mt-1 text-sm leading-7 text-slate">
                  {new Date(item.timestamp).toLocaleDateString("en-ZA", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))}
            {!overview.recentActivity.length ? (
              <div className="rounded-2xl border border-line bg-mist/60 px-4 py-3 text-sm leading-7 text-slate">
                No recent activity yet. Your progress updates will appear here once lessons are completed.
              </div>
            ) : null}
          </div>
        </article>
      </div>

      <div className="mt-10">
        <div className="mb-6">
          <span className="eyebrow">My Certificates</span>
          <h2 className="mt-4 font-sans text-3xl font-semibold tracking-tight text-navy">Certificates you have earned</h2>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          {overview.certificates.map((certificate) => (
            <CertificateGenerator key={certificate.id} certificate={certificate} />
          ))}
          {!overview.certificates.length ? (
            <div className="rounded-2xl border border-line bg-white p-6 text-sm leading-7 text-slate shadow-sm">
              Complete a course to unlock your certificate of completion.
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
