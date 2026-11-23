import { useState } from "react";
import { Building2, Loader2, Pencil, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
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
  profiles,
  userRoles,
  uid,
  getStoredOrganizations,
  saveStoredOrganizations,
  getStoredInternships,
  saveStoredInternships,
  type MockOrganization,
  type MockInternship,
} from "@/lib/mock-data";

export default function AdminPage() {
  const [orgsList, setOrgsList] = useState<MockOrganization[]>(getStoredOrganizations);
  const [placementsList, setPlacementsList] = useState<MockInternship[]>(getStoredInternships);

  const [orgOpen, setOrgOpen] = useState(false);
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);
  const [deletingOrg, setDeletingOrg] = useState<MockOrganization | null>(null);

  const [placeOpen, setPlaceOpen] = useState(false);
  const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);
  const [deletingPlace, setDeletingPlace] = useState<MockInternship | null>(null);

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

  const orgNameOf = (id: string) => orgsList.find((o) => o.id === id)?.name ?? "—";

  function openEditOrg(item: MockOrganization) {
    setEditingOrgId(item.id);
    setOrg({
      name: item.name,
      industry: item.industry,
      address: item.address,
      contact_person: item.contact_person,
      contact_email: item.contact_email,
    });
    setOrgOpen(true);
  }

  async function createOrg() {
    if (!org.name.trim() || !org.industry.trim() || !org.contact_email.trim()) {
      toast.warning("Empty Form Warning", {
        description: "Please fill in the Organization Name, Industry, and Contact Email.",
      });
      return;
    }
    setSavingOrg(true);
    await new Promise((r) => setTimeout(r, 400));

    if (editingOrgId) {
      const updated = orgsList.map((o) =>
        o.id === editingOrgId ? { ...o, ...org } : o,
      );
      setOrgsList(updated);
      saveStoredOrganizations(updated);
      setEditingOrgId(null);
      toast.success("Organization updated");
    } else {
      const newOrg: MockOrganization = { id: uid(), ...org };
      const updated = [newOrg, ...orgsList];
      setOrgsList(updated);
      saveStoredOrganizations(updated);
      toast.success("Organization added");
    }

    setSavingOrg(false);
    setOrgOpen(false);
    setOrg({ name: "", industry: "", address: "", contact_person: "", contact_email: "" });
  }

  function openEditPlacement(item: MockInternship) {
    setEditingPlaceId(item.id);
    setPlace({
      student_id: item.student_id,
      organization_id: item.organization_id,
      supervisor_id: item.supervisor_id ?? "",
      position: item.position ?? "",
      department: item.department ?? "",
      start_date: item.start_date,
      end_date: item.end_date,
      required_days: item.required_days ?? 60,
    });
    setPlaceOpen(true);
  }

  async function createPlacement() {
    if (!place.student_id || !place.organization_id || !place.position.trim()) {
      toast.warning("Empty Form Warning", {
        description: "Please select a Student, Host Organization, and enter the Internship Position.",
      });
      return;
    }
    setSavingPlace(true);
    await new Promise((r) => setTimeout(r, 400));

    if (editingPlaceId) {
      const updated = placementsList.map((i) =>
        i.id === editingPlaceId ? { ...i, ...place } : i,
      );
      setPlacementsList(updated);
      saveStoredInternships(updated);
      setEditingPlaceId(null);
      toast.success("Placement updated");
    } else {
      const newPlacement: MockInternship = { id: uid(), status: "active", ...place };
      const updated = [newPlacement, ...placementsList];
      setPlacementsList(updated);
      saveStoredInternships(updated);
      toast.success("Placement created");
    }

    setSavingPlace(false);
    setPlaceOpen(false);
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
        <Stat label="Organizations" value={orgsList.length} />
        <Stat
          label="Active placements"
          value={placementsList.filter((i) => i.status === "active").length}
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
              <Button
                size="sm"
                onClick={() => {
                  setEditingOrgId(null);
                  setOrg({ name: "", industry: "", address: "", contact_person: "", contact_email: "" });
                  setOrgOpen(true);
                }}
              >
                <Plus className="size-4" /> Add
              </Button>
            </CardHeader>
            <CardContent>
              {orgsList.length === 0 ? (
                <EmptyState
                  icon={Building2}
                  title="No Host Organizations Registered"
                  description="Add partner companies that host student interns."
                  actionLabel="Add Organization"
                  onAction={() => setOrgOpen(true)}
                />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orgsList.map((o) => (
                        <TableRow key={o.id}>
                          <TableCell className="font-medium">{o.name}</TableCell>
                          <TableCell>{o.industry || "—"}</TableCell>
                          <TableCell>
                            {o.contact_person || "—"}
                            <div className="text-xs text-muted-foreground">{o.contact_email}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditOrg(o)}
                                className="h-7 w-7 p-0"
                                title="Edit Organization"
                              >
                                <Pencil className="size-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDeletingOrg(o)}
                                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                title="Delete Organization"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
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
              <Button
                size="sm"
                onClick={() => {
                  setEditingPlaceId(null);
                  setPlaceOpen(true);
                }}
              >
                <Plus className="size-4" /> New placement
              </Button>
            </CardHeader>
            <CardContent>
              {placementsList.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No Internship Placements Recorded"
                  description="Click 'New placement' to assign a student to a host organization and supervisor."
                  actionLabel="Create Placement"
                  onAction={() => setPlaceOpen(true)}
                />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Supervisor</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {placementsList.map((i) => (
                        <TableRow key={i.id}>
                          <TableCell className="font-medium">{nameOf(i.student_id)}</TableCell>
                          <TableCell>{orgNameOf(i.organization_id)}</TableCell>
                          <TableCell>{nameOf(i.supervisor_id)}</TableCell>
                          <TableCell className="whitespace-nowrap text-xs">
                            {i.start_date} → {i.end_date}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {i.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditPlacement(i)}
                                className="h-7 w-7 p-0"
                                title="Edit Placement"
                              >
                                <Pencil className="size-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDeletingPlace(i)}
                                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                title="Delete Placement"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
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

      {/* Yes / No Confirmation Dialogs for Deleting Organization or Placement */}
      <ConfirmDialog
        open={Boolean(deletingOrg)}
        onOpenChange={(v) => {
          if (!v) setDeletingOrg(null);
        }}
        title="Delete Host Organization?"
        description={
          deletingOrg
            ? `Are you sure you want to delete "${deletingOrg.name}" from the host organizations directory?`
            : ""
        }
        confirmLabel="Yes, Delete Organization"
        cancelLabel="No, Keep It"
        variant="destructive"
        onConfirm={() => {
          if (deletingOrg) {
            const updated = orgsList.filter((o) => o.id !== deletingOrg.id);
            setOrgsList(updated);
            saveStoredOrganizations(updated);
            setDeletingOrg(null);
            toast.success("Organization deleted");
          }
        }}
      />

      <ConfirmDialog
        open={Boolean(deletingPlace)}
        onOpenChange={(v) => {
          if (!v) setDeletingPlace(null);
        }}
        title="Delete Internship Placement Record?"
        description="Are you sure you want to permanently remove this student placement record?"
        confirmLabel="Yes, Delete Placement"
        cancelLabel="No, Cancel"
        variant="destructive"
        onConfirm={() => {
          if (deletingPlace) {
            const updated = placementsList.filter((p) => p.id !== deletingPlace.id);
            setPlacementsList(updated);
            saveStoredInternships(updated);
            setDeletingPlace(null);
            toast.success("Placement deleted");
          }
        }}
      />

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
                onValueChange={(v: string) => setPlace({ ...place, student_id: v })}
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
                onValueChange={(v: string) => setPlace({ ...place, organization_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {orgsList.map((o) => (
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
                onValueChange={(v: string) => setPlace({ ...place, supervisor_id: v })}
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
