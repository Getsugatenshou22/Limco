import { LmsShell } from "@/components/lms/LmsShell";
import { StudentDashboardPanel } from "@/components/lms/StudentDashboardPanel";

export default function StudentDashboardPage() {
  return (
    <LmsShell
      role="student"
      title="Welcome back"
      description="Access your courses, track your learning progress, and continue building workforce-ready skills."
    >
      <StudentDashboardPanel />
    </LmsShell>
  );
}
