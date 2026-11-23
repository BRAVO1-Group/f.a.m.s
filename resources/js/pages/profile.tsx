import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import {
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  GraduationCap,
  LifeBuoy,
  Loader2,
  Mail,
  MapPin,
  MessageSquarePlus,
  Phone,
  Save,
  Send,
  User as UserIcon,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppUser } from "@/lib/app-user";
import { ROLE_LABELS } from "@/lib/auth";
import { DEMO_USERS, internships, organizations, uid } from "@/lib/mock-data";

type ServerPlacementProps = {
  studentProfile?: {
    reg_no?: string;
    phone?: string;
    university?: { name?: string };
    department?: { name?: string };
    program?: { name?: string };
  } | null;
  activePlacement?: {
    status?: string;
    start_date?: string;
    end_date?: string;
    organization?: {
      name?: string;
      industry?: string;
      address?: string;
      email?: string;
      phone?: string;
    } | null;
    supervisor?: {
      job_title?: string;
      phone?: string;
      user?: {
        name?: string;
        email?: string;
      } | null;
    } | null;
  } | null;
};

type InquiryTicket = {
  id: string;
  ticketNo: string;
  studentId: string;
  recipient: string;
  category: string;
  priority: "normal" | "urgent";
  subject: string;
  message: string;
  status: "open" | "responded" | "resolved";
  createdAt: string;
  response?: string;
};

const INQUIRIES_STORAGE_KEY = "interntrack_support_inquiries_v1";

const INITIAL_INQUIRIES: InquiryTicket[] = [
  {
    id: "inq-1",
    ticketNo: "INQ-1042",
    studentId: "user-student-1",
    recipient: "Academic Supervisor — Dr. Sarah Namukasa",
    category: "Site Visit & Assessment",
    priority: "normal",
    subject: "Confirmation of Mid-Placement Academic Assessment Visit",
    message:
      "Good morning Dr. Namukasa, our host organization supervisor at TechCorp confirmed availability next Tuesday at 10:00 AM for your academic assessment visit.",
    status: "responded",
    createdAt: "2026-11-20 14:20",
    response:
      "Thank you Alice. I have scheduled the on-site academic evaluation for Tuesday at 10:00 AM. Ensure your Weeks 1–4 logbook entries are signed off by your field mentor.",
  },
  {
    id: "inq-2",
    ticketNo: "INQ-1049",
    studentId: "user-student-1",
    recipient: "Field Supervisor — Eng. James Otieno",
    category: "Logbook Approval / Revision",
    priority: "normal",
    subject: "Week 4 REST API logbook entry updated for sign-off",
    message:
      "Hello Eng. Otieno, I attached the Postman test logs and database schema notes to my Thursday logbook entry for your verification.",
    status: "responded",
    createdAt: "2026-11-22 09:45",
    response:
      "Reviewed and approved! Great attention to detail on the API error handling documentation.",
  },
];

function getStoredInquiries(): InquiryTicket[] {
  try {
    const raw = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    if (!raw) return INITIAL_INQUIRIES;
    return JSON.parse(raw) as InquiryTicket[];
  } catch {
    return INITIAL_INQUIRIES;
  }
}

function saveStoredInquiries(items: InquiryTicket[]) {
  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}

