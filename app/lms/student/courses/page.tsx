import { LmsShell } from "@/components/lms/LmsShell";
import { StudentCoursesPanel } from "@/components/lms/StudentCoursesPanel";

export default function StudentCoursesPage() {
  return (
    <LmsShell
      role="student"
      title="My Courses"
      description="Browse your enrolled courses, review learning progress, and jump back into the next lesson."
    >
      <StudentCoursesPanel />
    </LmsShell>
  );
}
