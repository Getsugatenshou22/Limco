import { notFound } from "next/navigation";
import { CourseAccessExperience } from "@/components/lms/CourseAccessExperience";
import { LmsShell } from "@/components/lms/LmsShell";
import { getCourseByIdFromDb } from "@/lib/lms-backend";

type CoursePlayerPageProps = {
  params: Promise<{ courseId: string }>;
  searchParams?: Promise<{ lesson?: string }>;
};

export default async function CoursePlayerPage({ params, searchParams }: CoursePlayerPageProps) {
  const { courseId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const course = await getCourseByIdFromDb(courseId);

  if (!course) {
    notFound();
  }

  return (
    <LmsShell
      role="student"
      title={course.title}
      description={course.description}
    >
      <CourseAccessExperience
        course={course}
        initialLessonId={resolvedSearchParams?.lesson}
      />
    </LmsShell>
  );
}