export default function ProfilePage() {
  const { userId, name, email, role, roles } = useAppUser();
  const { props } = usePage<ServerPlacementProps>();
  const demoUser = DEMO_USERS.find((u) => u.id === userId || u.email === email);

  const myInternship =
    internships.find((i) => i.student_id === userId) ?? internships[0];
  const mockOrg = myInternship
    ? organizations.find((o) => o.id === myInternship.organization_id)
    : organizations[0];

  // Resolved Host Company where the student is working
  const hostCompany = {
    name:
      props.activePlacement?.organization?.name ??
      mockOrg?.name ??
      "TechCorp Solutions Uganda Ltd",
    industry:
      props.activePlacement?.organization?.industry ??
      mockOrg?.industry ??
      "Enterprise Software & Cloud Infrastructure",
    location:
      props.activePlacement?.organization?.address ??
      mockOrg?.location ??
      "Plot 24 Kampala Road, Innovation Tower, Kampala",
    department: "Platform Engineering & Digital Systems",
    roleTitle: myInternship?.title ?? "Software Engineering Intern",
    startDate:
      props.activePlacement?.start_date?.slice(0, 10) ??
      myInternship?.start_date ??
      "2026-09-01",
    endDate:
      props.activePlacement?.end_date?.slice(0, 10) ??
      myInternship?.end_date ??
      "2026-12-15",
    status: props.activePlacement?.status ?? myInternship?.status ?? "active",
  };

  // Resolved Assigned University Academic Supervisor
  const academicSupervisor = {
    name: "Dr. Sarah Namukasa",
    title: "Senior Lecturer & Faculty Academic Assessor",
    department:
      props.studentProfile?.department?.name ??
      "Department of Networks & Software Engineering",
    university:
      props.studentProfile?.university?.name ??
      demoUser?.institution ??
      "Makerere University",
    email: "s.namukasa@cit.mak.ac.ug",
    phone: "+256 772 418 902",
    office: "Block B, Room 304 · College of Computing & IS",
    visitStatus: "Mid-Term Visit Scheduled",
  };

  // Resolved Assigned Host Organization Field Supervisor
  const fieldSupervisor = {
    name:
      props.activePlacement?.supervisor?.user?.name ??
      "Eng. James Otieno",
    title:
      props.activePlacement?.supervisor?.job_title ??
      "Lead Systems Architect & Industry Mentor",
    company: hostCompany.name,
    email:
      props.activePlacement?.supervisor?.user?.email ??
      "james.otieno@techcorp.co.ug",
    phone:
      props.activePlacement?.supervisor?.phone ??
      "+256 701 884 310",
  };

  const [inquiries, setInquiries] = useState<InquiryTicket[]>(getStoredInquiries);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    recipient: `Academic Supervisor — ${academicSupervisor.name}`,
    category: "Site Visit & Assessment",
    priority: "normal" as "normal" | "urgent",
    subject: "",
    message: "",
  });

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: demoUser?.full_name ?? name ?? "",
    phone: props.studentProfile?.phone ?? demoUser?.phone ?? "+256 784 512 900",
    institution:
      props.studentProfile?.university?.name ??
      demoUser?.institution ??
      "Makerere University",
    course:
      props.studentProfile?.program?.name ??
      demoUser?.course ??
      "BSc. Software Engineering",
    student_number:
      props.studentProfile?.reg_no ??
      demoUser?.student_number ??
      "22/U/10428/PS",
  });

  useEffect(() => {
    if (demoUser) {
      setForm((prev) => ({
        ...prev,
        full_name: demoUser.full_name || prev.full_name,
        phone: demoUser.phone || prev.phone,
        institution: demoUser.institution || prev.institution,
        course: demoUser.course || prev.course,
        student_number: demoUser.student_number || prev.student_number,
      }));
    }
  }, [userId]);

  async function handleSendInquiry(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!inquiryForm.subject.trim() || !inquiryForm.message.trim()) {
      toast.error("Please enter both a subject and your inquiry message.");
      return;
    }

    setSubmittingInquiry(true);
    await new Promise((r) => setTimeout(r, 500));

    const newTicket: InquiryTicket = {
      id: uid(),
      ticketNo: `INQ-${Math.floor(1050 + Math.random() * 900)}`,
      studentId: userId,
      recipient: inquiryForm.recipient,
      category: inquiryForm.category,
      priority: inquiryForm.priority,
      subject: inquiryForm.subject.trim(),
      message: inquiryForm.message.trim(),
      status: "open",
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    };

    const updated = [newTicket, ...inquiries];
    setInquiries(updated);
    saveStoredInquiries(updated);

    setInquiryForm((prev) => ({
      ...prev,
      subject: "",
      message: "",
      priority: "normal",
    }));
    setSubmittingInquiry(false);

    toast.success(`Inquiry ${newTicket.ticketNo} sent`, {
      description: `Dispatched to ${newTicket.recipient}.`,
    });
  }

  async function save() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
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

  const isStudent = role === "student";
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  function handleSupervisorReply(ticketId: string) {
    const text = (replyText[ticketId] ?? "").trim();
    if (!text) {
      toast.error("Please enter a reply for the student.");
      return;
    }
    const updated = inquiries.map((inq) =>
      inq.id === ticketId
        ? { ...inq, status: "responded" as const, response: text }
        : inq,
    );
    setInquiries(updated);
    saveStoredInquiries(updated);
    setReplyText((prev) => ({ ...prev, [ticketId]: "" }));
    toast.success("Reply sent to student", {
      description: "Your mentor response has been attached to the student's inquiry ticket.",
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {isStudent
              ? "Placement Supervision, Company & Support"
              : "Mentee Inquiries & Supervisor Profile"}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {isStudent
              ? "View your host company, assigned academic & field supervisors, and send direct inquiries."
              : "Respond to inquiries from your assigned student interns and manage your supervisory profile."}
          </p>
        </div>
      </div>

      {/* Top Overview Cards: Only shown for Students */}
      {isStudent && (
        <div className="grid gap-4 md:grid-cols-3">
          {/* 1. Host Company Where Student Is Working */}
          <Card className="border-border/70">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-foreground">
                    <Building2 className="size-4.5" />
                  </div>
                  <div>
                    <CardDescription className="text-[11px] font-medium uppercase tracking-wider">
                      Host Company / Workplace
                    </CardDescription>
                    <CardTitle className="text-sm font-bold leading-snug">
                      {hostCompany.name}
                    </CardTitle>
                  </div>
                </div>
                <Badge className="bg-primary text-primary-foreground capitalize text-[11px]">
                  {hostCompany.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="rounded-lg bg-muted/60 p-2.5 space-y-1">
                <p className="font-semibold text-foreground">{hostCompany.roleTitle}</p>
                <p className="text-muted-foreground">{hostCompany.department}</p>
                <p className="text-[11px] text-muted-foreground">{hostCompany.industry}</p>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground pt-1">
                <MapPin className="size-3.5 shrink-0 text-foreground/70" />
                <span className="truncate">{hostCompany.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarCheck className="size-3.5 shrink-0 text-foreground/70" />
                <span>
                  {hostCompany.startDate} → {hostCompany.endDate}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 2. Assigned University Academic Supervisor */}
          <Card className="border-border/70">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-foreground">
                    <GraduationCap className="size-4.5" />
                  </div>
                  <div>
                    <CardDescription className="text-[11px] font-medium uppercase tracking-wider">
                      Assigned Academic Supervisor
                    </CardDescription>
                    <CardTitle className="text-sm font-bold leading-snug">
                      {academicSupervisor.name}
                    </CardTitle>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  Faculty
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="rounded-lg bg-muted/60 p-2.5 space-y-1">
                <p className="font-semibold text-foreground">{academicSupervisor.title}</p>
                <p className="text-muted-foreground">{academicSupervisor.department}</p>
                <p className="text-[11px] text-muted-foreground">{academicSupervisor.university}</p>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground pt-1">
                <Mail className="size-3.5 shrink-0 text-foreground/70" />
                <span className="truncate">{academicSupervisor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-3.5 shrink-0 text-foreground/70" />
                <span>{academicSupervisor.phone}</span>
              </div>
            </CardContent>
          </Card>

          {/* 3. Assigned Host Field Supervisor */}
          <Card className="border-border/70">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-foreground">
                    <UserCheck className="size-4.5" />
                  </div>
                  <div>
                    <CardDescription className="text-[11px] font-medium uppercase tracking-wider">
                      Host Field Supervisor
                    </CardDescription>
                    <CardTitle className="text-sm font-bold leading-snug">
                      {fieldSupervisor.name}
                    </CardTitle>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  Industry
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="rounded-lg bg-muted/60 p-2.5 space-y-1">
                <p className="font-semibold text-foreground">{fieldSupervisor.title}</p>
                <p className="text-muted-foreground">{fieldSupervisor.company}</p>
                <p className="text-[11px] text-muted-foreground">Daily Logbook & Shift Verifier</p>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground pt-1">
                <Mail className="size-3.5 shrink-0 text-foreground/70" />
                <span className="truncate">{fieldSupervisor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-3.5 shrink-0 text-foreground/70" />
                <span>{fieldSupervisor.phone}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="support" className="space-y-6">
        <TabsList>
          <TabsTrigger value="support" className="gap-2">
            <LifeBuoy className="size-4" />
            Send Inquiry & Support
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <UserIcon className="size-4" />
            Student Profile Details
          </TabsTrigger>
        </TabsList>

        {/* SUPPORT & INQUIRY TAB */}
        <TabsContent value="support" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Compose New Inquiry */}
            <Card className="lg:col-span-5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquarePlus className="size-4 text-primary" />
                  Send an Inquiry
                </CardTitle>
                <CardDescription>
                  Message your assigned academic supervisor, host field mentor, or coordinator.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendInquiry} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Send To</Label>
                    <Select
                      value={inquiryForm.recipient}
                      onValueChange={(v) => setInquiryForm({ ...inquiryForm, recipient: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={`Academic Supervisor — ${academicSupervisor.name}`}>
                          Academic Supervisor — {academicSupervisor.name}
                        </SelectItem>
                        <SelectItem value={`Field Supervisor — ${fieldSupervisor.name}`}>
                          Field Supervisor — {fieldSupervisor.name} ({hostCompany.name})
                        </SelectItem>
                        <SelectItem value="University Attachment Coordinator">
                          University Attachment Coordinator
                        </SelectItem>
                        <SelectItem value="InternTrack Technical Support">
                          InternTrack Technical Support
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Category</Label>
                      <Select
                        value={inquiryForm.category}
                        onValueChange={(v) => setInquiryForm({ ...inquiryForm, category: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Site Visit & Assessment">
                            Site Visit & Assessment
                          </SelectItem>
                          <SelectItem value="Logbook Approval / Revision">
                            Logbook Approval / Revision
                          </SelectItem>
                          <SelectItem value="Attendance & Hours">Attendance & Hours</SelectItem>
                          <SelectItem value="Host Company / Placement">
                            Host Company / Placement
                          </SelectItem>
                          <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Priority</Label>
                      <Select
                        value={inquiryForm.priority}
                        onValueChange={(v) =>
                          setInquiryForm({ ...inquiryForm, priority: v as "normal" | "urgent" })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="urgent">High / Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="inq-subject">Subject</Label>
                    <Input
                      id="inq-subject"
                      placeholder="e.g. Request for academic assessment visit date"
                      value={inquiryForm.subject}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="inq-message">Inquiry Message</Label>
                    <Textarea
                      id="inq-message"
                      rows={4}
                      placeholder="Write your question or update for your supervisor..."
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={submittingInquiry} className="w-full gap-2">
                    {submittingInquiry ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                    {submittingInquiry ? "Sending Inquiry..." : "Send Inquiry"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Inquiry History & Responses */}
            <Card className="lg:col-span-7">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">Recent Inquiries & Supervisor Replies</CardTitle>
                    <CardDescription>
                      Direct communication history with your academic and field supervisors
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{inquiries.length} tickets</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {inquiries.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No inquiries submitted yet.
                  </p>
                ) : (
                  inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="rounded-xl border border-border/70 bg-background/60 p-4 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-foreground">
                            {inq.ticketNo}
                          </span>
                          <Badge variant="outline" className="text-[11px]">
                            {inq.category}
                          </Badge>
                          {inq.priority === "urgent" && (
                            <Badge variant="destructive" className="text-[10px]">
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{inq.createdAt}</span>
                          {inq.status === "responded" ? (
                            <Badge className="bg-primary text-primary-foreground gap-1 text-[11px]">
                              <CheckCircle2 className="size-3" /> Responded
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1 text-[11px]">
                              <Clock className="size-3" /> Awaiting Reply
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{inq.subject}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          To: <span className="font-medium text-foreground/85">{inq.recipient}</span>
                        </p>
                      </div>

                      <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
                        {inq.message}
                      </p>

                      {inq.response ? (
                        <div className="rounded-lg border border-primary/25 bg-accent/40 p-3 space-y-1">
                          <p className="text-[11px] font-semibold text-accent-foreground">
                            Supervisor Reply:
                          </p>
                          <p className="text-xs text-foreground/90 leading-relaxed">
                            {inq.response}
                          </p>
                        </div>
                      ) : !isStudent ? (
                        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                          <Input
                            value={replyText[inq.id] ?? ""}
                            onChange={(e) =>
                              setReplyText((prev) => ({ ...prev, [inq.id]: e.target.value }))
                            }
                            placeholder="Write your mentor response to this student inquiry..."
                            className="h-8 text-xs"
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleSupervisorReply(inq.id)}
                            className="h-8 text-xs font-semibold shrink-0"
                          >
                            Reply
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PERSONAL PROFILE TAB */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Personal & Academic Details</CardTitle>
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
                    <Label htmlFor="inst">University / Institution</Label>
                    <Input
                      id="inst"
                      value={form.institution}
                      onChange={(e) => setForm({ ...form, institution: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="course">Degree Programme</Label>
                    <Input
                      id="course"
                      value={form.course}
                      onChange={(e) => setForm({ ...form, course: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sn">Registration / Student Number</Label>
                    <Input
                      id="sn"
                      value={form.student_number}
                      onChange={(e) => setForm({ ...form, student_number: e.target.value })}
                    />
                  </div>
                </div>
                <Button disabled={saving} onClick={save} className="gap-2">
                  {saving ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  Save changes
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">System Role & Tier</CardTitle>
                  <CardDescription>Active RBAC permissions</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {(roles.length ? roles : [role]).map((r) => (
                    <Badge key={r} variant="secondary">
                      {ROLE_LABELS[r]}
                    </Badge>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Placement Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company:</span>
                    <span className="font-semibold text-foreground">{hostCompany.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Academic Assessor:</span>
                    <span className="font-semibold text-foreground">{academicSupervisor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Field Supervisor:</span>
                    <span className="font-semibold text-foreground">{fieldSupervisor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Period:</span>
                    <span className="text-foreground">
                      {hostCompany.startDate} → {hostCompany.endDate}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
