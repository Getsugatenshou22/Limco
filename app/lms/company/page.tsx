import { CompanyDashboardPanel } from "@/components/lms/CompanyDashboardPanel";
import { LmsShell } from "@/components/lms/LmsShell";

export default function CompanyDashboardPage() {
  return (
    <LmsShell
      role="company_admin"
      title="Manage corporate learning at scale"
      description="Coordinate learners, request team enrollments, and track invoice-based approvals from one company workspace."
    >
      <CompanyDashboardPanel />
    </LmsShell>
  );
}
