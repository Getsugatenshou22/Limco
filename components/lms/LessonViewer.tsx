"use client";

import { CheckCheck, ChevronLeft, ChevronRight, Download, ExternalLink, FileText, PlayCircle, ScrollText } from "lucide-react";
import { Lesson } from "@/lib/lms-data";

type LessonViewerProps = {
  lesson: Lesson;
  isCompleted: boolean;
  onMarkComplete: () => void;
  onNextLesson: () => void;
  onPreviousLesson: () => void;
  hasNextLesson: boolean;
  hasPreviousLesson: boolean;
  isTransitioning: boolean;
};

function TextLessonBody({ lesson }: { lesson: Lesson }) {
  return (
    <div className="space-y-5 text-slate">
      <div className="rounded-2xl border border-line bg-mist/60 p-5">
        <h3 className="font-sans text-2xl font-semibold tracking-tight text-navy">Lesson Overview</h3>
        <p className="mt-3 text-sm leading-7">{lesson.summary}</p>
      </div>

      <div className="rounded-2xl border border-line bg-white p-6">
        <h4 className="font-semibold text-navy">Key Learning Focus</h4>
        <p className="mt-3 text-sm leading-7">
          This lesson develops practical understanding around <span className="font-semibold text-navy">{lesson.title.toLowerCase()}</span>,
          helping the learner connect concepts to real workplace delivery.
        </p>

        <div className="mt-5 grid gap-3">
          <div className="rounded-xl bg-mist/70 px-4 py-3 text-sm leading-7">
            Build confidence with structured concepts and guided examples.
          </div>
          <div className="rounded-xl bg-mist/70 px-4 py-3 text-sm leading-7">
            Translate lesson ideas into practical tasks, communication, and execution habits.
          </div>
          <div className="rounded-xl bg-mist/70 px-4 py-3 text-sm leading-7">
            Review the linked resource for additional reading and reference material.
          </div>
        </div>
      </div>
    </div>
  );
}

function getVideoSource(contentUrl: string) {
  return contentUrl.includes("example.com")
    ? "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
    : contentUrl;
}

function getPdfSource(contentUrl: string) {
  return contentUrl.includes("example.com")
    ? "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    : contentUrl;
}

export function LessonViewer({
  lesson,
  isCompleted,
  onMarkComplete,
  onNextLesson,
  onPreviousLesson,
  hasNextLesson,
  hasPreviousLesson,
  isTransitioning,
}: LessonViewerProps) {
  const videoSource = getVideoSource(lesson.contentUrl);
  const pdfSource = getPdfSource(lesson.contentUrl);

  return (
    <div className="space-y-6">
      <article className="premium-panel overflow-hidden p-0">
        <div className="border-b border-line px-6 py-5 sm:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-navy">
                  {lesson.type}
                </span>
                <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate">
                  {lesson.duration}
                </span>
                {isCompleted ? (
                  <span className="rounded-full bg-navy px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                    Completed
                  </span>
                ) : null}
              </div>
              <h2 className="font-sans text-3xl font-semibold tracking-tight text-navy">{lesson.title}</h2>
              <p className="max-w-3xl text-sm leading-7 text-slate">{lesson.summary}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={onMarkComplete} className={isCompleted ? "btn-primary" : "btn-secondary-dark"}>
                {isCompleted ? "Completed" : "Mark as Complete"}
                {isCompleted ? <CheckCheck className="ml-2 h-4 w-4" /> : null}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <div
            key={lesson.id}
            className="space-y-5"
          >
            {isTransitioning ? (
              <div className="space-y-4">
                <div className="h-8 w-40 animate-pulse rounded-xl bg-mist" />
                <div className="aspect-video animate-pulse rounded-2xl bg-mist" />
                <div className="h-24 animate-pulse rounded-2xl bg-mist" />
              </div>
            ) : null}

            {!isTransitioning && lesson.type === "video" ? (
              <div className="space-y-4">
                <div className="aspect-video overflow-hidden rounded-2xl border border-line bg-navy">
                  <video
                    key={lesson.id}
                    controls
                    preload="metadata"
                    onEnded={onMarkComplete}
                    title={lesson.title}
                    className="h-full w-full"
                  >
                    <source src={videoSource} />
                  </video>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a href={videoSource} target="_blank" rel="noreferrer" className="btn-secondary-dark">
                    Open Video Link
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            ) : null}

            {!isTransitioning && lesson.type === "pdf" ? (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-line bg-white">
                  <iframe
                    src={pdfSource}
                    title={lesson.title}
                    className="h-[520px] w-full"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <a href={pdfSource} target="_blank" rel="noreferrer" className="btn-secondary-dark">
                    Download PDF
                    <Download className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            ) : null}

            {!isTransitioning && lesson.type === "text" ? <TextLessonBody lesson={lesson} /> : null}
          </div>
        </div>
      </article>

      {isCompleted ? (
        <article className="rounded-2xl border border-navy/10 bg-navy/[0.03] p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-navy text-white">
              <CheckCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-navy">Lesson completed successfully</p>
              <p className="mt-1 text-sm leading-7 text-slate">
                Great work. Your progress has been updated and you can continue to the next lesson.
              </p>
            </div>
          </div>
        </article>
      ) : null}

      <article className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-navy">Lesson navigation</p>
            <p className="mt-1 text-sm leading-7 text-slate">Use the buttons below or your arrow keys to move through lessons.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onPreviousLesson}
              disabled={!hasPreviousLesson}
              className="btn-secondary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous Lesson
            </button>
            <button
              type="button"
              onClick={onNextLesson}
              disabled={!hasNextLesson}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next Lesson
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gold/15 text-navy">
            {lesson.type === "video" ? <PlayCircle className="h-5 w-5" /> : null}
            {lesson.type === "pdf" ? <FileText className="h-5 w-5" /> : null}
            {lesson.type === "text" ? <ScrollText className="h-5 w-5" /> : null}
          </span>
          <div>
            <p className="font-semibold text-navy">Lesson resource</p>
            <p className="text-sm leading-7 text-slate">{lesson.contentUrl}</p>
          </div>
        </div>
      </article>
    </div>
  );
}
