import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarCheck, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAppUser } from "@/lib/app-user";

export const Route = createFileRoute("/_authenticated/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance — InternTrack" },
      { name: "description", content: "Digital check-in and check-out with attendance history." },
      { property: "og:title", content: "Attendance — InternTrack" },
      { property: "og:description", content: "Track internship attendance with timestamps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AttendancePage,
});

const today = () => new Date().toISOString().slice(0, 10);

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
  const qc = useQueryClient();

  const internship = useQuery({
    queryKey: ["my-internship", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("internships")
        .select("id, required_days")
        .eq("student_id", userId)
        .order("start_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["attendance", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("student_id", userId)
        .order("attendance_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const rows = data ?? [];
  const todayRow = rows.find((r) => r.attendance_date === today());
  const required = internship.data?.required_days ?? 60;
  const daysPresent = rows.filter((r) => r.check_in).length;
  const rate = Math.min(100, Math.round((daysPresent / Math.max(required, 1)) * 100));

  const checkIn = useMutation({
    mutationFn: async () => {
      const payload = {
        student_id: userId,
        internship_id: internship.data?.id ?? null,
        attendance_date: today(),
        check_in: new Date().toISOString(),
      };
      const { error } = await supabase.from("attendance").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attendance", userId] });
      toast.success("Checked in");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const checkOut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("attendance")
        .update({ check_out: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attendance", userId] });
      toast.success("Checked out");
    },
    onError: (e: Error) => toast.error(e.message),
  });

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
              <Button className="w-full" disabled={checkIn.isPending} onClick={() => checkIn.mutate()}>
                <LogIn className="size-4" /> Check in
              </Button>
            ) : !todayRow.check_out ? (
              <Button
                className="w-full"
                variant="outline"
                disabled={checkOut.isPending}
                onClick={() => checkOut.mutate(todayRow.id)}
              >
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
          {isLoading ? (
            <Skeleton className="h-40 rounded-xl" />
          ) : rows.length === 0 ? (
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
