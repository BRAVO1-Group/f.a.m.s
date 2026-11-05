import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  GraduationCap,
  Mail,
  Phone,
  Plus,
  Search,
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

export const Route = createFileRoute("/_authenticated/supervisors")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Supervisor Accounts — InternTrack" },
      {
        name: "description",
        content: "Create and manage host organization mentors and university academic supervisors.",
      },
      { property: "og:title", content: "Supervisor Accounts — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SupervisorsPage,
});

export function SupervisorsPage() {
  const [supervisorsList, setSupervisorsList] = useState<MockSupervisor[]>(getStoredSupervisors);
  const [filter, setFilter] = useState<"all" | "organization" | "university">("all");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

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
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-hero p-6 sm:p-8 text-primary-foreground shadow-elevated">
        <div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-white/30 bg-white/10 text-white text-xs font-semibold"
            >
              Institutional Roster
            </Badge>
            <span className="text-xs text-primary-foreground/75">
              Dual-Track Supervision Directory
            </span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl tracking-tight">
            Supervisor Account Management
          </h1>
          <p className="mt-1 text-sm text-primary-foreground/80 max-w-2xl">
            Create and maintain accounts for both Host Organization Mentors (field supervisors) and
            University Academic Supervisors (faculty assessors).
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          className="rounded-xl bg-white text-primary hover:bg-white/90 font-semibold text-xs shadow-sm h-9 shrink-0"
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
                      <span className="text-[11px] text-muted-foreground">
                        Assigned Candidates:
                      </span>
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        {sup.assigned_student_ids.length} interns
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

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
