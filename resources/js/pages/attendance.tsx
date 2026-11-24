import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { CalendarCheck, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AttendanceEntry = {
  id: number;
  attendance_date: string;
  check_in: string;
  check_out: string | null;
  placement: {
    student: {
      user: {
        name: string;
      } | null;
    } | null;
    organization: {
      name: string;
    } | null;
  };
};

type AttendancePageProps = {
  attendance: AttendanceEntry[];
  canRecordAttendance: boolean;
  today: string;
};

function fmt(ts: string | null) {
  if (!ts) return "—";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function hours(a: string | null, b: string | null) {
  if (!a || !b) return null;
  return (new Date(b).getTime() - new Date(a).getTime()) / 3600000;
}

export default function AttendancePage() {
  const { props } = usePage<AttendancePageProps>();
  const [confirmClockIn, setConfirmClockIn] = useState(false);
  const [confirmClockOutId, setConfirmClockOutId] = useState<number | null>(null);
  const rows = props.attendance;

  const todayRow = rows.find((r) => r.attendance_date === props.today);
  const required = 60;
  const daysPresent = new Set(rows.map((row) => row.attendance_date)).size;
  const rate = Math.min(100, Math.round((daysPresent / Math.max(required, 1)) * 100));

  function checkIn() {
    if (todayRow) return;
    router.post(
      "/attendance/check-in",
      {},
      {
        preserveScroll: true,
        onSuccess: () => toast.success("Checked in"),
        onError: (errors) => {
          toast.error(Object.values(errors).join(" ") || "Unable to check in.");
        },
      },
    );
  }

  function checkOut(id: number) {
    router.patch(
      `/attendance/${id}/check-out`,
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          setConfirmClockOutId(null);
          toast.success("Checked out and shift recorded");
        },
        onError: (errors) => {
          toast.error(Object.values(errors).join(" ") || "Unable to check out.");
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Attendance</h1>
        <p className="text-sm text-muted-foreground">
          Check in when you arrive and check out when you leave. Times are recorded automatically.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard label="Days present" value={daysPresent} unit={`/ ${required} days`} />
        <KpiCard label="Attendance rate" value={`${rate}%`}>
          <Progress value={rate} className="h-1" />
        </KpiCard>
        <KpiCard
          label={props.canRecordAttendance ? "Today" : "Recorded Shifts"}
          value={
            props.canRecordAttendance
              ? todayRow?.check_out
                ? "Completed"
                : todayRow?.check_in
                  ? `In ${fmt(todayRow.check_in)}`
                  : "Not checked in"
              : rows.length
          }
          meta={
            props.canRecordAttendance && todayRow?.check_out
              ? `${fmt(todayRow.check_in)} – ${fmt(todayRow.check_out)}`
              : props.canRecordAttendance
                ? undefined
                : "Attendance recorded by assigned students"
          }
        >
          {props.canRecordAttendance && !todayRow ? (
            <Button size="sm" className="w-full" onClick={() => setConfirmClockIn(true)}>
              <LogIn className="size-4" /> Check in
            </Button>
          ) : props.canRecordAttendance && todayRow && !todayRow.check_out ? (
            <Button
              size="sm"
              className="w-full"
              variant="outline"
              onClick={() => setConfirmClockOutId(todayRow.id)}
            >
              <LogOut className="size-4" /> Check out
            </Button>
          ) : null}
        </KpiCard>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarCheck className="size-4" /> Attendance history
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <EmptyState
              icon={CalendarCheck}
              title="No Workplace Attendance Shifts Logged Yet"
              description={
                props.canRecordAttendance
                  ? "Click 'Check in' when you arrive at your host organization so your Field Mentor can verify your daily shift."
                  : "Attendance records from students assigned to you will appear here."
              }
              {...(props.canRecordAttendance
                ? {
                    actionLabel: "Check In for Today's Shift",
                    onAction: () => setConfirmClockIn(true),
                  }
                : {})}
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {!props.canRecordAttendance && <TableHead>Student</TableHead>}
                    <TableHead className="text-success">Date</TableHead>
                    <TableHead className="text-success">Check in</TableHead>
                    <TableHead className="text-success">Check out</TableHead>
                    <TableHead className="text-right text-success">Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => {
                    const h = hours(r.check_in, r.check_out);
                    return (
                      <TableRow key={r.id}>
                        {!props.canRecordAttendance && (
                          <TableCell>
                            {r.placement.student?.user?.name ?? "Student"}
                            <span className="block text-xs text-muted-foreground">
                              {r.placement.organization?.name ?? "Placement"}
                            </span>
                          </TableCell>
                        )}
                        <TableCell className="font-medium">{r.attendance_date}</TableCell>
                        <TableCell>{fmt(r.check_in)}</TableCell>
                        <TableCell>{fmt(r.check_out)}</TableCell>
                        <TableCell className="text-right">
                          {h === null ? "—" : h.toFixed(1)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Yes / No Confirmation Dialogs for Clock In & Clock Out */}
      {props.canRecordAttendance && (
        <ConfirmDialog
          open={confirmClockIn}
          onOpenChange={setConfirmClockIn}
          title="Confirm Daily Workplace Check-In?"
          description={`Are you sure you want to clock in for today's shift (${props.today})? Your arrival timestamp will be recorded for your Field Mentor's verification.`}
          confirmLabel="Yes, Check In Now"
          cancelLabel="No, Cancel"
          onConfirm={() => {
            setConfirmClockIn(false);
            checkIn();
          }}
        />
      )}

      {props.canRecordAttendance && (
        <ConfirmDialog
          open={Boolean(confirmClockOutId)}
          onOpenChange={(open) => {
            if (!open) setConfirmClockOutId(null);
          }}
          title="Confirm Daily Workplace Check-Out?"
          description="Are you sure you want to clock out and close today's shift? Your total shift hours will be calculated automatically."
          confirmLabel="Yes, Check Out"
          cancelLabel="No, Stay Checked In"
          onConfirm={() => {
            if (confirmClockOutId) checkOut(confirmClockOutId);
          }}
        />
      )}
    </div>
  );
}
