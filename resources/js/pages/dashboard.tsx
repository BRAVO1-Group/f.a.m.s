import { useEffect } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { useAppUser } from "@/lib/app-user";
import { setDemoUser, type AppRole } from "@/lib/auth";
import { DEMO_USERS } from "@/lib/mock-data";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { SupervisorDashboard } from "@/components/dashboard/supervisor-dashboard";
import { OrgAdminDashboard } from "@/components/dashboard/org-admin-dashboard";
import { UniversityAdminDashboard } from "@/components/dashboard/university-admin-dashboard";

const routeApi = getRouteApi("/_authenticated/dashboard");

export default function DashboardPage() {
  const { userId, role, name } = useAppUser();
  const search = routeApi.useSearch();

  useEffect(() => {
    if (search.role) {
      const normalized = search.role.toLowerCase().replace("-", "_");
      const match =
        DEMO_USERS.find((u) => u.role === normalized) ||
        DEMO_USERS.find((u) => u.roles?.includes(normalized as AppRole));
      if (match && match.id !== userId) {
        setDemoUser(match.id);
        window.dispatchEvent(new Event("demo-auth-change"));
      }
    } else if (search.user && search.user !== userId) {
      const match = DEMO_USERS.find((u) => u.id === search.user);
      if (match) {
        setDemoUser(match.id);
        window.dispatchEvent(new Event("demo-auth-change"));
      }
    }
  }, [search.role, search.user, userId]);

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
