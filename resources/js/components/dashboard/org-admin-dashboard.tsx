import { Link } from "@inertiajs/react";
import {
  Building2,
  Users,
  Briefcase,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

import { getGreeting } from "./get-greeting";

// ------------------------------------------------------
// TYPES
// ------------------------------------------------------

type OrganizationStudent = {
  id: number;
  student_number: string;
  year_of_study: number;
  status: string;
  phone: string | null;
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

type OrganizationSupervisor = {
  id: number;
  job_title: string | null;
  department: string | null;
  phone: string | null;
  status: string;
  user: {
    name: string;
    email: string;
  } | null;
};

type OrganizationPlacement = {
  id: number;
  start_date: string;
  end_date: string;
  status: string;
  description: string | null;

  student: OrganizationStudent | null;

  supervisor: {
    job_title: string | null;
    department: string | null;
    user: {
      name: string;
      email: string;
    } | null;
  } | null;

  logbooks: {
    id: number;
    log_date: string;
    activities: string;
    hours_worked: number | string;
    status: string;
  }[];
};

export type OrgAdminDashboardData = {
  organization: {
    id: number;
    name: string;
    industry: string | null;
    email: string;
    phone: string;
    address: string;
    status: string;
  } | null;

  supervisors: OrganizationSupervisor[];
  students: OrganizationStudent[];
  placements: OrganizationPlacement[];

  statistics: {
    totalSupervisors: number;
    totalPlacements: number;
    activePlacements: number;
    pendingPlacements: number;
    totalStudents: number;
    totalLogbooks: number;
    submittedLogbooks: number;
    approvedLogbooks: number;
    attendanceShifts: number;
    totalMilestones: number;
    completedMilestones: number;
  };

  recentPlacements: OrganizationPlacement[];
};

// ------------------------------------------------------
// ORGANIZATION ADMIN DASHBOARD
// ------------------------------------------------------

export function OrgAdminDashboard({
  name,
  dashboardData,
}: {
  userId: string;
  name: string;
  dashboardData: OrgAdminDashboardData;
}) {
  const greeting = getGreeting();

  const { organization, supervisors, students, placements, statistics, recentPlacements } =
    dashboardData;

  const getInitials = (studentName: string) =>
    studentName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "approved":
        return "default";

      case "pending":
      case "submitted":
        return "secondary";

      case "rejected":
      case "declined":
        return "destructive";

      default:
        return "outline";
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-UG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="dashboard-page space-y-6 antialiased">
      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {greeting}, {name}
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {organization?.name ?? "Organization Dashboard"}
            {" · "}
            Managing {statistics.totalStudents} assigned students
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="sm" className="rounded-xl text-xs font-semibold">
            <Link href="/placements">View Placements</Link>
          </Button>

          <Button asChild size="sm" variant="outline" className="rounded-xl text-xs font-semibold">
            <Link href="/students">View Students</Link>
          </Button>
        </div>
      </div>

      {/* ORGANIZATION INFORMATION */}

      {organization && (
        <Card className="shadow-card border-border/80">
          <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="size-6" />
            </div>

            <div className="flex-1">
              <h2 className="font-semibold text-base">{organization.name}</h2>

              <p className="text-xs text-muted-foreground">
                {organization.industry ?? "Industry not specified"}
              </p>

              <p className="text-xs text-muted-foreground mt-1">{organization.email}</p>
            </div>

            <Badge variant={getStatusVariant(organization.status)}>{organization.status}</Badge>
          </CardContent>
        </Card>
      )}

      {/* KPI CARDS */}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Assigned Students"
          value={statistics.totalStudents}
          meta="Students attached to your organization"
        />

        <KpiCard
          label="Active Placements"
          value={statistics.activePlacements}
          meta="Currently ongoing attachments"
        />

        <KpiCard
          label="Pending Placements"
          value={statistics.pendingPlacements}
          meta="Awaiting placement progress"
        />

        <KpiCard
          label="Field Supervisors"
          value={statistics.totalSupervisors}
          meta="Registered organization supervisors"
        />
      </div>

      {/* LOGBOOK STATISTICS */}

      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          label="Total Logbooks"
          value={statistics.totalLogbooks}
          meta="Entries submitted by students"
        />

        <KpiCard
          label="Pending Logbooks"
          value={statistics.submittedLogbooks}
          meta="Awaiting supervisor review"
        />

        <KpiCard
          label="Approved Logbooks"
          value={statistics.approvedLogbooks}
          meta="Entries approved"
        />

        <KpiCard
          label="Attendance Shifts"
          value={statistics.attendanceShifts}
          meta="Student check-ins recorded"
        />

        <KpiCard
          label="Milestones Completed"
          value={statistics.completedMilestones}
          unit={`of ${statistics.totalMilestones}`}
          meta="Assigned roadmap progress"
        />
      </div>

      {/* ASSIGNED STUDENTS */}

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Users className="size-5 text-primary" />
              Assigned Students
            </h2>

            <p className="text-xs text-muted-foreground">
              Students undertaking attachment at your organization
            </p>
          </div>

          <Button asChild size="sm" variant="outline">
            <Link href="/students">View Student Records</Link>
          </Button>
        </div>

        {students.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <GraduationCap className="mx-auto size-9 text-muted-foreground mb-2" />

              <p className="font-medium text-sm">No students assigned yet</p>

              <p className="text-xs text-muted-foreground mt-1">
                Students assigned to your organization will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {students.map((student) => {
              const studentPlacements = placements.filter(
                (placement) => placement.student?.id === student.id,
              );

              const activePlacement = studentPlacements.find(
                (placement) => placement.status === "active",
              );

              const loggedDays = activePlacement?.logbooks.length ?? 0;

              return (
                <Card
                  key={student.id}
                  className="shadow-card border-border/80 hover:border-primary/40 transition"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-11 border border-border">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                            {getInitials(student.user?.name ?? "Student")}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <CardTitle className="text-base font-semibold">
                            {student.user?.name ?? "Unnamed Student"}
                          </CardTitle>

                          <CardDescription className="font-mono text-xs">
                            {student.student_number}
                          </CardDescription>
                        </div>
                      </div>

                      <Badge variant={getStatusVariant(student.status)}>{student.status}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3">
                      <div>
                        <span className="text-[11px] text-muted-foreground block font-medium">
                          Academic Program
                        </span>

                        <span className="font-semibold text-foreground">
                          {student.program?.name ?? "Not specified"}
                        </span>

                        <span className="text-[11px] text-muted-foreground block">
                          {student.program?.department?.name ?? "No department"}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-muted-foreground block font-medium">
                          Year of Study
                        </span>

                        <span className="font-semibold text-foreground">
                          Year {student.year_of_study}
                        </span>

                        <span className="text-[11px] text-muted-foreground block">
                          {student.user?.email}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Active Placement</span>

                        <span className="font-semibold">
                          {activePlacement ? "Ongoing" : "No active placement"}
                        </span>
                      </div>

                      <Progress value={activePlacement ? 100 : 0} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-border/60">
                      <span className="text-[11px] text-muted-foreground">
                        Placements: <strong>{studentPlacements.length}</strong>
                      </span>

                      <span className="text-[11px] text-muted-foreground">
                        Logbook entries: <strong>{loggedDays}</strong>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* FIELD SUPERVISORS */}

      <Card className="shadow-card border-border/80">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="size-5 text-primary" />
            Organization Supervisors
          </CardTitle>

          <CardDescription>Supervisors registered under your organization</CardDescription>
        </CardHeader>

        <CardContent>
          {supervisors.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No supervisors registered yet.
            </p>
          ) : (
            <div className="space-y-3">
              {supervisors.map((supervisor) => (
                <div
                  key={supervisor.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(supervisor.user?.name ?? "Supervisor")}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="text-sm font-semibold">
                        {supervisor.user?.name ?? "Unnamed Supervisor"}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {supervisor.job_title ?? "Field Supervisor"}
                        {supervisor.department ? ` · ${supervisor.department}` : ""}
                      </p>

                      <p className="text-xs text-muted-foreground">{supervisor.user?.email}</p>
                    </div>
                  </div>

                  <Badge variant={getStatusVariant(supervisor.status)}>{supervisor.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* RECENT PLACEMENTS */}

      <Card className="shadow-card border-border/80">
        <CardHeader className="flex flex-col items-start justify-between gap-3 pb-3 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="size-5 text-primary" />
              Recent Placements
            </CardTitle>

            <CardDescription>Latest student placement records at your organization</CardDescription>
          </div>

          <Button asChild size="sm" variant="outline">
            <Link href="/placements">View All Placements</Link>
          </Button>
        </CardHeader>

        <CardContent className="space-y-3">
          {recentPlacements.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground border border-dashed rounded-xl">
              <Briefcase className="mx-auto size-8 mb-2" />
              No placement records available yet.
            </div>
          ) : (
            recentPlacements.map((placement) => (
              <div
                key={placement.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-sm">
                    {placement.student?.user?.name ?? "Student"}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {placement.student?.student_number ?? "No registration number"}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Supervisor: {placement.supervisor?.user?.name ?? "Not assigned"}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                    <span>
                      <Clock className="inline size-3 mr-1" />
                      {formatDate(placement.start_date)}
                    </span>

                    <span>
                      <CheckCircle2 className="inline size-3 mr-1" />
                      {formatDate(placement.end_date)}
                    </span>

                    <span>
                      <BookOpen className="inline size-3 mr-1" />
                      {placement.logbooks.length} logbook entries
                    </span>
                  </div>
                </div>

                <Badge variant={getStatusVariant(placement.status)}>{placement.status}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
