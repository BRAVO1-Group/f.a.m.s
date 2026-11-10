import { useState } from "react";
import { Building2, Loader2, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  activities,
  internships,
  organizations,
  profiles,
  userRoles,
  uid,
  type MockOrganization,
  type MockInternship,
} from "@/lib/mock-data";

export default function AdminPage() {
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate((n) => n + 1);

  const [orgOpen, setOrgOpen] = useState(false);
  const [placeOpen, setPlaceOpen] = useState(false);
  const [savingOrg, setSavingOrg] = useState(false);
  const [savingPlace, setSavingPlace] = useState(false);
  const [org, setOrg] = useState<Omit<MockOrganization, "id">>({
    name: "",
    industry: "",
    address: "",
    contact_person: "",
    contact_email: "",
  });
  const [place, setPlace] = useState<Omit<MockInternship, "id" | "status">>({
    student_id: "",
    organization_id: "",
    supervisor_id: "",
    position: "",
    department: "",
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
    required_days: 60,
  });

  const people = profiles.map((p) => ({
    ...p,
    roles: userRoles.filter((r) => r.user_id === p.id).map((r) => r.role as string),
  }));

  const students = people.filter((p) => p.roles.includes("student"));
  const supervisors = people.filter((p) => p.roles.includes("supervisor"));

  const nameOf = (id: string | null) => {
    if (!id) return "—";
    const p = people.find((x) => x.id === id);
    return p?.full_name || p?.email || "Unknown";
  };

  const orgNameOf = (id: string) => organizations.find((o) => o.id === id)?.name ?? "—";

  async function createOrg() {
    if (!org.name.trim()) return;
    setSavingOrg(true);
    await new Promise((r) => setTimeout(r, 600));
    organizations.push({ id: uid(), ...org });
    setSavingOrg(false);
    setOrgOpen(false);
    setOrg({ name: "", industry: "", address: "", contact_person: "", contact_email: "" });
    refresh();
    toast.success("Organization added");
  }

  async function createPlacement() {
    if (!place.student_id) return;
    setSavingPlace(true);
    await new Promise((r) => setTimeout(r, 600));
    internships.push({ id: uid(), status: "active", ...place });
    setSavingPlace(false);
    setPlaceOpen(false);
    refresh();
    toast.success("Placement created");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Administration</h1>
        <p className="text-sm text-muted-foreground">
          Manage people, host organizations and internship placements.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Students" value={students.length} />
        <Stat label="Supervisors" value={supervisors.length} />
        <Stat label="Organizations" value={organizations.length} />
        <Stat
          label="Active placements"
          value={internships.filter((i) => i.status === "active").length}
        />
      </div>

      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="orgs">Organizations</TabsTrigger>
          <TabsTrigger value="placements">Placements</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-4" /> Students &amp; participation
              </CardTitle>
              <CardDescription>Students with no approved entries need follow-up.</CardDescription>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No students yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Institution</TableHead>
                        <TableHead className="text-right">Entries</TableHead>
                        <TableHead className="text-right">Approved</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((s) => {
                        const mine = activities.filter((c) => c.student_id === s.id);
                        const ok = mine.filter((c) => c.status === "approved").length;
                        return (
                          <TableRow key={s.id}>
                            <TableCell className="font-medium">
                              {s.full_name || s.email}
                              <div className="text-xs text-muted-foreground">{s.email}</div>
                            </TableCell>
                            <TableCell>{s.institution || "—"}</TableCell>
                            <TableCell className="text-right">{mine.length}</TableCell>
                            <TableCell className="text-right">{ok}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant={mine.length === 0 ? "destructive" : "secondary"}>
                                {mine.length === 0 ? "Inactive" : "Active"}
                              </Badge>
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
        </TabsContent>

        <TabsContent value="orgs" className="mt-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="size-4" /> Host organizations
                </CardTitle>
              </div>
              <Button size="sm" onClick={() => setOrgOpen(true)}>
                <Plus className="size-4" /> Add
              </Button>
            </CardHeader>
            <CardContent>
              {organizations.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No organizations yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>Contact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {organizations.map((o) => (
                        <TableRow key={o.id}>
                          <TableCell className="font-medium">{o.name}</TableCell>
                          <TableCell>{o.industry || "—"}</TableCell>
                          <TableCell>
                            {o.contact_person || "—"}
                            <div className="text-xs text-muted-foreground">{o.contact_email}</div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="placements" className="mt-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-base">Internship placements</CardTitle>
              <Button size="sm" onClick={() => setPlaceOpen(true)}>
                <Plus className="size-4" /> New placement
              </Button>
            </CardHeader>
            <CardContent>
              {internships.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No placements yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Supervisor</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {internships.map((i) => (
                        <TableRow key={i.id}>
                          <TableCell className="font-medium">{nameOf(i.student_id)}</TableCell>
                          <TableCell>{orgNameOf(i.organization_id)}</TableCell>
                          <TableCell>{nameOf(i.supervisor_id)}</TableCell>
                          <TableCell className="whitespace-nowrap text-xs">
                            {i.start_date} → {i.end_date}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary" className="capitalize">
                              {i.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Organization dialog */}
      <Dialog open={orgOpen} onOpenChange={setOrgOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add organization</DialogTitle>
            <DialogDescription>Register a company that hosts interns.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" value={org.name} onChange={(v) => setOrg({ ...org, name: v })} />
            <Field
              label="Industry"
              value={org.industry}
              onChange={(v) => setOrg({ ...org, industry: v })}
            />
            <Field
              label="Address"
              value={org.address}
              onChange={(v) => setOrg({ ...org, address: v })}
            />
            <Field
              label="Contact person"
              value={org.contact_person}
              onChange={(v) => setOrg({ ...org, contact_person: v })}
            />
            <Field
              label="Contact email"
              value={org.contact_email}
              onChange={(v) => setOrg({ ...org, contact_email: v })}
            />
          </div>
          <DialogFooter>
            <Button disabled={savingOrg || !org.name.trim()} onClick={createOrg}>
              {savingOrg ? <Loader2 className="size-4 animate-spin" /> : null} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Placement dialog */}
      <Dialog open={placeOpen} onOpenChange={setPlaceOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New placement</DialogTitle>
            <DialogDescription>
              Assign a student to an organization and supervisor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Student</Label>
              <Select
                value={place.student_id}
                onValueChange={(v) => setPlace({ ...place, student_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.full_name || s.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Organization</Label>
              <Select
                value={place.organization_id}
                onValueChange={(v) => setPlace({ ...place, organization_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Supervisor</Label>
              <Select
                value={place.supervisor_id}
                onValueChange={(v) => setPlace({ ...place, supervisor_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {supervisors.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.full_name || s.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Field
              label="Position"
              value={place.position}
              onChange={(v) => setPlace({ ...place, position: v })}
            />
            <div className="space-y-1.5">
              <Label>Required days</Label>
              <Input
                type="number"
                value={place.required_days}
                onChange={(e) => setPlace({ ...place, required_days: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Start date</Label>
              <Input
                type="date"
                value={place.start_date}
                onChange={(e) => setPlace({ ...place, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>End date</Label>
              <Input
                type="date"
                value={place.end_date}
                onChange={(e) => setPlace({ ...place, end_date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={savingPlace || !place.student_id} onClick={createPlacement}>
              {savingPlace ? <Loader2 className="size-4 animate-spin" /> : null} Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
