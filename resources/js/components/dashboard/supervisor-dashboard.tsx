import { useMemo } from "react";
import { Link } from "@inertiajs/react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { BarChart3, BookOpen } from "lucide-react";
import { getGreeting } from "./get-greeting";
import { StudentPlacementJourney } from "./student-placement-journey";
import { AuditTrailPanel } from "./audit-trail-panel";

// --------------------------------------------------
// TYPES RECEIVED FROM LARAVEL
// --------------------------------------------------

export type StudentLogbook = {
  id: number;
  log_date: string;
  activities: string;
  skills_learned: string | null;
  challenges: string | null;
  hours_worked: number | string;
  status: string;
};

export type StudentPlacement = {
  id: number;
  start_date: string;
  end_date: string;
  status: string;
  description: string | null;

  organization: {
    name: string;
  } | null;

  supervisor: {
    job_title: string | null;
    department: string | null;

    user: {
      name: string;
      email: string;
    } | null;
  } | null;

  logbooks: StudentLogbook[];
};

export type StudentDashboardData = {
  activePlacement: StudentPlacement | null;

  placements: StudentPlacement[];

  statistics: {
    totalPlacements: number;
    activePlacements: number;
    totalLogbooks: number;
    submittedLogbooks: number;
    approvedLogbooks: number;
    totalHours: number | string;
    loggedDays: number;
  };

  recentLogbooks: StudentLogbook[];
};

// --------------------------------------------------
// STUDENT DASHBOARD
// --------------------------------------------------

type StudentDashboardProps = {
  name: string;
  dashboardData: StudentDashboardData;
};

