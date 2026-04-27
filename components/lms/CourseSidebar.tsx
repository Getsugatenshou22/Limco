"use client";

import { CheckCircle2, CirclePlay, FileText, ScrollText } from "lucide-react";
import { Course, Lesson, LessonType } from "@/lib/lms-data";

const lessonTypeIcons: Record<LessonType, typeof CirclePlay> = {
  video: CirclePlay,
  pdf: FileText,
  text: ScrollText,
};

type CourseSidebarProps = {
  course: Course;
  activeLessonId: string;
  completedLessonIds: string[];
  onSelectLesson: (lesson: Lesson) => void;
};

export function CourseSidebar({
  course,
  activeLessonId,
  completedLessonIds,
  onSelectLesson,
}: CourseSidebarProps) {
  return (
    <aside className="premium-panel h-fit p-4 sm:p-5">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Course Content</p>
        <p className="mt-2 text-sm leading-7 text-slate">
          Navigate modules, switch lessons, and keep track of what has already been completed.
        </p>
      </div>

      <div className="space-y-5">
        {course.modules.map((module, moduleIndex) => (
          <section key={module.id} className="space-y-3">
            <div className="rounded-2xl border border-line bg-mist/60 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                Module {String(moduleIndex + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-1 font-semibold text-navy">{module.title}</h2>
            </div>

            <div className="space-y-2">
              {module.lessons.map((lesson, lessonIndex) => {
                const Icon = lessonTypeIcons[lesson.type];
                const isActive = activeLessonId === lesson.id;
                const isComplete = completedLessonIds.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => onSelectLesson(lesson)}
                    className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-300 ease-out ${
                      isActive
                        ? "border-navy bg-navy text-white shadow-lg"
                        : "border-line bg-white hover:-translate-y-0.5 hover:border-navy/20 hover:shadow-sm"
                    }`}
                  >
                    <span
                      className={`mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                        isActive ? "bg-white/12 text-white" : "bg-gold/15 text-navy"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className={`text-xs font-semibold uppercase tracking-[0.16em] ${isActive ? "text-white/68" : "text-slate"}`}>
                          Lesson {String(lessonIndex + 1).padStart(2, "0")}
                        </span>
                        {isComplete ? (
                          <CheckCircle2 className={`h-4 w-4 ${isActive ? "text-gold" : "text-navy"}`} />
                        ) : null}
                      </span>
                      <span className="mt-1 block font-semibold">{lesson.title}</span>
                      <span className={`mt-1 block text-sm ${isActive ? "text-white/78" : "text-slate"}`}>
                        {lesson.duration} • {lesson.type.toUpperCase()}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
