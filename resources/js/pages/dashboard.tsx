import { usePage } from "@inertiajs/react";
import { useAppUser } from "@/lib/app-user";

import {
  StudentDashboard,
  type StudentDashboardData,
} from "@/components/dashboard/supervisor-dashboard";

import { OrgAdminDashboard } from "@/components/dashboard/org-admin-dashboard";
import { UniversityAdminDashboard } from "@/components/dashboard/university-admin-dashboard";

type DashboardPageProps = {
  dashboardData: StudentDashboardData;
};

export default function DashboardPage() {
  const { userId, role, name } = useAppUser();

  const { props } = usePage<DashboardPageProps>();

  return (
    <div className="space-y-6">
      {role === "student" && <StudentDashboard name={name} dashboardData={props.dashboardData} />}

      {role === "org_admin" && <OrgAdminDashboard userId={userId} name={name} />}

      {(role === "uni_admin" || role === "system_admin") && (
        <UniversityAdminDashboard userId={userId} name={name} role={role} />
      )}
    </div>
  );
}
