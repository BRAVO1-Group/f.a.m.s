import { usePage } from "@inertiajs/react";
import { useAppUser } from "@/lib/app-user";

import {
  StudentDashboard,
  SupervisorDashboard,
  type StudentDashboardData,
  type SupervisorDashboardData,
} from "@/components/dashboard/supervisor-dashboard";

import {
  OrgAdminDashboard,
  type OrgAdminDashboardData,
} from "@/components/dashboard/org-admin-dashboard";

import {
  UniversityAdminDashboard,
  type UniversityAdminDashboardData,
} from "@/components/dashboard/university-admin-dashboard";

import {
  SystemAdminDashboard,
  type SystemAdminDashboardData,
} from "@/components/dashboard/system-admin-dashboard";

type DashboardPageProps = {
  dashboardData:
    | StudentDashboardData
    | SupervisorDashboardData
    | OrgAdminDashboardData
    | UniversityAdminDashboardData
    | SystemAdminDashboardData;
};

export default function DashboardPage() {
  const { userId, role, name } = useAppUser();

  const { props } = usePage<DashboardPageProps>();

  return (
    <div className="space-y-6">
      {role === "org_admin" && (
        <OrgAdminDashboard
          userId={userId}
          name={name}
          dashboardData={props.dashboardData as OrgAdminDashboardData}
        />
      )}

      {role === "system_admin" && (
        <SystemAdminDashboard
          name={name}
          dashboardData={props.dashboardData as SystemAdminDashboardData}
        />
      )}
      {role === "uni_admin" && (
        <UniversityAdminDashboard
          userId={userId}
          name={name}
          role={role}
          dashboardData={props.dashboardData as UniversityAdminDashboardData}
        />
      )}

      {role === "student" && (
        <StudentDashboard name={name} dashboardData={props.dashboardData as StudentDashboardData} />
      )}

      {role === "supervisor" && (
        <SupervisorDashboard
          name={name}
          dashboardData={props.dashboardData as SupervisorDashboardData}
        />
      )}
    </div>
  );
}
