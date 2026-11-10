import { useState, useEffect } from "react";
import {
  Building2,
  Copy,
  GraduationCap,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  type MockSupervisor,
  type SupervisorType,
} from "@/lib/mock-data";

export default function SupervisorsPage() {
  const [supervisorsList, setSupervisorsList] = useState<MockSupervisor[]>(getStoredSupervisors);
  const [filter, setFilter] = useState<"all" | "organization" | "university">("all");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedSupervisorCreds, setSelectedSupervisorCreds] = useState<MockSupervisor | null>(
    null,
  );

  // Form state
  const [supType, setSupType] = useState<SupervisorType>("organization");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [orgOrUni, setOrgOrUni] = useState("TechCorp Kenya Ltd");
  const [deptOrFaculty, setDeptOrFaculty] = useState("Product Engineering");

  useEffect(() => {
    const handler = () => setSupervisorsList(getStoredSupervisors());
    window.addEventListener("internflow-data-change", handler);
    return () => window.removeEventListener("internflow-data-change", handler);
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !title.trim()) {
      toast.error("Please fill in required fields (Name, Email, Title)");
      return;
    }

    addSupervisor({
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || "+254 700 000 000",
      type: supType,
      title: title.trim(),
      organization_name: supType === "organization" ? orgOrUni : "University of Nairobi",
      faculty_department:
        deptOrFaculty.trim() ||
        (supType === "organization" ? "Engineering" : "School of Computing"),
    });

    setSupervisorsList(getStoredSupervisors());
    setCreateOpen(false);

    toast.success(
      supType === "organization"
        ? "Host Organization Mentor created!"
        : "University Academic Supervisor created!",
      {
        description: `${fullName} is now registered in the institutional supervisor directory.`,
      },
    );

    setFullName("");
    setEmail("");
    setPhone("");
    setTitle("");
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
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
            <Building2 className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-foreground">
                Host Organization Field Supervision & University Credentials
              </span>
              <Badge
                variant="outline"
                className="text-[11px] font-medium border-primary/30 text-primary"
              >
                Pre-Provisioned Logins
              </Badge>
              <Badge variant="secondary" className="text-[11px] font-medium">
                Student-Bound Access
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Host Organization Field Supervisors receive login credentials directly from the
              university. When an organization is assigned to an intern, the field supervisor's
              login is automatically linked strictly to that student. Supervisors cannot
              self-register.
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="size-3.5" /> University Provisioned
          </span>
        </div>
      </div>

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold sm:text-3xl tracking-tight text-foreground">
              Supervisor Accounts
            </h1>
            <Badge
              variant="outline"
              className="text-xs border-primary/30 text-primary bg-primary/5 font-semibold"
            >
              Roster Management
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Create and maintain accounts for Host Organization Mentors (field supervisors) and
            University Academic Supervisors.
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          size="sm"
          className="rounded-xl font-semibold text-xs h-9 shrink-0 shadow-xs"
        >
          <UserPlus className="mr-1.5 size-4" />
          Create Supervisor Account
        </Button>
      </div>

      {/* ── Summary Metrics ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Supervisors
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">
              {supervisorsList.length}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Registered mentors & faculty</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Host Org Mentors
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Building2 className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">{orgCount}</p>
            <p className="mt-2 text-xs text-muted-foreground">Field mentors across partner firms</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                University Academic Assessors
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                <GraduationCap className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">{uniCount}</p>
            <p className="mt-2 text-xs text-muted-foreground">Departmental faculty lecturers</p>
          </CardContent>
        </Card>
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
                  className="border-border/80 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-9.5 border">
                          <AvatarFallback
                            className={`text-xs font-semibold ${
                              isOrg
                                ? "bg-amber-500/10 text-amber-700"
                                : "bg-indigo-500/10 text-indigo-700"
                            }`}
                          >
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

                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold shrink-0 ${
                          isOrg
                            ? "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                            : "border-indigo-300 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                        }`}
                      >
                        {isOrg ? "🏢 Host Org" : "🏛️ University"}
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
                        <Mail className="size-3 text-primary shrink-0" />
                        <span className="truncate">{sup.email}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="size-3 text-primary shrink-0" />
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

                      {isOrg && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedSupervisorCreds(sup)}
                          className="h-7 text-[11px] px-2 text-primary hover:bg-primary/10"
                        >
                          <KeyRound className="mr-1 size-3" /> Credentials
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── View Supervisor Credentials Modal ── */}
      <Dialog
        open={!!selectedSupervisorCreds}
        onOpenChange={(open) => !open && setSelectedSupervisorCreds(null)}
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

              <DialogFooter className="pt-2">
                <Button
                  size="sm"
                  onClick={() => {
                    const text = `InternTrack Field Supervisor Login\nSupervisor: ${selectedSupervisorCreds.full_name}\nOrganization: ${selectedSupervisorCreds.organization_name}\nEmail: ${selectedSupervisorCreds.email}\nScope: Bound strictly to assigned candidates.`;
                    navigator.clipboard?.writeText(text);
                    toast.success("Dispatched credentials copied to clipboard!");
                  }}
                  className="w-full text-xs font-semibold"
                >
                  <Copy className="mr-1.5 size-3.5" />
                  Copy Login Details
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Create Supervisor Dialog ── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="size-5 text-primary" />
              Create Supervisor Account
            </DialogTitle>
            <DialogDescription>
              Register an Organization Mentor (field mentor) or University Academic Supervisor
              (faculty lecturer).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Supervisor Role Type *</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={supType === "organization" ? "default" : "outline"}
                  onClick={() => {
                    setSupType("organization");
                    setTitle("Senior Lead Architect & Field Mentor");
                  }}
                  className="h-10 text-xs flex items-center justify-center gap-1.5"
                >
                  <Building2 className="size-4" />
                  Host Org Mentor
                </Button>
                <Button
                  type="button"
                  variant={supType === "university" ? "default" : "outline"}
                  onClick={() => {
                    setSupType("university");
                    setTitle("Senior Lecturer & Academic Assessor");
                  }}
                  className="h-10 text-xs flex items-center justify-center gap-1.5"
                >
                  <GraduationCap className="size-4" />
                  Academic Supervisor
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Full Name *</Label>
              <Input
                placeholder={
                  supType === "organization" ? "e.g. Eng. Kevin Otieno" : "e.g. Dr. Joyce Chelangat"
                }
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Official Email *</Label>
                <Input
                  type="email"
                  placeholder="name@domain.com"
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
              <Label className="text-xs font-semibold">Designation / Title *</Label>
              <Input
                placeholder="e.g. Lead Software Architect / Senior Lecturer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>

            {supType === "organization" ? (
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Host Organization *</Label>
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
            ) : (
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Institution / University</Label>
                <Input value="University of Nairobi" disabled className="h-9 text-xs bg-muted/60" />
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                {supType === "organization" ? "Host Department" : "Faculty / Academic Department"}
              </Label>
              <Input
                placeholder={
                  supType === "organization"
                    ? "e.g. Product Engineering"
                    : "e.g. School of Computing & Informatics"
                }
                value={deptOrFaculty}
                onChange={(e) => setDeptOrFaculty(e.target.value)}
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
                Create & Activate Supervisor
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
