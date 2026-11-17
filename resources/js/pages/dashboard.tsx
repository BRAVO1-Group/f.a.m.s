import { useAppUser } from "@/lib/app-user";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { SupervisorDashboard } from "@/components/dashboard/supervisor-dashboard";
import { OrgAdminDashboard } from "@/components/dashboard/org-admin-dashboard";
import { UniversityAdminDashboard } from "@/components/dashboard/university-admin-dashboard";

export default function DashboardPage() {
  const { userId, role, name } = useAppUser();
  return (
    <div className="space-y-6">
      {role === "student" && <StudentDashboard userId={userId} name={name} />}
      {role === "supervisor" && <SupervisorDashboard userId={userId} name={name} />}
      {role === "org_admin" && <OrgAdminDashboard userId={userId} name={name} />}
      {role !== "student" && role !== "supervisor" && role !== "org_admin" && (
        <UniversityAdminDashboard userId={userId} name={name} role={role} />
      )}
    </div>
  );
}
