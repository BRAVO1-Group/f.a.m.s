import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Flame,
  LogIn,
  LogOut,
  MapPin,
  QrCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppUser } from "@/lib/app-user";
import { RoleGuard } from "@/components/RoleGuard";
import { attendance, internships, uid } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance & Verification — InternTrack" },
      {
        name: "description",
        content: "Digital check-in, geofence verification, and attendance tracking.",
      },
      { property: "og:title", content: "Attendance & Verification — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AttendancePage,
});

const todayStr = () => new Date().toISOString().slice(0, 10);

function fmt(ts: string | null) {
  if (!ts) return "—";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function hours(a: string | null, b: string | null) {
  if (!a || !b) return null;
  return (new Date(b).getTime() - new Date(a).getTime()) / 3600000;
}

function AttendancePage() {
  const { userId } = useAppUser();
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate((n) => n + 1);

  const myInternship = internships.find((i) => i.student_id === userId);
  const rows = attendance
    .filter((a) => a.student_id === userId)
    .sort((a, b) => (a.attendance_date < b.attendance_date ? 1 : -1));

  const todayRow = rows.find((r) => r.attendance_date === todayStr());
  const required = myInternship?.required_days ?? 60;
  const daysPresent = rows.filter((r) => r.check_in).length;
  const rate = Math.min(100, Math.round((daysPresent / Math.max(required, 1)) * 100));

  const totalHoursLogged = rows.reduce((acc, r) => {
    const h = hours(r.check_in, r.check_out);
    return acc + (h ?? (r.check_in && r.attendance_date === todayStr() ? 4.5 : 0));
  }, 0);

  function checkIn() {
    if (todayRow) return;
    attendance.unshift({
      id: uid(),
      student_id: userId,
      internship_id: myInternship?.id ?? "intern-1",
      attendance_date: todayStr(),
      check_in: new Date().toISOString(),
      check_out: null,
    });
    refresh();
    setQrModalOpen(false);
    toast.success("Checked in successfully! Shift timestamp recorded.");
  }

  function checkOut(id: string) {
    const idx = attendance.findIndex((a) => a.id === id);
    if (idx >= 0) {
      const rec = attendance[idx]!;
      attendance[idx] = {
        id: rec.id,
        student_id: rec.student_id,
        internship_id: rec.internship_id,
        attendance_date: rec.attendance_date,
        check_in: rec.check_in,
        check_out: new Date().toISOString(),
      };
    }
    refresh();
    toast.success("Checked out! Total hours updated.");
  }

  return (
    <RoleGuard allowedRoles={["student"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold">Attendance Hub</h1>
            <p className="text-sm text-muted-foreground">
              Digital check-in, geofence verification, and attendance percentage tracking.
            </p>
          </div>

          {/* QR / Geofence Dialog Trigger */}
          <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 border-primary/30">
                <QrCode className="size-4 text-primary" />
                Scan QR / Verify GPS
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-emerald-500" />
                  Office Turnstile & GPS Verification
                </DialogTitle>
                <DialogDescription>
                  Simulate optical badge scanning or geolocation verification at your company
                  placement.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* QR Scanner Mock Viewport */}
                <div className="relative mx-auto flex size-48 flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/50 bg-accent/20 p-4 text-center">
                  <div className="absolute inset-x-2 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
                  <QrCode className="size-24 text-foreground/80 opacity-90" />
                  <p className="mt-2 text-[11px] font-medium text-muted-foreground">
                    Scan code at TechCorp entrance
                  </p>
                </div>

                {/* Geofence GPS Pill */}
                <div className="rounded-lg border border-border/80 bg-background p-3 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-medium">
                    <span className="flex items-center gap-1.5 text-foreground">
                      <MapPin className="size-3.5 text-emerald-600" />
                      Office Geofence Status
                    </span>
                    <Badge
                      variant="outline"
                      className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 text-[10px]"
                    >
                      Within Perimeter
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    TechCorp Tower, Level 4 (Radius: 35m • Lat: -1.2921, Long: 36.8219)
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setQrModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" disabled={Boolean(todayRow)} onClick={checkIn}>
                  <CheckCircle2 className="size-4" />
                  {todayRow ? "Already Checked In" : "Confirm Attendance Check-In"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Metrics Row */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="shadow-xs">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center justify-between text-xs font-medium">
                <span>Days Present</span>
                <CalendarCheck className="size-4 text-primary" />
              </CardDescription>
              <CardTitle className="text-3xl font-bold">{daysPresent}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Target: {required} required days
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center justify-between text-xs font-medium">
                <span>Total Hours Logged</span>
                <Clock className="size-4 text-primary" />
              </CardDescription>
              <CardTitle className="text-3xl font-bold">
                {Math.round(totalHoursLogged)} hrs
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Average: 8.1 hrs / workday
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center justify-between text-xs font-medium">
                <span>Attendance Rate</span>
                <Progress value={rate} className="w-16 h-2" />
              </CardDescription>
              <CardTitle className="text-3xl font-bold">{rate}%</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Satisfies academic requirement
            </CardContent>
          </Card>

          <Card className="shadow-xs border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center justify-between text-xs font-medium">
                <span>Current Status</span>
                <Flame className="size-4 text-amber-500" />
              </CardDescription>
              <CardTitle className="text-base font-semibold">
                {todayRow?.check_out ? (
                  <Badge className="bg-emerald-600 text-white">Shift Completed</Badge>
                ) : todayRow?.check_in ? (
                  <span className="flex items-center gap-1.5 text-sm text-foreground">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    Checked In ({fmt(todayRow.check_in)})
                  </span>
                ) : (
                  <Badge variant="outline">Not checked in</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!todayRow ? (
                <Button className="w-full h-8 text-xs font-medium" onClick={checkIn}>
                  <LogIn className="size-3.5" /> Check in now
                </Button>
              ) : !todayRow.check_out ? (
                <Button
                  className="w-full h-8 text-xs font-medium"
                  variant="outline"
                  onClick={() => checkOut(todayRow.id)}
                >
                  <LogOut className="size-3.5" /> Complete shift & check out
                </Button>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Recorded: {fmt(todayRow.check_in)} – {fmt(todayRow.check_out)}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* History Table */}
        <Card className="shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <CalendarCheck className="size-4 text-primary" />
                Verified Attendance History
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                {rows.length} total entries recorded
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {rows.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No attendance records logged yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Check In Time</TableHead>
                      <TableHead>Check Out Time</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead className="text-right">Hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r) => {
                      const h = hours(r.check_in, r.check_out);
                      return (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium text-foreground">
                            {r.attendance_date}
                          </TableCell>
                          <TableCell>{fmt(r.check_in)}</TableCell>
                          <TableCell>{fmt(r.check_out)}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-[10px] gap-1 font-normal text-muted-foreground"
                            >
                              <ShieldCheck className="size-3 text-emerald-500" />
                              GPS Verified
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {h === null
                              ? r.check_in && r.attendance_date === todayStr()
                                ? "In progress"
                                : "—"
                              : `${h.toFixed(1)} hrs`}
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
      </div>
    </RoleGuard>
  );
}
