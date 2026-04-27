import { LmsShell } from "@/components/lms/LmsShell";
import { AdminManagementPanel } from "@/components/lms/AdminManagementPanel";

export default function LmsAdminPage() {
  return (
    <LmsShell
      role="admin"
      title="LMS Management Panel"
      description="Monitor course delivery, student activity, and LMS progress data from one modular admin workspace."
    >
      <AdminManagementPanel />
    </LmsShell>
  );
}
