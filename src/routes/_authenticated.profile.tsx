import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAppUser } from "@/lib/app-user";
import { ROLE_LABELS } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — InternTrack" },
      { name: "description", content: "Manage your internship profile details and placement." },
      { property: "og:title", content: "My Profile — InternTrack" },
      { property: "og:description", content: "Keep your internship details up to date." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { userId, email, role, roles } = useAppUser();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    institution: "",
    course: "",
    student_number: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const internship = useQuery({
    queryKey: ["my-internship-full", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("internships")
        .select("*, organizations(name, industry, address, contact_person, contact_email)")
        .eq("student_id", userId)
        .order("start_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!data) return;
    setForm({
      full_name: data.full_name ?? "",
      phone: data.phone ?? "",
      institution: data.institution ?? "",
      course: data.course ?? "",
      student_number: data.student_number ?? "",
    });
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: form.full_name.trim(),
          phone: form.phone.trim() || null,
          institution: form.institution.trim() || null,
          course: form.course.trim() || null,
          student_number: form.student_number.trim() || null,
        })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", userId] });
      toast.success("Profile updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const org = internship.data?.organizations as
    | {
        name: string;
        industry: string | null;
        address: string | null;
        contact_person: string | null;
        contact_email: string | null;
      }
    | null
    | undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">My profile</h1>
        <p className="text-sm text-muted-foreground">
          Your details and current internship placement.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Personal details</CardTitle>
            <CardDescription>{email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <Skeleton className="h-56 rounded-xl" />
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="inst">Institution</Label>
                    <Input
                      id="inst"
                      value={form.institution}
                      onChange={(e) => setForm({ ...form, institution: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="course">Course / programme</Label>
                    <Input
                      id="course"
                      value={form.course}
                      onChange={(e) => setForm({ ...form, course: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sn">Student number</Label>
                    <Input
                      id="sn"
                      value={form.student_number}
                      onChange={(e) => setForm({ ...form, student_number: e.target.value })}
                    />
                  </div>
                </div>
                <Button disabled={save.isPending} onClick={() => save.mutate()}>
                  {save.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  Save changes
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Access</CardTitle>
              <CardDescription>Your role in the system</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {(roles.length ? roles : [role]).map((r) => (
                <Badge key={r} variant="secondary">
                  {ROLE_LABELS[r]}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Internship placement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {internship.isLoading ? (
                <Skeleton className="h-24 rounded-xl" />
              ) : internship.data ? (
                <>
                  <p className="font-medium">{org?.name ?? "Organization pending"}</p>
                  <p className="text-muted-foreground">
                    {internship.data.position || "Position TBC"}
                  </p>
                  <p className="text-muted-foreground">
                    {internship.data.start_date} → {internship.data.end_date}
                  </p>
                  {internship.data.department ? (
                    <p className="text-muted-foreground">Dept: {internship.data.department}</p>
                  ) : null}
                  {org?.contact_person ? (
                    <p className="text-muted-foreground">Contact: {org.contact_person}</p>
                  ) : null}
                  <Badge variant="outline" className="capitalize">
                    {internship.data.status}
                  </Badge>
                </>
              ) : (
                <p className="text-muted-foreground">
                  No internship recorded yet. An administrator will assign your placement.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
