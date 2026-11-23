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

            <p className="text-xs text-primary break-all">{supervisorEmail}</p>
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
    </div>
  );
}
