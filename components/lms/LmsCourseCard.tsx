import Link from "next/link";
import { Clock3, Layers3, PlayCircle } from "lucide-react";
import { Course, getLessonCount } from "@/lib/lms-data";
import { EnrollmentStatus } from "@/lib/lms-store";

type LmsCourseCardProps = {
  course: Course;
  progressPercentage?: number;
  status: EnrollmentStatus | "completed" | "in_progress";
  href: string;
  ctaLabel: string;
};

export function LmsCourseCard({ course, progressPercentage = 0, status, href, ctaLabel }: LmsCourseCardProps) {
  const lessonCount = getLessonCount(course);
  const statusLabel =
    status === "approved"
      ? "Approved"
      : status === "pending_payment"
        ? "Pending Payment"
        : status === "rejected"
          ? "Rejected"
          : status === "completed"
            ? "Completed"
            : status === "in_progress"
              ? "In Progress"
              : "Not Enrolled";

  return (
    <article className="interactive-card rounded-2xl border border-line bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-navy">
          {course.category}
        </span>
        <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate">
          {course.level}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
            status === "completed"
              ? "bg-navy text-white"
              : status === "in_progress" || status === "approved"
                ? "bg-navy/10 text-navy"
                : status === "pending_payment"
                  ? "bg-gold/15 text-navy"
                  : status === "rejected"
                    ? "bg-red-50 text-red-700"
                : "bg-mist text-slate"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      <h2 className="mt-5 font-sans text-2xl font-semibold tracking-tight text-navy">{course.title}</h2>
      <p className="mt-4 text-sm leading-7 text-slate">{course.description}</p>

      <div className="mt-6 grid gap-3 text-sm text-slate sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <Layers3 className="h-4 w-4 text-navy" />
          <span>{course.modules.length} modules</span>
        </div>
        <div className="flex items-center gap-2">
          <PlayCircle className="h-4 w-4 text-navy" />
          <span>{lessonCount} lessons</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-navy" />
          <span>{progressPercentage > 0 ? `${progressPercentage}% complete` : `R ${course.price.toLocaleString("en-ZA")}`}</span>
        </div>
      </div>

      <div className="mt-6 h-2 rounded-full bg-mist">
        <div
          className="h-full rounded-full bg-navy transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-sm leading-7 text-slate">
          {status === "completed"
            ? "All lessons completed."
            : status === "in_progress" || status === "approved"
              ? "Pick up from your last opened lesson."
              : status === "pending_payment"
                ? "Your EFT proof of payment is currently under review."
                : status === "rejected"
                  ? "Payment was not approved. Please upload an updated proof of payment."
              : "Start the first lesson when you are ready."}
        </p>
        <Link
          href={href}
          className="btn-secondary-dark"
        >
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}
