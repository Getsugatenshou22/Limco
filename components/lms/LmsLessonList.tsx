import { FileText, PlayCircle, ScrollText } from "lucide-react";
import { CourseProgress, Lesson, LessonType } from "@/lib/lms-data";

const lessonTypeIcons: Record<LessonType, typeof PlayCircle> = {
  video: PlayCircle,
  pdf: FileText,
  text: ScrollText,
};

type LmsLessonListProps = {
  lessons: Lesson[];
  progress?: CourseProgress;
};

export function LmsLessonList({ lessons, progress }: LmsLessonListProps) {
  return (
    <div className="grid gap-4">
      {lessons.map((lesson) => {
        const Icon = lessonTypeIcons[lesson.type];
        const complete = progress?.completedLessons.includes(lesson.id) ?? false;

        return (
          <article
            key={lesson.id}
            className={`rounded-2xl border p-5 transition-all duration-300 ease-out ${
              complete ? "border-navy/15 bg-navy/[0.03]" : "border-line bg-white"
            }`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gold/15 text-navy">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-navy">{lesson.title}</h3>
                    <p className="text-sm leading-7 text-slate">{lesson.summary}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-mist px-3 py-1 font-semibold uppercase tracking-[0.16em] text-slate">
                  {lesson.type}
                </span>
                <span className="rounded-full bg-white px-3 py-1 font-semibold text-navy shadow-sm">
                  {lesson.duration}
                </span>
                {complete ? (
                  <span className="rounded-full bg-navy px-3 py-1 font-semibold text-white">Completed</span>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
