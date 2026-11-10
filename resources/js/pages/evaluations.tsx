import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Award, CheckCircle2, FileCheck, Star, Users } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppUser } from "@/lib/app-user";
import { evaluations as initialEvaluations, type MockEvaluation } from "@/lib/mock-data";

export default function EvaluationsPage() {
  const { name } = useAppUser();
  const [evalList, setEvalList] = useState<MockEvaluation[]>(initialEvaluations);
  const [evalOpen, setEvalOpen] = useState(false);

  // Form state
  const [studentId, setStudentId] = useState("student-1");
  const [period, setPeriod] = useState<"Mid-Term" | "Final Assessment">("Mid-Term");
  const [technical, setTechnical] = useState("5");
  const [punctuality, setPunctuality] = useState("5");
  const [communication, setCommunication] = useState("4");
  const [problemSolving, setProblemSolving] = useState("5");
  const [recommendation, setRecommendation] = useState<
    "full_time_offer" | "commendation" | "satisfactory" | "needs_improvement"
  >("full_time_offer");
  const [comments, setComments] = useState("");

  const universityCohort = [
    { studentId: "student-1", name: "Alice Wanjiku", regNo: "CS/2021/0042", company: "TechCorp" },
    { studentId: "student-2", name: "Brian Mwangi", regNo: "CS/2021/0088", company: "Safaricom" },
    { studentId: "student-3", name: "Carol Achieng", regNo: "CS/2021/0015", company: "KCB" },
    { studentId: "student-4", name: "Kevin Kiprono", regNo: "CS/2021/0104", company: "TechCorp" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = Number(technical);
    const p = Number(punctuality);
    const c = Number(communication);
    const ps = Number(problemSolving);
    const score = Number(((t + p + c + ps) / 4).toFixed(1));

    let letter = "A (Distinction)";
    if (score < 3.0) letter = "C (Pass)";
    else if (score < 4.0) letter = "B (Credit)";
    else if (score < 4.5) letter = "B+ (Very Good)";

    const targetStudent = universityCohort.find((s) => s.studentId === studentId);

    const newEval: MockEvaluation = {
      id: `eval-${Date.now()}`,
      student_id: studentId,
      supervisor_id: "supervisor-1",
      internship_id: "intern-1",
      evaluation_date: new Date().toISOString().slice(0, 10),
      period,
      ratings: {
        technical: t,
        punctuality: p,
        communication: c,
        problem_solving: ps,
      },
      overall_score: score,
      grade: letter,
      recommendation,
      comments: comments || "Student demonstrated exemplary performance and commitment.",
      supervisor_name: name || "James Otieno",
    };

    setEvalList([newEval, ...evalList]);
    setEvalOpen(false);
    toast.success("Performance evaluation recorded!", {
      description: `${period} grade of ${letter} signed off for ${targetStudent?.name ?? "student"}.`,
    });
  };

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
              Academic & Field Rubrics
            </Badge>
            <span className="text-xs text-primary-foreground/75">
              Standardized Evaluation System
            </span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl tracking-tight">
            Performance Evaluations & Grading
          </h1>
          <p className="mt-1 text-sm text-primary-foreground/80 max-w-2xl">
            Conduct verified mid-term reviews and final exit assessments with comprehensive
            technical and behavioral grading rubrics.
          </p>
        </div>

        <Button
          onClick={() => setEvalOpen(true)}
          className="rounded-xl bg-white text-primary hover:bg-white/90 font-semibold text-xs shadow-sm h-9 shrink-0"
        >
          <Award className="mr-1.5 size-4" />
          Conduct New Evaluation
        </Button>
      </div>

      {/* ── Metrics ── */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Evaluations
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileCheck className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">{evalList.length}</p>
            <p className="mt-2 text-xs text-muted-foreground">Signed assessments on file</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Average Overall Score
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-success/10 text-success">
                <Star className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">4.8 / 5.0</p>
            <p className="mt-2 text-xs text-success font-medium">Distinction-tier performance</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Job Offer Endorsements
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Award className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">
              {evalList.filter((e) => e.recommendation === "full_time_offer").length}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Full-time conversion recommended</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Defense Ready
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                <Users className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">3 of 4</p>
            <p className="mt-2 text-xs text-muted-foreground">Graduation clearance unlocked</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Evaluations Table ── */}
      <Card className="shadow-card border-border/80">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Official Assessment Records</CardTitle>
          <CardDescription>
            Historical mid-term and final performance rubrics certified by appointed supervisors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Assessment Period</TableHead>
                <TableHead>Evaluator</TableHead>
                <TableHead>Rubric Ratings</TableHead>
                <TableHead>Grade & Score</TableHead>
                <TableHead>Recommendation</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evalList.map((item) => {
                const s = universityCohort.find((c) => c.studentId === item.student_id);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold text-foreground">
                      <div>
                        <p>{s?.name ?? "Alice Wanjiku"}</p>
                        <p className="text-[11px] font-mono text-muted-foreground">
                          {s?.regNo ?? "CS/2021/0042"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-semibold">
                        {item.period}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {item.supervisor_name}
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      Tech: {item.ratings.technical}/5 • Punct: {item.ratings.punctuality}/5
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-xs text-foreground">{item.grade}</p>
                        <p className="text-[11px] font-mono text-muted-foreground">
                          {item.overall_score} / 5.0
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.recommendation === "full_time_offer"
                            ? "default"
                            : item.recommendation === "commendation"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs capitalize"
                      >
                        {item.recommendation.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono text-muted-foreground">
                      {item.evaluation_date}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Conduct Evaluation Dialog ── */}
      <Dialog open={evalOpen} onOpenChange={setEvalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="size-5 text-primary" />
              Conduct Performance Evaluation
            </DialogTitle>
            <DialogDescription>
              Complete the standardized attachment assessment rubric. Grades are permanently
              recorded in the accreditation dossier.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Candidate *</Label>
                <Select value={studentId} onValueChange={setStudentId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {universityCohort.map((s) => (
                      <SelectItem key={s.studentId} value={s.studentId}>
                        {s.name} ({s.regNo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Period *</Label>
                <Select
                  value={period}
                  onValueChange={(v) => setPeriod(v as "Mid-Term" | "Final Assessment")}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mid-Term">Mid-Term Assessment</SelectItem>
                    <SelectItem value="Final Assessment">Final Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/50">
              <Label className="text-xs font-semibold">Competency Rubric (1 - 5 Stars):</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground block">
                    Technical Skills & Output
                  </span>
                  <Select value={technical} onValueChange={setTechnical}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 - Exceptional (Distinction)</SelectItem>
                      <SelectItem value="4">4 - Very Good</SelectItem>
                      <SelectItem value="3">3 - Satisfactory</SelectItem>
                      <SelectItem value="2">2 - Needs Guidance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground block">
                    Punctuality & Attendance
                  </span>
                  <Select value={punctuality} onValueChange={setPunctuality}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 - Always On Time</SelectItem>
                      <SelectItem value="4">4 - Reliable</SelectItem>
                      <SelectItem value="3">3 - Acceptable</SelectItem>
                      <SelectItem value="2">2 - Irregular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground block">
                    Communication & Teamwork
                  </span>
                  <Select value={communication} onValueChange={setCommunication}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 - Excellent Collaborator</SelectItem>
                      <SelectItem value="4">4 - Good Communicator</SelectItem>
                      <SelectItem value="3">3 - Adequate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground block">
                    Problem Solving & Initiative
                  </span>
                  <Select value={problemSolving} onValueChange={setProblemSolving}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 - Highly Self-Directed</SelectItem>
                      <SelectItem value="4">4 - Solves Challenges</SelectItem>
                      <SelectItem value="3">3 - Capable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Official Recommendation *</Label>
              <Select
                value={recommendation}
                onValueChange={(v) =>
                  setRecommendation(
                    v as "full_time_offer" | "commendation" | "satisfactory" | "needs_improvement",
                  )
                }
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time_offer">Full-Time Conversion Offer</SelectItem>
                  <SelectItem value="commendation">Faculty Commendation</SelectItem>
                  <SelectItem value="satisfactory">Satisfactory Completion</SelectItem>
                  <SelectItem value="needs_improvement">Requires Additional Weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Supervisor Feedback & Comments</Label>
              <Textarea
                placeholder="Provide detailed feedback on student strengths and areas of growth..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="h-20 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEvalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Submit & Sign Evaluation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
