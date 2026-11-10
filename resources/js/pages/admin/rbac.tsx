import { useState, useEffect } from "react";
import { Key, Lock, RefreshCw, Search, Shield, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppUser } from "@/lib/app-user";
import { ROLE_LABELS, ROLE_TIERS, type AppRole } from "@/lib/auth";
import {
  SYSTEM_PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
  getStoredRBAC,
  saveStoredRBAC,
  type RolePermissionsMap,
} from "@/lib/mock-data";

export default function RbacPage() {
  const { role } = useAppUser();
  const [matrix, setMatrix] = useState<RolePermissionsMap>(getStoredRBAC);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const handler = () => setMatrix(getStoredRBAC());
    window.addEventListener("internflow-rbac-change", handler);
    return () => window.removeEventListener("internflow-rbac-change", handler);
  }, []);

  const handleToggle = (targetRole: AppRole, permissionId: string) => {
    setMatrix((prev) => {
      const currentList = prev[targetRole] || [];
      const updated = currentList.includes(permissionId)
        ? currentList.filter((p) => p !== permissionId)
        : [...currentList, permissionId];
      return {
        ...prev,
        [targetRole]: updated,
      };
    });
  };

  const handleSave = () => {
    saveStoredRBAC(matrix);
    toast.success("RBAC Permissions Matrix Saved!", {
      description:
        "Updated access permissions are now enforced in real time across the application.",
    });
  };

  const handleReset = () => {
    setMatrix(DEFAULT_ROLE_PERMISSIONS);
    saveStoredRBAC(DEFAULT_ROLE_PERMISSIONS);
    toast.info("RBAC matrix reset to institutional defaults");
  };

  const filteredPermissions = SYSTEM_PERMISSIONS.filter((p) => {
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.id.toLowerCase().includes(q) ||
        p.label.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 antialiased">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold sm:text-3xl tracking-tight text-foreground">
              Role-Based Access Control (RBAC) Matrix
            </h1>
            <Badge
              variant="outline"
              className="text-xs border-primary/30 text-primary bg-primary/5 font-semibold"
            >
              Access Control
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Configure system permissions, enforce security tiers, and define functional clearances
            across all stakeholder roles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="rounded-xl font-semibold text-xs h-9"
          >
            <RefreshCw className="mr-1.5 size-3.5" />
            Reset Defaults
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="rounded-xl font-semibold text-xs h-9 shadow-xs"
          >
            <ShieldCheck className="mr-1.5 size-4" />
            Save Permissions Matrix
          </Button>
        </div>
      </div>

      {/* ── Role Security Tier Hierarchy ── */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
        {(Object.keys(ROLE_TIERS) as AppRole[]).map((r) => {
          const t = ROLE_TIERS[r];
          const activePermCount = (matrix[r] || []).length;
          return (
            <Card
              key={r}
              className={`border transition-all ${
                r === role ? "border-primary ring-1 ring-primary/40 bg-primary/5" : "bg-card"
              }`}
            >
              <CardContent className="p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground text-xs">{ROLE_LABELS[r]}</span>
                  <Badge variant="outline" className={`text-[10px] ${t.color}`}>
                    Tier {t.tier}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{t.description}</p>
                <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground text-[10px]">Privileges:</span>
                  <span className="font-mono text-[11px] font-semibold text-primary">
                    {activePermCount} / {SYSTEM_PERMISSIONS.length}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Interactive Permissions Matrix Table ── */}
      <Card className="shadow-card border-border/80">
        <CardHeader className="p-5 pb-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search permissions by identifier or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-64 h-9 text-xs">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories ({SYSTEM_PERMISSIONS.length})</SelectItem>
                <SelectItem value="Logbooks & Activity Logging">
                  Logbooks & Activity Logging
                </SelectItem>
                <SelectItem value="Attendance & Verification">Attendance & Verification</SelectItem>
                <SelectItem value="Milestones & Deliverables">Milestones & Deliverables</SelectItem>
                <SelectItem value="Evaluations & Grading">Evaluations & Grading</SelectItem>
                <SelectItem value="Supervisors & Placements">Supervisors & Placements</SelectItem>
                <SelectItem value="RBAC Governance & Access Control">
                  Governance & Access Control
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-2">
          <div className="rounded-xl border border-border/80 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-80">Permission & Scope</TableHead>
                  <TableHead className="text-center">
                    <div>
                      <p className="font-semibold text-xs">Student</p>
                      <span className="text-[10px] text-muted-foreground font-normal">Tier 1</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div>
                      <p className="font-semibold text-xs">Field Supervisor</p>
                      <span className="text-[10px] text-muted-foreground font-normal">Tier 2</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div>
                      <p className="font-semibold text-xs">Host Org Mentor</p>
                      <span className="text-[10px] text-muted-foreground font-normal">Tier 3</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div>
                      <p className="font-semibold text-xs">Uni Admin</p>
                      <span className="text-[10px] text-muted-foreground font-normal">Tier 4</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div>
                      <p className="font-semibold text-xs">System Admin</p>
                      <span className="text-[10px] text-muted-foreground font-normal">Tier 5</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermissions.map((perm) => (
                  <TableRow key={perm.id}>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-primary">
                            {perm.id}
                          </span>
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                            {perm.category.split(" ")[0]}
                          </Badge>
                        </div>
                        <p className="font-semibold text-xs text-foreground mt-0.5">{perm.label}</p>
                        <p className="text-[11px] text-muted-foreground">{perm.description}</p>
                      </div>
                    </TableCell>

                    {(
                      [
                        "student",
                        "supervisor",
                        "org_admin",
                        "uni_admin",
                        "system_admin",
                      ] as AppRole[]
                    ).map((r) => {
                      const isChecked = (matrix[r] || []).includes(perm.id);
                      return (
                        <TableCell key={r} className="text-center">
                          <div className="flex justify-center">
                            <Switch
                              checked={isChecked}
                              onCheckedChange={() => handleToggle(r, perm.id)}
                              aria-label={`Toggle ${perm.id} for ${r}`}
                            />
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