export function StudentDashboard({ name, dashboardData }: StudentDashboardProps) {
  const greeting = getGreeting();

  // --------------------------------------------------
  // PLACEMENT INFORMATION
  // --------------------------------------------------

  const activePlacement = dashboardData.activePlacement;

  const organizationName = activePlacement?.organization?.name ?? "No active placement";

  const supervisor = activePlacement?.supervisor;

  const supervisorName = supervisor?.user?.name ?? "No supervisor assigned";

  const supervisorEmail = supervisor?.user?.email ?? "No supervisor email";

  const supervisorPosition = supervisor?.job_title ?? "Workplace Supervisor";

  // --------------------------------------------------
  // LOGBOOK INFORMATION
  // --------------------------------------------------

  const allLogbooks = useMemo(
    () => dashboardData.placements.flatMap((placement) => placement.logbooks ?? []),
    [dashboardData.placements],
  );

  const recentLogbooks = dashboardData.recentLogbooks ?? [];

  const uniqueSkills = useMemo(
    () =>
      Array.from(
        new Set(
          allLogbooks
            .map((log) => log.skills_learned)
            .filter((skill): skill is string => Boolean(skill)),
        ),
      ),
    [allLogbooks],
  );

  // --------------------------------------------------
  // ACTIVITY CHART DATA
  // --------------------------------------------------

  const activityChartData = useMemo(() => {
    const grouped = new Map<string, { day: string; entries: number; hours: number }>();

    [...allLogbooks]
      .sort((a, b) => a.log_date.localeCompare(b.log_date))
      .forEach((log) => {
        const date = log.log_date.substring(0, 10);

        const existing = grouped.get(date) ?? {
          day: new Date(date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          }),
          entries: 0,
          hours: 0,
        };

        existing.entries += 1;
        existing.hours += Number(log.hours_worked);

        grouped.set(date, existing);
      });

    return Array.from(grouped.values()).slice(-10);
  }, [allLogbooks]);

  // --------------------------------------------------
  // NUMBER FORMATTING
  // --------------------------------------------------

  const totalHours = Number(dashboardData.statistics.totalHours);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const firstName = name.split(" ")[0];

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="dashboard-page space-y-6 antialiased">
      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {greeting}, {firstName}
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {activePlacement
              ? `${organizationName} · Student Attachment`
              : "You currently have no active placement"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="sm" className="rounded-xl text-xs font-semibold h-9">
            <Link href="/logbook">Add Logbook Entry</Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-xl text-xs font-semibold h-9"
          >
            <Link href="/logbook">View Logbook</Link>
          </Button>
        </div>
      </div>

      {/* 4-STAGE PLACEMENT APPLICATION, TESTIMONIAL, ACCEPTANCE LETTER & MENTOR OTP JOURNEY */}
      <StudentPlacementJourney studentName={name} />

      {/* PLACEMENT AND SUPERVISOR */}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border/60 shadow-none">
          <CardContent className="p-5 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Current Host Organization</p>

            <p className="font-semibold text-base text-foreground">{organizationName}</p>

            {activePlacement && (
              <>
                <p className="text-xs text-muted-foreground">
                  {formatDate(activePlacement.start_date)} – {formatDate(activePlacement.end_date)}
                </p>

                <Badge variant="outline" className="capitalize">
                  {activePlacement.status}
                </Badge>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-none">
          <CardContent className="p-5 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Workplace Supervisor</p>

            <p className="font-semibold text-base text-foreground">{supervisorName}</p>

            <p className="text-xs text-muted-foreground">{supervisorPosition}</p>

            <p className="text-xs text-muted-foreground break-all">{supervisorEmail}</p>
          </CardContent>
        </Card>
      </div>

      {/* DASHBOARD STATISTICS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Logged Days"
          value={dashboardData.statistics.loggedDays}
          unit="days"
          meta="Days with logbook entries"
        />

        <KpiCard
          label="Logged Hours"
          value={totalHours.toFixed(1)}
          unit="hours"
          meta="Total recorded working hours"
        />

        <KpiCard
          label="Approved Activities"
          value={dashboardData.statistics.approvedLogbooks}
          unit={`of ${dashboardData.statistics.totalLogbooks}`}
          meta={`${dashboardData.statistics.submittedLogbooks} awaiting review`}
        />

        <KpiCard
          label="Skills Recorded"
          value={uniqueSkills.length}
          unit="skills"
          meta="Skills documented in logbooks"
        />
      </div>

      {/* PLACEMENT SUMMARY */}

      <Card className="shadow-card border-border/80">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Placement Summary</CardTitle>

          <CardDescription>Overview of your attachment placement records</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Total Placements</p>

              <p className="text-2xl font-bold">{dashboardData.statistics.totalPlacements}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Active Placements</p>

              <p className="text-2xl font-bold">{dashboardData.statistics.activePlacements}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Total Logbook Entries</p>

              <p className="text-2xl font-bold">{dashboardData.statistics.totalLogbooks}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ACTIVITY CHART */}

      <Card className="shadow-card border-border/80">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Activity and Working Hours</CardTitle>

          <CardDescription>Your recorded daily logbook entries and working hours</CardDescription>
        </CardHeader>

        <CardContent>
          {activityChartData.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activityChartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />

                  <XAxis dataKey="day" fontSize={11} tickLine={false} axisLine={false} />

                  <YAxis fontSize={11} tickLine={false} axisLine={false} />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                    }}
                  />

                  <Bar
                    dataKey="hours"
                    name="Hours Worked"
                    fill="var(--primary)"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              icon={BarChart3}
              title="No Working Hours Chart Data Yet"
              description="Once you record your daily logbook activities and hours worked, your time-series activity chart will appear here."
              secondaryAction={
                <Button asChild size="sm" className="h-8 text-xs font-semibold">
                  <Link href="/logbook">Record First Logbook Entry</Link>
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>

      {/* RECENT LOGBOOK ENTRIES */}

      <Card className="shadow-card border-border/80">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold">Recent Logbook Entries</CardTitle>

            <CardDescription>Your latest recorded attachment activities</CardDescription>
          </div>

          <Button asChild size="sm" variant="outline" className="text-xs font-semibold">
            <Link href="/logbook">View Full Logbook</Link>
          </Button>
        </CardHeader>

        <CardContent className="space-y-3">
          {recentLogbooks.length > 0 ? (
            recentLogbooks.map((log) => (
              <div key={log.id} className="rounded-xl border border-border bg-card p-4 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-semibold text-sm text-foreground">{log.activities}</h4>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(log.log_date)}
                    </span>

                    <Badge
                      variant={log.status === "approved" ? "default" : "secondary"}
                      className={`text-xs capitalize ${
                        log.status === "approved" ? "bg-success text-success-foreground" : ""
                      }`}
                    >
                      {log.status === "submitted" ? "Pending Review" : log.status}
                    </Badge>
                  </div>
                </div>

                {log.skills_learned && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold">Skills learned:</span> {log.skills_learned}
                  </p>
                )}

                {log.challenges && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold">Challenges:</span> {log.challenges}
                  </p>
                )}

                <div className="flex items-center justify-between border-t border-border/50 pt-2">
                  <span className="text-xs text-muted-foreground">Hours worked</span>

                  <span className="text-xs font-semibold">
                    {Number(log.hours_worked).toFixed(2)} hrs
                  </span>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No Logbook Entries Recorded Yet"
              description="Start documenting your daily internship tasks, tools utilized, and skills learned so your Field Mentor can comment and sign off."
              secondaryAction={
                <Button asChild size="sm" className="h-8 text-xs font-semibold">
                  <Link href="/logbook">Add First Logbook Entry</Link>
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>

      {/* ACTIVITY & COMPLIANCE AUDIT TRAIL */}
      <AuditTrailPanel role="student" />
    </div>
  );
}

// --------------------------------------------------
// SUPERVISOR DASHBOARD TYPES
// --------------------------------------------------

export type SupervisorStudent = {
  id: number;
  student_number: string;
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

export type SupervisorPlacement = {
  id: number;
  start_date: string;
  end_date: string;
  status: string;
  student: SupervisorStudent | null;
  organization: {
    name: string;
  } | null;
  logbooks: StudentLogbook[];
};

export type SupervisorDashboardData = {
  supervisor: {
    job_title: string | null;
    department: string | null;
    organization: {
      name: string;
    } | null;
  } | null;

  placements: SupervisorPlacement[];
  students: SupervisorStudent[];

  statistics: {
    totalPlacements: number;
    activePlacements: number;
    pendingPlacements: number;
    totalStudents: number;
    totalLogbooks: number;
    pendingLogbooks: number;
    approvedLogbooks: number;
    totalHours: number | string;
  };

  recentLogbooks: StudentLogbook[];
};

type SupervisorDashboardProps = {
  name: string;
  dashboardData: SupervisorDashboardData;
};

// --------------------------------------------------
// SUPERVISOR DASHBOARD
// --------------------------------------------------

export function SupervisorDashboard({ name, dashboardData }: SupervisorDashboardProps) {
  const greeting = getGreeting();

  const { statistics, placements, students, recentLogbooks } = dashboardData;

  const firstName = name.split(" ")[0];

  const totalHours = Number(statistics.totalHours);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const placementChartData = useMemo(() => {
    return [
      {
        status: "Active",
        placements: statistics.activePlacements,
      },
      {
        status: "Pending",
        placements: statistics.pendingPlacements,
      },
      {
        status: "Other",
        placements:
          statistics.totalPlacements - statistics.activePlacements - statistics.pendingPlacements,
      },
    ];
  }, [statistics]);

  return (
    <div className="dashboard-page space-y-6 antialiased">
      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {greeting}, {firstName}
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Overview of your supervised students and attachment placements.
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {dashboardData.supervisor?.organization?.name ?? "No organization assigned"}
          </p>
        </div>

        <Button asChild size="sm" className="rounded-xl text-xs font-semibold h-9">
          <Link href="/placements">View Placements</Link>
        </Button>
      </div>

      {/* KPI STATISTICS */}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="My Students"
          value={statistics.totalStudents}
          unit="students"
          meta="Students under your supervision"
        />

        <KpiCard
          label="Active Placements"
          value={statistics.activePlacements}
          unit="placements"
          meta="Currently active attachments"
        />

        <KpiCard
          label="Pending Logbooks"
          value={statistics.pendingLogbooks}
          unit="entries"
          meta="Submitted entries awaiting review"
        />

        <KpiCard
          label="Recorded Hours"
          value={totalHours.toFixed(1)}
          unit="hours"
          meta="Hours recorded by your students"
        />
      </div>

      {/* PLACEMENT SUMMARY */}

      <Card className="shadow-card border-border/80">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Placement Summary</CardTitle>

          <CardDescription>Overview of placements assigned to your supervision.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Total Placements</p>
              <p className="text-2xl font-bold">{statistics.totalPlacements}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Pending Placements</p>
              <p className="text-2xl font-bold">{statistics.pendingPlacements}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Approved Logbooks</p>
              <p className="text-2xl font-bold">{statistics.approvedLogbooks}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PLACEMENT CHART */}

      <Card className="shadow-card border-border/80">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Placement Overview</CardTitle>

          <CardDescription>Distribution of your supervised placements by status.</CardDescription>
        </CardHeader>

        <CardContent>
          {statistics.totalPlacements > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={placementChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />

                  <XAxis dataKey="status" fontSize={11} tickLine={false} axisLine={false} />

                  <YAxis allowDecimals={false} fontSize={11} tickLine={false} axisLine={false} />

                  <Tooltip />

                  <Bar
                    dataKey="placements"
                    name="Placements"
                    fill="var(--primary)"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No placement records are available yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* SUPERVISED STUDENTS */}

      <Card className="shadow-card border-border/80">
        <CardHeader>
          <CardTitle className="text-base font-semibold">My Supervised Students</CardTitle>

          <CardDescription>
            Students assigned to you through their attachment placements.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Student Number</th>
                    <th className="p-3">Program</th>
                    <th className="p-3">Department</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b">
                      <td className="p-3 font-medium">{student.user?.name ?? "Unknown"}</td>

                      <td className="p-3">{student.student_number}</td>

                      <td className="p-3">{student.program?.name ?? "—"}</td>

                      <td className="p-3">{student.program?.department?.name ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No students have been assigned to you yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* SUPERVISED PLACEMENTS */}

      <Card className="shadow-card border-border/80">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Supervised Placements</CardTitle>

          <CardDescription>Placement details for your assigned students.</CardDescription>
        </CardHeader>

        <CardContent>
          {placements.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-3">Student</th>
                    <th className="p-3">Organization</th>
                    <th className="p-3">Start Date</th>
                    <th className="p-3">End Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {placements.map((placement) => (
                    <tr key={placement.id} className="border-b">
                      <td className="p-3 font-medium">
                        {placement.student?.user?.name ?? "Unknown"}
                      </td>

                      <td className="p-3">{placement.organization?.name ?? "—"}</td>

                      <td className="p-3">{formatDate(placement.start_date)}</td>

                      <td className="p-3">{formatDate(placement.end_date)}</td>

                      <td className="p-3">
                        <Badge
                          variant={placement.status === "active" ? "default" : "secondary"}
                          className="capitalize"
                        >
                          {placement.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No placements have been assigned to you yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* RECENT LOGBOOK SUBMISSIONS */}

      <Card className="shadow-card border-border/80">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent Logbook Submissions</CardTitle>

          <CardDescription>Latest logbook entries from your supervised placements.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {recentLogbooks.length > 0 ? (
            recentLogbooks.map((log) => (
              <div key={log.id} className="rounded-xl border border-border bg-card p-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <p className="font-semibold text-sm">{log.activities}</p>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(log.log_date)}
                    </span>

                    <Badge
                      variant={log.status === "approved" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {log.status === "submitted" ? "Pending Review" : log.status}
                    </Badge>
                  </div>
                </div>

                {log.skills_learned && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold">Skills learned:</span> {log.skills_learned}
                  </p>
                )}

                <div className="flex justify-between border-t border-border/50 pt-2">
                  <span className="text-xs text-muted-foreground">Hours worked</span>

                  <span className="text-xs font-semibold">
                    {Number(log.hours_worked).toFixed(2)} hrs
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No logbook submissions are available yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
