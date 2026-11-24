import {
  Building2,
  GraduationCap,
  Users,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  CheckCircle2,
  Clock,
  School,
} from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type UniversityAdmin = {
  id: number;
  name: string;
  email: string;
  roles: {
    id: number;
    name: string;
    slug: string;
  }[];
};

export type UniversityStudent = {
  id: number;
  student_number: string;
  year_of_study: number;
  status: string;
  user: {
    name: string;
    email: string;
  } | null;
  program: {
    name: string;
    department: {
      name: string;
    } | null;
  } | null;
};

export type UniversityPlacement = {
  id: number;
  start_date: string;
  end_date: string;
  status: string;
  student: UniversityStudent | null;
  organization: {
    name: string;
  } | null;
  supervisor: {
    user: {
      name: string;
    } | null;
  } | null;
};

export type UniversityAdminDashboardData = {
  university: {
    id: number;
    name: string;
    code: string;
  } | null;

  admins: UniversityAdmin[];

  departments: {
    id: number;
    name: string;
    programs: {
      id: number;
      name: string;
    }[];
  }[];

  students: UniversityStudent[];

  placements: UniversityPlacement[];

  statistics: {
    totalDepartments: number;
    totalPrograms: number;
    totalStudents: number;
    totalPlacements: number;
    activePlacements: number;
    pendingPlacements: number;
    totalLogbooks: number;
    submittedLogbooks: number;
    approvedLogbooks: number;
    attendanceShifts: number;
    totalMilestones: number;
    completedMilestones: number;
  };

  recentPlacements: UniversityPlacement[];
};

type Props = {
  userId: string;
  name: string;
  role: string;
  dashboardData: UniversityAdminDashboardData;
};

function StatusBadge({ status }: { status: string }) {
  const normalized = status?.toLowerCase();

  const styles: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    approved: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    submitted: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-700",
    draft: "bg-gray-100 text-gray-700",
  };

  return (
    <Badge className={styles[normalized] ?? "bg-gray-100 text-gray-700"}>
      {status || "Unknown"}
    </Badge>
  );
}

export function UniversityAdminDashboard({ userId, name, role, dashboardData }: Props) {
  void userId;
  void role;

  const { university, admins, departments, students, placements, statistics, recentPlacements } =
    dashboardData;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">University Administration</p>

          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {name}</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage students, academic departments and industrial placements across{" "}
            {university?.name ?? "your university"}.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border px-4 py-3">
          <Building2 className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">{university?.name ?? "University"}</p>
            <p className="text-xs text-muted-foreground">
              {university?.code ?? "University account"}
            </p>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          label="Departments"
          value={statistics.totalDepartments}
          meta="Registered departments"
        />

        <KpiCard
          label="Academic Programs"
          value={statistics.totalPrograms}
          meta="Available programs"
        />

        <KpiCard label="Students" value={statistics.totalStudents} meta="Registered students" />

        <KpiCard
          label="Placements"
          value={statistics.totalPlacements}
          meta={`${statistics.activePlacements} active`}
        />

        <KpiCard
          label="Attendance Shifts"
          value={statistics.attendanceShifts}
          meta="Recorded by assigned students"
        />

        <KpiCard
          label="Milestones Completed"
          value={statistics.completedMilestones}
          unit={`of ${statistics.totalMilestones}`}
          meta="Student roadmap progress"
        />
      </div>

      {/* PLACEMENT AND LOGBOOK OVERVIEW */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="rounded-lg bg-green-100 p-3 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Placements</p>
              <h3 className="text-2xl font-bold">{statistics.activePlacements}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="rounded-lg bg-yellow-100 p-3 text-yellow-700">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Placements</p>
              <h3 className="text-2xl font-bold">{statistics.pendingPlacements}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="rounded-lg bg-blue-100 p-3 text-blue-700">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Submitted Logbooks</p>
              <h3 className="text-2xl font-bold">{statistics.submittedLogbooks}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="rounded-lg bg-purple-100 p-3 text-purple-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved Logbooks</p>
              <h3 className="text-2xl font-bold">{statistics.approvedLogbooks}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DEPARTMENTS */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <School className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Academic Departments</CardTitle>
              <CardDescription>
                Departments and programs registered under your university.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {departments.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No departments have been registered yet.
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {departments.map((department) => (
                <div key={department.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">{department.name}</h3>

                    <Badge variant="secondary">{department.programs.length} Programs</Badge>
                  </div>

                  {department.programs.length > 0 ? (
                    <ul className="mt-3 space-y-2">
                      {department.programs.map((program) => (
                        <li
                          key={program.id}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <GraduationCap className="h-4 w-4" />
                          {program.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">No programs registered.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* UNIVERSITY ADMINS */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>University Administrators</CardTitle>
              <CardDescription>Administrators assigned to this university.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {admins.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No university administrators found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="p-3">Administrator</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                  </tr>
                </thead>

                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id} className="border-b last:border-0">
                      <td className="p-3 font-medium">{admin.name}</td>
                      <td className="p-3 text-muted-foreground">{admin.email}</td>
                      <td className="p-3">
                        {admin.roles.map((adminRole) => (
                          <Badge key={adminRole.id} variant="secondary" className="mr-1">
                            {adminRole.name}
                          </Badge>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* STUDENTS */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Registered Students</CardTitle>
              <CardDescription>
                Students enrolled in programs under this university.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {students.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No students registered yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="p-3">Student</th>
                    <th className="p-3">Student Number</th>
                    <th className="p-3">Program</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Year</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b last:border-0">
                      <td className="p-3">
                        <p className="font-medium">{student.user?.name ?? "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">
                          {student.user?.email ?? "No email"}
                        </p>
                      </td>

                      <td className="p-3">{student.student_number}</td>

                      <td className="p-3">{student.program?.name ?? "Not assigned"}</td>

                      <td className="p-3">{student.program?.department?.name ?? "—"}</td>

                      <td className="p-3">Year {student.year_of_study}</td>

                      <td className="p-3">
                        <StatusBadge status={student.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PLACEMENTS */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>University Placements</CardTitle>
              <CardDescription>
                Industrial placements for students enrolled at this university.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {placements.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No placements have been recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="p-3">Student</th>
                    <th className="p-3">Organization</th>
                    <th className="p-3">Supervisor</th>
                    <th className="p-3">Start Date</th>
                    <th className="p-3">End Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {placements.map((placement) => (
                    <tr key={placement.id} className="border-b last:border-0">
                      <td className="p-3 font-medium">
                        {placement.student?.user?.name ?? "Unknown"}
                      </td>

                      <td className="p-3">{placement.organization?.name ?? "Not assigned"}</td>

                      <td className="p-3">{placement.supervisor?.user?.name ?? "Not assigned"}</td>

                      <td className="p-3 whitespace-nowrap">{placement.start_date}</td>

                      <td className="p-3 whitespace-nowrap">{placement.end_date}</td>

                      <td className="p-3">
                        <StatusBadge status={placement.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* RECENT PLACEMENTS */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Recent Placements</CardTitle>
              <CardDescription>The latest placement records from your university.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {recentPlacements.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No recent placements available.
            </p>
          ) : (
            <div className="space-y-4">
              {recentPlacements.map((placement) => (
                <div
                  key={placement.id}
                  className="flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="font-semibold">
                      {placement.student?.user?.name ?? "Unknown student"}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {placement.organization?.name ?? "No organization assigned"}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {placement.start_date} – {placement.end_date}
                    </p>
                  </div>

                  <StatusBadge status={placement.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
