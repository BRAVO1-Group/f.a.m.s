import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppUser } from "@/lib/app-user";
import { attendance, internships, uid } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance — InternTrack" },
      { name: "description", content: "Digital check-in and check-out with attendance history." },
      { property: "og:title", content: "Attendance — InternTrack" },
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
    toast.success("Checked in");
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
    toast.success("Checked out");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Attendance</h1>
        <p className="text-sm text-muted-foreground">
          Check in when you arrive and check out when you leave. Times are recorded automatically.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardDescription>Days present</CardDescription>
            <CardTitle className="text-3xl">{daysPresent}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            of {required} required days
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardDescription>Attendance rate</CardDescription>
            <CardTitle className="text-3xl">{rate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={rate} />
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardDescription>Today</CardDescription>
            <CardTitle className="text-base">
              {todayRow?.check_out ? (
                <Badge>Completed</Badge>
              ) : todayRow?.check_in ? (
                <Badge variant="secondary">Checked in {fmt(todayRow.check_in)}</Badge>
              ) : (
                <Badge variant="outline">Not checked in</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!todayRow ? (
              <Button className="w-full" onClick={checkIn}>
                <LogIn className="size-4" /> Check in
              </Button>
            ) : !todayRow.check_out ? (
              <Button className="w-full" variant="outline" onClick={() => checkOut(todayRow.id)}>
                <LogOut className="size-4" /> Check out
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">
                {fmt(todayRow.check_in)} – {fmt(todayRow.check_out)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarCheck className="size-4" /> Attendance history
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No attendance recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Check in</TableHead>
                    <TableHead>Check out</TableHead>
                    <TableHead className="text-right">Hours</TableHead>
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
    </div>
  );
}
