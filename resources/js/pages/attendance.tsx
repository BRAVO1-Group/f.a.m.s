import { useState, useEffect } from "react";
import { CalendarCheck, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { enqueueOfflineAction, isAppOffline } from "@/components/ui/network-banner";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppUser } from "@/lib/app-user";
import {
  internships,
  uid,
  getStoredAttendance,
  saveStoredAttendance,
  type MockAttendance,
} from "@/lib/mock-data";

const todayStr = () => new Date().toISOString().slice(0, 10);

function fmt(ts: string | null) {
  if (!ts) return "—";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function hours(a: string | null, b: string | null) {
  if (!a || !b) return null;
  return (new Date(b).getTime() - new Date(a).getTime()) / 3600000;
}

export default function AttendancePage() {
  const { userId } = useAppUser();
  const [attendanceList, setAttendanceList] = useState<MockAttendance[]>(getStoredAttendance);
  const [confirmClockIn, setConfirmClockIn] = useState(false);
  const [confirmClockOutId, setConfirmClockOutId] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setAttendanceList(getStoredAttendance());
    window.addEventListener("internflow-attendance-change", handler);
    return () => window.removeEventListener("internflow-attendance-change", handler);
  }, []);

  const myInternship = internships.find((i) => i.student_id === userId);
  const rows = attendanceList
    .filter((a) => a.student_id === userId)
    .sort((a, b) => (a.attendance_date < b.attendance_date ? 1 : -1));

  const todayRow = rows.find((r) => r.attendance_date === todayStr());
  const required = myInternship?.required_days ?? 60;
  const daysPresent = rows.filter((r) => r.check_in).length;
  const rate = Math.min(100, Math.round((daysPresent / Math.max(required, 1)) * 100));

  function checkIn() {
    if (todayRow) return;
    const current = getStoredAttendance();
    const newEntry: MockAttendance = {
      id: uid(),
      student_id: userId,
      internship_id: myInternship?.id ?? "intern-1",
      attendance_date: todayStr(),
      check_in: new Date().toISOString(),
      check_out: null,
    };
    const updated = [newEntry, ...current];
    saveStoredAttendance(updated);
    setAttendanceList(updated);
    toast.success("Checked in");
  }

  function checkOut(id: string) {
    const current = getStoredAttendance();
    const idx = current.findIndex((a) => a.id === id);
    if (idx >= 0) {
      const rec = current[idx]!;
      const updated = [...current];
      updated[idx] = {
        ...rec,
        check_out: new Date().toISOString(),
      };
      saveStoredAttendance(updated);
      setAttendanceList(updated);
      setConfirmClockOutId(null);
      if (isAppOffline()) {
        enqueueOfflineAction("attendance_checkout", `Clocked out for ${todayStr()}`);
      }
      toast.success("Checked out and shift recorded");
    }
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
        <KpiCard
          label="Days present"
          value={daysPresent}
          unit={`/ ${required} days`}
        />
        <KpiCard
          label="Attendance rate"
          value={`${rate}%`}
        >
          <Progress value={rate} className="h-1" />
        </KpiCard>
        <KpiCard
          label="Today"
          value={
            todayRow?.check_out
              ? "Completed"
              : todayRow?.check_in
                ? `In ${fmt(todayRow.check_in)}`
                : "Not checked in"
          }
          meta={
            todayRow?.check_out
              ? `${fmt(todayRow.check_in)} – ${fmt(todayRow.check_out)}`
              : undefined
          }
        >
          {!todayRow ? (
            <Button size="sm" className="w-full" onClick={() => setConfirmClockIn(true)}>
              <LogIn className="size-4" /> Check in
            </Button>
          ) : !todayRow.check_out ? (
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
              description="Click 'Check in' when you arrive at your host organization so your Field Mentor can verify your daily shift."
              actionLabel="Check In for Today's Shift"
              onAction={() => setConfirmClockIn(true)}
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
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
      <ConfirmDialog
        open={confirmClockIn}
        onOpenChange={setConfirmClockIn}
        title="Confirm Daily Workplace Check-In?"
        description={`Are you sure you want to clock in for today's shift (${todayStr()})? Your arrival timestamp will be recorded for your Field Mentor's verification.`}
        confirmLabel="Yes, Check In Now"
        cancelLabel="No, Cancel"
        onConfirm={() => {
          setConfirmClockIn(false);
          checkIn();
          if (isAppOffline()) {
            enqueueOfflineAction("attendance_checkin", `Clocked in for ${todayStr()}`);
          }
        }}
      />

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
    </div>
  );
}
