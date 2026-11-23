type SystemAdminDashboardData = {
  statistics: {
    totalUsers: number;
    totalUniversities: number;
    totalDepartments: number;
    totalOrganizations: number;
    totalStudents: number;
    totalSupervisors: number;
    totalPlacements: number;
    activePlacements: number;
    pendingPlacements: number;
    totalLogbooks: number;
    submittedLogbooks: number;
    approvedLogbooks: number;
  };

  recentUsers: {
    id: number;
    name: string;
    email: string;
    roles: {
      id: number;
      name: string;
      slug: string;
    }[];
  }[];

  recentPlacements: {
    id: number;
    start_date: string;
    end_date: string;
    status: string;
    student: {
      user: {
        name: string;
      } | null;
    } | null;
    organization: {
      name: string;
    } | null;
    supervisor: {
      user: {
        name: string;
      } | null;
    } | null;
  }[];

  recentLogbooks: {
    id: number;
    log_date: string;
    activities: string;
    hours_worked: number | string;
    status: string;
    placement: {
      student: {
        user: {
          name: string;
        } | null;
      } | null;
      organization: {
        name: string;
      } | null;
    } | null;
  }[];
};

type SystemAdminDashboardProps = {
  name: string;
  dashboardData: SystemAdminDashboardData;
};

export function SystemAdminDashboard({ name, dashboardData }: SystemAdminDashboardProps) {
  const { statistics, recentUsers, recentPlacements, recentLogbooks } = dashboardData;

  const statCards = [
    {
      title: "Total Users",
      value: statistics.totalUsers,
      description: "Registered system users",
    },
    {
      title: "Universities",
      value: statistics.totalUniversities,
      description: "Registered institutions",
    },
    {
      title: "Organizations",
      value: statistics.totalOrganizations,
      description: "Placement organizations",
    },
    {
      title: "Students",
      value: statistics.totalStudents,
      description: "Registered students",
    },
    {
      title: "Supervisors",
      value: statistics.totalSupervisors,
      description: "Registered supervisors",
    },
    {
      title: "Total Placements",
      value: statistics.totalPlacements,
      description: "All student placements",
    },
    {
      title: "Active Placements",
      value: statistics.activePlacements,
      description: "Currently active",
    },
    {
      title: "Pending Placements",
      value: statistics.pendingPlacements,
      description: "Awaiting approval",
    },
    {
      title: "Total Logbooks",
      value: statistics.totalLogbooks,
      description: "All submitted records",
    },
    {
      title: "Submitted Logbooks",
      value: statistics.submittedLogbooks,
      description: "Awaiting review",
    },
    {
      title: "Approved Logbooks",
      value: statistics.approvedLogbooks,
      description: "Successfully approved",
    },
    {
      title: "Departments",
      value: statistics.totalDepartments,
      description: "Across all universities",
    },
  ];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-UG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const statusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "approved":
        return "bg-green-100 text-green-700";

      case "pending":
      case "submitted":
        return "bg-yellow-100 text-yellow-700";

      case "rejected":
      case "draft":
      case "inactive":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <p className="text-sm text-muted-foreground">System Administration</p>

        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {name}</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Monitor and manage the overall Farmers Attachment Management System.
        </p>
      </div>

      {/* Statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">System Overview</h2>
          <p className="text-sm text-muted-foreground">Current system statistics</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div key={card.title} className="rounded-xl border bg-card p-5 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">{card.title}</p>

              <p className="mt-2 text-2xl font-bold">{card.value.toLocaleString()}</p>

              <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent users */}
      <section className="rounded-xl border bg-card">
        <div className="border-b p-5">
          <h2 className="font-semibold">Recently Registered Users</h2>
          <p className="text-sm text-muted-foreground">
            The latest five users registered in the system
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
              </tr>
            </thead>

            <tbody>
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-4 font-medium">{user.name}</td>

                    <td className="p-4 text-muted-foreground">{user.email}</td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <span
                            key={role.id}
                            className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                          >
                            {role.name}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-muted-foreground">
                    No registered users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent placements */}
      <section className="rounded-xl border bg-card">
        <div className="border-b p-5">
          <h2 className="font-semibold">Recent Placements</h2>
          <p className="text-sm text-muted-foreground">
            Latest student placements across the system
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-4 font-medium">Student</th>
                <th className="p-4 font-medium">Organization</th>
                <th className="p-4 font-medium">Supervisor</th>
                <th className="p-4 font-medium">Start Date</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {recentPlacements.length > 0 ? (
                recentPlacements.map((placement) => (
                  <tr key={placement.id} className="border-t">
                    <td className="p-4 font-medium">{placement.student?.user?.name ?? "N/A"}</td>

                    <td className="p-4">{placement.organization?.name ?? "N/A"}</td>

                    <td className="p-4">{placement.supervisor?.user?.name ?? "Not assigned"}</td>

                    <td className="p-4">{formatDate(placement.start_date)}</td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusClass(
                          placement.status,
                        )}`}
                      >
                        {placement.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted-foreground">
                    No placements found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent logbooks */}
      <section className="rounded-xl border bg-card">
        <div className="border-b p-5">
          <h2 className="font-semibold">Recent Logbook Submissions</h2>
          <p className="text-sm text-muted-foreground">
            Latest logbook activities recorded by students
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-4 font-medium">Student</th>
                <th className="p-4 font-medium">Organization</th>
                <th className="p-4 font-medium">Activity</th>
                <th className="p-4 font-medium">Hours</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {recentLogbooks.length > 0 ? (
                recentLogbooks.map((logbook) => (
                  <tr key={logbook.id} className="border-t">
                    <td className="p-4 font-medium">
                      {logbook.placement?.student?.user?.name ?? "N/A"}
                    </td>

                    <td className="p-4">{logbook.placement?.organization?.name ?? "N/A"}</td>

                    <td className="max-w-xs truncate p-4">{logbook.activities}</td>

                    <td className="p-4">{logbook.hours_worked}</td>

                    <td className="p-4">{formatDate(logbook.log_date)}</td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusClass(
                          logbook.status,
                        )}`}
                      >
                        {logbook.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted-foreground">
                    No logbook records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export type { SystemAdminDashboardData };
