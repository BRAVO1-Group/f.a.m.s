import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppUser } from "@/lib/app-user";
import { ROLE_LABELS } from "@/lib/auth";
import { DEMO_USERS, internships, organizations } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — InternTrack" },
      { name: "description", content: "Manage your internship profile details and placement." },
      { property: "og:title", content: "My Profile — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { userId, email, role, roles } = useAppUser();
  const demoUser = DEMO_USERS.find((u) => u.id === userId);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: demoUser?.full_name ?? "",
    phone: demoUser?.phone ?? "",
    institution: demoUser?.institution ?? "",
    course: demoUser?.course ?? "",
    student_number: demoUser?.student_number ?? "",
  });

  useEffect(() => {
    if (demoUser) {
      setForm({
        full_name: demoUser.full_name,
        phone: demoUser.phone,
        institution: demoUser.institution,
        course: demoUser.course,
        student_number: demoUser.student_number,
      });
    }
  }, [userId]);

  async function save() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    // Update the in-memory user
    const idx = DEMO_USERS.findIndex((u) => u.id === userId);
    if (idx >= 0) {
      const u = DEMO_USERS[idx]!;
      DEMO_USERS[idx] = {
        id: u.id,
        email: u.email,
        role: u.role,
        roles: u.roles,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        institution: form.institution.trim(),
        course: form.course.trim(),
        student_number: form.student_number.trim(),
      };
    }
    setSaving(false);
    toast.success("Profile updated");
  }

  const myInternship = internships.find((i) => i.student_id === userId);
  const org = myInternship
    ? organizations.find((o) => o.id === myInternship.organization_id)
    : null;

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
            <Button disabled={saving} onClick={save}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save changes
            </Button>
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
              {myInternship ? (
                <>
                  <p className="font-medium">{org?.name ?? "Organization pending"}</p>
                  <p className="text-muted-foreground">{myInternship.position || "Position TBC"}</p>
                  <p className="text-muted-foreground">
                    {myInternship.start_date} → {myInternship.end_date}
                  </p>
                  {myInternship.department ? (
                    <p className="text-muted-foreground">Dept: {myInternship.department}</p>
                  ) : null}
                  {org?.contact_person ? (
                    <p className="text-muted-foreground">Contact: {org.contact_person}</p>
                  ) : null}
                  <Badge variant="outline" className="capitalize">
                    {myInternship.status}
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
