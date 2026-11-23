import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import {
  Building2,
  Copy,
  ExternalLink,
  GraduationCap,
  KeyRound,
  Lock,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  getStoredSupervisors,
  addSupervisor,
  updateSupervisor,
  deleteSupervisor,
  type MockSupervisor,
  type SupervisorType,
} from "@/lib/mock-data";

export default function SupervisorsPage() {
  const [supervisorsList, setSupervisorsList] = useState<MockSupervisor[]>(getStoredSupervisors);
  const [filter, setFilter] = useState<"all" | "organization" | "university">("all");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingSupervisorId, setEditingSupervisorId] = useState<string | null>(null);
  const [deletingSupervisor, setDeletingSupervisor] = useState<MockSupervisor | null>(null);
  const [selectedSupervisorCreds, setSelectedSupervisorCreds] = useState<MockSupervisor | null>(
    null,
  );

  // Form state (Academic Supervisors only create Field Mentor accounts for the organization where the student is placed)
  const [assignedStudentKey, setAssignedStudentKey] = useState("student-1");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("Senior Lead Architect & Field Mentor");
  const [orgOrUni, setOrgOrUni] = useState("TechCorp Kenya Ltd");
  const [deptOrFaculty, setDeptOrFaculty] = useState("Product Engineering");

  const STUDENT_PLACEMENT_ORGS: Record<
    string,
    { studentName: string; regNo: string; company: string; department: string }
  > = {
    "student-1": {
      studentName: "Alice Wanjiku",
      regNo: "CS/2021/0042",
      company: "TechCorp Kenya Ltd",
      department: "Product Engineering",
    },
    "student-2": {
      studentName: "Brian Mwangi",
      regNo: "CS/2021/0088",
      company: "Safaricom PLC",
      department: "Infrastructure & Cloud",
    },
    "student-3": {
      studentName: "Carol Achieng",
      regNo: "CS/2021/0015",
      company: "Kenya Commercial Bank",
      department: "Business Intelligence",
    },
    "student-4": {
      studentName: "Kevin Kiprono",
      regNo: "CS/2021/0104",
      company: "TechCorp Kenya Ltd",
      department: "InfoSec Operations",
    },
  };

  useEffect(() => {
    const handler = () => setSupervisorsList(getStoredSupervisors());
    window.addEventListener("internflow-data-change", handler);
    return () => window.removeEventListener("internflow-data-change", handler);
  }, []);

  const openEditSupervisor = (sup: MockSupervisor) => {
    setEditingSupervisorId(sup.id);
    setFullName(sup.full_name);
    setEmail(sup.email);
    setPhone(sup.phone);
    setTitle(sup.title);
    setOrgOrUni(sup.organization_name || "TechCorp Kenya Ltd");
    setDeptOrFaculty(sup.faculty_department || "Engineering");
    setCreateOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !title.trim()) {
      toast.warning("Empty Form Warning", {
        description: "Please fill in the Field Mentor's Full Name, Official Email, and Job Title.",
      });
      return;
    }

    if (editingSupervisorId) {
      updateSupervisor(editingSupervisorId, {
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || "+254 700 000 000",
        type: "organization",
        title: title.trim(),
        organization_name: orgOrUni,
        faculty_department: deptOrFaculty.trim() || "Engineering",
      });
      setSupervisorsList(getStoredSupervisors());
      setCreateOpen(false);
      setEditingSupervisorId(null);
      toast.success("Field Mentor account updated");
    } else {
      addSupervisor({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || "+254 700 000 000",
        type: "organization",
        title: title.trim(),
        organization_name: orgOrUni,
        faculty_department: deptOrFaculty.trim() || "Engineering",
      });

      setSupervisorsList(getStoredSupervisors());
      setCreateOpen(false);

      const boundStudent = STUDENT_PLACEMENT_ORGS[assignedStudentKey];
      toast.success("Field Mentor Account Created!", {
        description: `${fullName} has been provisioned as a Field Mentor at ${orgOrUni}${
          boundStudent ? ` for ${boundStudent.studentName}` : ""
        }.`,
      });
    }

    setFullName("");
    setEmail("");
    setPhone("");
    setTitle("Senior Lead Architect & Field Mentor");
  };

  const filtered = supervisorsList.filter((s) => {
    if (filter !== "all" && s.type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.full_name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.organization_name && s.organization_name.toLowerCase().includes(q)) ||
        (s.faculty_department && s.faculty_department.toLowerCase().includes(q)) ||
        s.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const orgCount = supervisorsList.filter((s) => s.type === "organization").length;
  const uniCount = supervisorsList.filter((s) => s.type === "university").length;

  return (
    <div className="space-y-6 antialiased">
      {/* ── Host Organization Supervision Model Banner ── */}
      <Card className="rounded-xl border border-border/60 bg-card shadow-none">
        <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-lg border border-border/60 bg-muted p-2 text-foreground shrink-0">
              <Building2 className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-foreground">
                  Host Organization Field Supervision &amp; University Credentials
                </span>
                <Badge variant="secondary" className="text-[11px] font-medium">
                  Pre-Provisioned Logins
                </Badge>
                <Badge variant="outline" className="text-[11px] font-medium">
                  Student-Bound Access
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Host Organization Field Supervisors receive login credentials directly from the
                university. When an organization is assigned to an intern, the field supervisor&apos;s
                login is automatically linked strictly to that student.
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1.5 text-xs font-medium shrink-0">
            <ShieldCheck className="size-3.5" /> University Provisioned
          </Badge>
        </CardContent>
      </Card>

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold sm:text-3xl tracking-tight text-foreground">
              Field Mentor Accounts
            </h1>
            <Badge variant="secondary" className="text-xs font-medium">
              Student Host Organizations
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Academic Supervisors provision Field Mentor accounts strictly for the host organizations where students are placed (peer Academic Supervisor accounts are not created here).
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingSupervisorId(null);
            setCreateOpen(true);
          }}
          size="sm"
          className="rounded-lg font-semibold text-xs h-9 shrink-0"
        >
          <UserPlus className="mr-1.5 size-4" />
          Create Field Mentor Account
        </Button>
      </div>

      {/* ── Summary Metrics ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Total Supervisors"
          value={supervisorsList.length}
          meta="Registered mentors & faculty"
        />
        <KpiCard
          label="Host Org Mentors"
          value={orgCount}
          meta="Field mentors across partner firms"
        />
        <KpiCard
          label="University Academic Assessors"
          value={uniCount}
          meta="Departmental faculty lecturers"
        />
      </div>

      {/* ── Search & Filter Controls ── */}
      <Card className="shadow-card border-border/80">
        <CardHeader className="p-5 pb-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by name, company, or faculty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              <Button
                size="sm"
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className="h-8 text-xs"
              >
                All ({supervisorsList.length})
              </Button>
              <Button
                size="sm"
                variant={filter === "organization" ? "default" : "outline"}
                onClick={() => setFilter("organization")}
                className="h-8 text-xs"
              >
                <Building2 className="mr-1.5 size-3" />
                Host Org ({orgCount})
              </Button>
              <Button
                size="sm"
                variant={filter === "university" ? "default" : "outline"}
                onClick={() => setFilter("university")}
                className="h-8 text-xs"
              >
                <GraduationCap className="mr-1.5 size-3" />
                University ({uniCount})
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-2">
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((sup) => {
              const isOrg = sup.type === "organization";
              return (
                <Card
                  key={sup.id}
                  className="border-border/60 shadow-none transition-colors flex flex-col justify-between"
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-9.5 rounded-lg">
                          <AvatarFallback className="rounded-lg bg-muted text-foreground text-xs font-semibold">
                            {sup.full_name
                              .split(" ")
                              .map((p) => p[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm text-foreground leading-tight">
                            {sup.full_name}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                            {sup.title}
                          </p>
                        </div>
                      </div>

                      <Badge variant="secondary" className="text-[10px] font-medium shrink-0">
                        {isOrg ? "Host Org" : "University"}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground pt-1.5 border-t border-border/50">
                      <p className="text-foreground/90 font-medium line-clamp-1">
                        {isOrg ? sup.organization_name : "University of Nairobi"}
                      </p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {sup.faculty_department}
                      </p>
                    </div>

                    <div className="space-y-1 text-[11px] font-mono text-muted-foreground">
                      <p className="flex items-center gap-1.5">
                        <Mail className="size-3 text-muted-foreground shrink-0" />
                        <span className="truncate">{sup.email}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="size-3 text-muted-foreground shrink-0" />
                        <span>{sup.phone}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[11px] text-muted-foreground block">
                          {isOrg ? "Bound Interns:" : "Assigned Candidates:"}
                        </span>
                        <Badge variant="secondary" className="font-mono text-[10px]">
                          {sup.assigned_student_ids.length > 0
                            ? `${sup.assigned_student_ids.length} student${sup.assigned_student_ids.length > 1 ? "s" : ""}`
                            : "Unassigned"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1">
                        {isOrg && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedSupervisorCreds(sup)}
                            className="h-7 text-[11px] px-2"
                          >
                            <KeyRound className="mr-1 size-3" /> OTP Link
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditSupervisor(sup)}
                          title="Edit Supervisor"
                          className="h-7 w-7 p-0"
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeletingSupervisor(sup)}
                          title="Delete Supervisor"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <EmptyState
              icon={Users}
              title="No Supervisors Found"
              description="No supervisors match your current filter. Click 'Create Supervisor Account' to provision a Field Mentor or Academic Assessor."
              actionLabel="Create Supervisor Account"
              onAction={() => {
                setEditingSupervisorId(null);
                setCreateOpen(true);
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Yes / No Confirmation Dialog for Deleting a Supervisor */}
      <ConfirmDialog
        open={Boolean(deletingSupervisor)}
        onOpenChange={(open) => {
          if (!open) setDeletingSupervisor(null);
        }}
        title="Delete Supervisor Account?"
        description={
          deletingSupervisor ? (
            <>
              Are you sure you want to permanently remove{" "}
              <strong>{deletingSupervisor.full_name}</strong> ({deletingSupervisor.email}) from the
              institutional supervisor directory?
            </>
          ) : (
            ""
          )
        }
        confirmLabel="Yes, Delete Supervisor"
        cancelLabel="No, Keep Account"
        variant="destructive"
        onConfirm={() => {
          if (deletingSupervisor) {
            deleteSupervisor(deletingSupervisor.id);
            setSupervisorsList(getStoredSupervisors());
            toast.success(`Removed ${deletingSupervisor.full_name}`);
            setDeletingSupervisor(null);
          }
        }}
      />

      {/* ── View Supervisor Credentials Modal ── */}
      <Dialog
        open={!!selectedSupervisorCreds}
        onOpenChange={(open: null) => !open && setSelectedSupervisorCreds(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="size-5 text-primary" />
              University-Dispatched Supervisor Credentials
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed">
              Pre-provisioned corporate logins issued by University of Nairobi to the employer field
              mentor.
            </DialogDescription>
          </DialogHeader>

          {selectedSupervisorCreds && (
            <div className="space-y-3.5 py-2 text-xs">
              <div className="rounded-lg bg-muted/50 p-3 space-y-1.5 border border-border/60">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Field Supervisor:</span>
                  <span className="font-bold text-foreground">
                    {selectedSupervisorCreds.full_name}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Host Organization:</span>
                  <span className="font-semibold text-foreground">
                    {selectedSupervisorCreds.organization_name}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Department:</span>
                  <span>{selectedSupervisorCreds.faculty_department}</span>
                </div>
              </div>

              <div className="space-y-2 border rounded-lg p-3 bg-card border-border">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-foreground">
                    Authentication Record
                  </span>
                  <Badge
                    variant="outline"
                    className="border-emerald-300 text-emerald-700 bg-emerald-50 text-[10px]"
                  >
                    Pre-Provisioned • Active
                  </Badge>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">
                    Corporate Login Email:
                  </span>
                  <span className="font-mono font-medium text-primary">
                    {selectedSupervisorCreds.email}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">
                    Dispatched Initial Token:
                  </span>
                  <span className="font-mono text-muted-foreground">Attach2026!TechCorp#Kenya</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2">
                <Lock className="size-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Student-Bound Access:</strong> When this mentor logs in, their dashboard
                  and review queue are strictly scoped to their assigned student interns (
                  <strong>
                    {selectedSupervisorCreds.assigned_student_ids.length > 0
                      ? "Alice Wanjiku & Kevin Kiprono"
                      : "Pending placement pairing"}
                  </strong>
                  ). Self-registration is restricted.
                </span>
              </div>

              <DialogFooter className="pt-2 flex-col sm:flex-row gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const otpLink = `${window.location.origin}/mentor-onboard?student=Alice+Wanjiku&reg=CS/2021/0042&company=${encodeURIComponent(selectedSupervisorCreds.organization_name || "TechCorp Solutions")}&mentor=${encodeURIComponent(selectedSupervisorCreds.full_name)}&email=${encodeURIComponent(selectedSupervisorCreds.email)}&otp=OTP-849201`;
                    navigator.clipboard?.writeText(otpLink);
                    toast.success("Special Field Mentor OTP Onboarding Link copied!");
                  }}
                  className="flex-1 text-xs font-semibold"
                >
                  <Copy className="mr-1.5 size-3.5" />
                  Copy OTP Link
                </Button>
                <Button asChild size="sm" className="flex-1 text-xs font-semibold">
                  <Link
                    href={`/mentor-onboard?student=Alice+Wanjiku&reg=CS/2021/0042&company=${encodeURIComponent(selectedSupervisorCreds.organization_name || "TechCorp Solutions")}&mentor=${encodeURIComponent(selectedSupervisorCreds.full_name)}&email=${encodeURIComponent(selectedSupervisorCreds.email)}&otp=OTP-849201`}
                  >
                    <span>Open Mentor OTP Link</span>
                    <ExternalLink className="ml-1.5 size-3.5" />
                  </Link>
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Create Field Mentor Dialog (Strictly for the Host Organization Where the Student Is Placed) ── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="size-5 text-primary" />
              {editingSupervisorId ? "Update Field Mentor Account" : "Create Field Mentor Account"}
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed">
              Academic Supervisors do not create accounts for peer Academic Supervisors. Provision a Field Mentor account strictly for the host organization where the student is placed.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 py-2">
            {/* Select Student & Auto-Bind Their Host Organization */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Placed Student Intern *</Label>
              <Select
                value={assignedStudentKey}
                onValueChange={(val) => {
                  setAssignedStudentKey(val);
                  const info = STUDENT_PLACEMENT_ORGS[val];
                  if (info) {
                    setOrgOrUni(info.company);
                    setDeptOrFaculty(info.department);
                  }
                }}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select placed student" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STUDENT_PLACEMENT_ORGS).map(([id, info]) => (
                    <SelectItem key={id} value={id}>
                      {info.studentName} ({info.regNo}) · {info.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Student&apos;s Host Organization *</Label>
                <Select value={orgOrUni} onValueChange={setOrgOrUni}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TechCorp Kenya Ltd">TechCorp Kenya Ltd</SelectItem>
                    <SelectItem value="Safaricom PLC">Safaricom PLC</SelectItem>
                    <SelectItem value="Kenya Commercial Bank">Kenya Commercial Bank</SelectItem>
                    <SelectItem value="Apex Telecom Solutions">Apex Telecom Solutions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Host Department *</Label>
                <Input
                  placeholder="e.g. Product Engineering"
                  value={deptOrFaculty}
                  onChange={(e) => setDeptOrFaculty(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Field Mentor Full Name *</Label>
              <Input
                placeholder="e.g. Eng. Kevin Otieno"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Field Mentor Official Email *</Label>
                <Input
                  type="email"
                  placeholder="mentor@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Phone Number</Label>
                <Input
                  placeholder="+254 700 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Workplace Designation / Title *</Label>
              <Input
                placeholder="e.g. Senior Lead Architect & Field Mentor"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                {editingSupervisorId ? "Save Field Mentor" : "Create Field Mentor Account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
