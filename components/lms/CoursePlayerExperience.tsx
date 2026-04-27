"use client";

import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { Course, Lesson, getLessonCount } from "@/lib/lms-data";
import { AchievementToast } from "@/components/lms/AchievementToast";
import { CourseSidebar } from "@/components/lms/CourseSidebar";
import { LessonViewer } from "@/components/lms/LessonViewer";
import { ProgressBar } from "@/components/lms/ProgressBar";
import { useStudentPortal } from "@/components/lms/useLmsPortalState";
import {
  LearnerCourseState,
  buildCompletionMessage,
  createLocalCourseState,
  flattenCourseLessons,
  getFirstIncompleteLesson,
  getModuleByLessonId,
  getNextLesson,
  getPreviousLesson,
  isModuleCompleted,
} from "@/lib/lms-store";

type CoursePlayerExperienceProps = {
  userId: string;
  course: Course;
  initialLessonId?: string | null;
};

function getFirstLesson(course: Course): Lesson {
  return course.modules[0].lessons[0];
}

function getInitialLessonId(course: Course, state: LearnerCourseState, initialLessonId?: string | null) {
  const lessons = flattenCourseLessons(course);

  return (
    lessons.find((lesson) => lesson.id === initialLessonId)?.id ??
    lessons.find((lesson) => lesson.id === state.lastOpenedLessonId)?.id ??
    getFirstIncompleteLesson(course, state.completedLessons)?.id ??
    getFirstLesson(course).id
  );
}

export function CoursePlayerExperience({ userId, course, initialLessonId }: CoursePlayerExperienceProps) {
  const totalLessons = getLessonCount(course);
  const { portalState, completeLesson, setLastOpenedLesson, loading } = useStudentPortal(userId);
  const safePortalState = portalState;
  const initialState = useMemo(
    () => (safePortalState ? createLocalCourseState(userId, course, safePortalState) : createDefaultState(userId, course.id)),
    [userId, course, safePortalState],
  );
  const courseState: LearnerCourseState =
    safePortalState?.courseStates.find((entry) => entry.userId === userId && entry.courseId === course.id) ?? initialState;
  const [activeLessonId, setActiveLessonId] = useState<string>(getInitialLessonId(course, initialState, initialLessonId));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [toast, setToast] = useState<{ title: string; description: string; open: boolean }>({
    title: "",
    description: "",
    open: false,
  });
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeLesson =
    flattenCourseLessons(course).find((lesson) => lesson.id === activeLessonId) ??
    getFirstIncompleteLesson(course, courseState.completedLessons) ??
    getFirstLesson(course);

  const percentage = Math.round((courseState.completedLessons.length / Math.max(totalLessons, 1)) * 100);
  const activeLessonCompleted = courseState.completedLessons.includes(activeLesson.id);
  const nextLesson = getNextLesson(course, activeLesson.id);
  const previousLesson = getPreviousLesson(course, activeLesson.id);
  const continueLesson = getFirstIncompleteLesson(course, courseState.completedLessons);

  useEffect(() => {
    return () => {
      if (transitionTimer.current) {
        clearTimeout(transitionTimer.current);
      }

      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  function showToast(title: string, description: string) {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    setToast({ title, description, open: true });
    toastTimer.current = setTimeout(() => {
      setToast((current) => ({ ...current, open: false }));
    }, 2400);
  }

  function changeLesson(lesson: Lesson) {
    if (transitionTimer.current) {
      clearTimeout(transitionTimer.current);
    }

    setIsTransitioning(true);
    setLastOpenedLesson(course.id, lesson.id);
    transitionTimer.current = setTimeout(() => {
      setActiveLessonId(lesson.id);
      setIsTransitioning(false);
    }, 160);
  }

  const handleLessonChange = useEffectEvent((lesson: Lesson) => {
    changeLesson(lesson);
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" && nextLesson) {
        event.preventDefault();
        handleLessonChange(nextLesson);
      }

      if (event.key === "ArrowLeft" && previousLesson) {
        event.preventDefault();
        handleLessonChange(previousLesson);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextLesson, previousLesson]);

  if (loading || !safePortalState) {
    return <div className="rounded-2xl border border-line bg-white p-6 text-sm leading-7 text-slate shadow-sm">Loading course player...</div>;
  }

  function markActiveLessonComplete() {
    if (courseState.completedLessons.includes(activeLesson.id)) {
      return;
    }

    const completedLessons = [...courseState.completedLessons, activeLesson.id];
    const currentModule = getModuleByLessonId(course, activeLesson.id);
    const moduleCompleted =
      currentModule && isModuleCompleted(course, currentModule.id, completedLessons) ? currentModule.title : undefined;

    void completeLesson(course.id, activeLesson.id);
    showToast("Lesson Completed", `${buildCompletionMessage(activeLesson)} and earned +10 XP.`);

    if (moduleCompleted) {
      showToast("Module Mastered", `${moduleCompleted} is now fully complete.`);
    }

    if (nextLesson) {
      changeLesson(nextLesson);
    }
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-24 z-20">
        <div className="overflow-hidden rounded-2xl border border-line bg-white/95 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Now Learning</p>
              <h2 className="mt-1 font-sans text-2xl font-semibold tracking-tight text-navy">{course.title}</h2>
              <p className="mt-1 text-sm leading-7 text-slate">
                {percentage}% complete • {courseState.xpEarned} XP earned
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {continueLesson ? (
                <button type="button" onClick={() => changeLesson(continueLesson)} className="btn-secondary-dark">
                  Continue Learning
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <ProgressBar completedLessons={courseState.completedLessons.length} totalLessons={totalLessons} percentage={percentage} />

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <CourseSidebar
          course={course}
          activeLessonId={activeLesson.id}
          completedLessonIds={courseState.completedLessons}
          onSelectLesson={changeLesson}
        />

        <LessonViewer
          lesson={activeLesson}
          isCompleted={activeLessonCompleted}
          onMarkComplete={markActiveLessonComplete}
          onNextLesson={() => nextLesson && changeLesson(nextLesson)}
          onPreviousLesson={() => previousLesson && changeLesson(previousLesson)}
          hasNextLesson={Boolean(nextLesson)}
          hasPreviousLesson={Boolean(previousLesson)}
          isTransitioning={isTransitioning}
        />
      </div>

      <AchievementToast open={toast.open} title={toast.title} description={toast.description} />
    </div>
  );
}

function createDefaultState(userId: string, courseId: string) {
  return {
    userId,
    courseId,
    progressPercentage: 0,
    completedLessons: [],
    lastOpenedLessonId: null,
    xpEarned: 0,
    completionTimestamps: {},
    recentActivity: [],
  };
}
