"use client";

import { useEffect, useRef, useState } from "react";
import { Course } from "@/lib/lms-data";
import { AchievementToast } from "@/components/lms/AchievementToast";
import { CoursePlayerExperience } from "@/components/lms/CoursePlayerExperience";
import { EnrollmentPanel } from "@/components/lms/EnrollmentPanel";
import { useStudentPortal } from "@/components/lms/useLmsPortalState";
import { useLmsSession } from "@/components/lms/useLmsSession";
import { getEnrollmentRecord, getPaymentProof } from "@/lib/lms-store";

type CourseAccessExperienceProps = {
  course: Course;
  initialLessonId?: string | null;
};

export function CourseAccessExperience({ course, initialLessonId }: CourseAccessExperienceProps) {
  const { session } = useLmsSession();
  const { portalState, submitPaymentProof, loading } = useStudentPortal(session?.userId ?? "");
  const [toast, setToast] = useState<{ open: boolean; title: string; description: string }>({
    open: false,
    title: "",
    description: "",
  });
  const enrollment = portalState && session ? getEnrollmentRecord(portalState, session.userId, course.id) : null;
  const proof = portalState && session ? getPaymentProof(portalState, session.userId, course.id) : null;
  const approved = enrollment?.status === "approved";
  const previousStatus = useRef(enrollment?.status);

  useEffect(() => {
    if (previousStatus.current !== "approved" && enrollment?.status === "approved") {
      setToast({
        open: true,
        title: "Payment approved",
        description: "Your enrollment has been approved and the course is now unlocked.",
      });
      window.setTimeout(() => setToast((current) => ({ ...current, open: false })), 2200);
    }

    previousStatus.current = enrollment?.status;
  }, [enrollment?.status]);

  return (
    <>
      {loading || !portalState || !session ? (
        <div className="rounded-2xl border border-line bg-white p-6 text-sm leading-7 text-slate shadow-sm">Loading course access...</div>
      ) : null}
      {approved ? (
        <CoursePlayerExperience
          key={`${course.id}-${initialLessonId ?? "auto"}`}
          userId={session?.userId ?? ""}
          course={course}
          initialLessonId={initialLessonId}
        />
      ) : portalState && session ? (
        <EnrollmentPanel
          userId={session.userId}
          course={course}
          status={enrollment?.status ?? "not_enrolled"}
          proof={proof ?? undefined}
          onSubmitProof={(file) => {
            submitPaymentProof(course.id, file);
            setToast({
              open: true,
              title: "Payment submitted successfully",
              description: "Your proof of payment has been submitted for admin review.",
            });
            window.setTimeout(() => setToast((current) => ({ ...current, open: false })), 2200);
          }}
        />
      ) : null}

      <AchievementToast open={toast.open} title={toast.title} description={toast.description} />
    </>
  );
}
