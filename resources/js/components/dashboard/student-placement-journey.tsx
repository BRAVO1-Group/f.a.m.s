import { useState } from "react";
import { Link } from "@inertiajs/react";
import {
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  KeyRound,
  Mail,
  Plus,
  Send,
  Upload,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { enqueueOfflineAction, isAppOffline } from "@/components/ui/network-banner";

export type PlacementJourneyState = {
  stage: 1 | 2 | 3 | 4;
  prospectiveCompanies: { name: string; industry: string; city: string }[];
  universityLetterIssued: boolean;
  testimonialIssued: boolean;
  confirmedCompany: string;
  confirmationLetterFileName: string;
  confirmationUploadedAt: string;
  fieldMentorName: string;
  fieldMentorTitle: string;
  fieldMentorEmail: string;
  fieldMentorPhone: string;
  otpCode: string;
  mentorInviteDispatched: boolean;
};

const JOURNEY_STORAGE_KEY = "interntrack_student_placement_journey_v1";

const DEFAULT_JOURNEY: PlacementJourneyState = {
  stage: 3,
  prospectiveCompanies: [
    { name: "TechCorp Solutions Uganda Ltd", industry: "Enterprise Software & Cloud", city: "Kampala" },
    { name: "MTN Uganda — Digital Services", industry: "Telecommunications & FinTech", city: "Kampala" },
    { name: "Centenary Technology Services", industry: "Banking & Core Systems", city: "Kampala" },
  ],
  universityLetterIssued: true,
  testimonialIssued: true,
  confirmedCompany: "TechCorp Solutions Uganda Ltd",
  confirmationLetterFileName: "TechCorp_Internship_Acceptance_Letter_2026.pdf",
  confirmationUploadedAt: "2026-11-15",
  fieldMentorName: "Eng. James Otieno",
  fieldMentorTitle: "Lead Systems Architect",
  fieldMentorEmail: "james.otieno@techcorp.co.ug",
  fieldMentorPhone: "+256 701 884 310",
  otpCode: "OTP-849201",
  mentorInviteDispatched: true,
};

function loadJourney(): PlacementJourneyState {
  try {
    const raw = localStorage.getItem(JOURNEY_STORAGE_KEY);
    if (!raw) return DEFAULT_JOURNEY;
    return JSON.parse(raw) as PlacementJourneyState;
  } catch {
    return DEFAULT_JOURNEY;
  }
}

function saveJourney(state: PlacementJourneyState) {
  try {
    localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export function StudentPlacementJourney({ studentName }: { studentName: string }) {
  const [journey, setJourney] = useState<PlacementJourneyState>(loadJourney);
  const [activeStageTab, setActiveStageTab] = useState<1 | 2 | 3 | 4>(journey.stage);

  // Stage 1: Add prospective company
  const [newCompany, setNewCompany] = useState({ name: "", industry: "", city: "Kampala" });

  // Stage 3: Confirm company & upload acceptance letter
  const [selectedAcceptedCompany, setSelectedAcceptedCompany] = useState(
    journey.confirmedCompany || journey.prospectiveCompanies[0]?.name || "",
  );
  const [uploadedFile, setUploadedFile] = useState(journey.confirmationLetterFileName);
  const [confirmUploadDialog, setConfirmUploadDialog] = useState(false);

  // Stage 4: Submit field mentor details & dispatch OTP onboarding link
  const [mentorForm, setMentorForm] = useState({
    name: journey.fieldMentorName,
    title: journey.fieldMentorTitle,
    email: journey.fieldMentorEmail,
    phone: journey.fieldMentorPhone,
  });
  const [confirmMentorDialog, setConfirmMentorDialog] = useState(false);

  function updateJourney(patch: Partial<PlacementJourneyState>) {
    const updated = { ...journey, ...patch };
    setJourney(updated);
    saveJourney(updated);
  }

  function handleAddProspectiveCompany(e: React.FormEvent) {
    e.preventDefault();
    if (!newCompany.name.trim() || !newCompany.industry.trim()) {
      toast.warning("Empty Form Warning", {
        description: "Please enter both the prospective company name and its industry/sector.",
      });
      return;
    }
    const list = [
      ...journey.prospectiveCompanies,
      {
        name: newCompany.name.trim(),
        industry: newCompany.industry.trim() || "Technology & Operations",
        city: newCompany.city.trim() || "Kampala",
      },
    ];
    updateJourney({
      prospectiveCompanies: list,
      universityLetterIssued: true,
      testimonialIssued: true,
      stage: Math.max(journey.stage, 2) as 1 | 2 | 3 | 4,
    });
    if (!selectedAcceptedCompany) setSelectedAcceptedCompany(newCompany.name.trim());
    setNewCompany({ name: "", industry: "", city: "Kampala" });

    if (isAppOffline()) {
      enqueueOfflineAction("prospective_company", `Added company: ${newCompany.name}`);
    }
    toast.success("Prospective company submitted to University", {
      description:
        "Your Introductory Placement Letter and Academic Testimonial are ready for download in Step 2.",
    });
  }

  function printUniversityDocument(docType: "placement_letter" | "testimonial") {
    const w = window.open("", "_blank");
    if (!w) {
      toast.error("Allow pop-ups to view or print your official university document.");
      return;
    }
    const title =
      docType === "placement_letter"
        ? "OFFICIAL INTRODUCTORY PLACEMENT LETTER"
        : "ACADEMIC TESTIMONIAL & GOOD STANDING CERTIFICATE";
    const companiesList = journey.prospectiveCompanies.map((c) => c.name).join(", ");
    w.document.write(`<html><head><title>${title}</title></head>
      <body style="font-family:Georgia,serif;max-width:720px;margin:40px auto;line-height:1.6;color:#111">
        <div style="border-bottom:2px solid #18221B;padding-bottom:16px;margin-bottom:24px">
          <h2 style="margin:0;color:#18221B">OFFICE OF THE INDUSTRIAL TRAINING COORDINATOR</h2>
          <p style="margin:4px 0 0;font-size:13px;color:#555">Faculty of Computing &amp; Engineering · Academic Year 2026</p>
        </div>
        <h3 style="text-decoration:underline">${title}</h3>
        <p><strong>Student Candidate:</strong> ${studentName} (Reg No: CS/2021/0042)</p>
        <p><strong>Approved Prospective Host Organizations:</strong> ${companiesList}</p>
        <p>To Whom It May Concern,</p>
        <p>This is to certify that <strong>${studentName}</strong> is a registered student in good academic and disciplinary standing required to undertake a 12-week supervised Industrial Attachment. We kindly request your organization to consider the student for an internship placement.</p>
        <p style="margin-top:40px">Signed:<br/><strong>Dr. Peter Kamau</strong><br/>University Attachment Coordinator</p>
      </body></html>`);
    w.document.close();
    w.focus();
    w.print();
  }

  function executeConfirmCompanyUpload() {
    const fileName =
      uploadedFile.trim() ||
      `${selectedAcceptedCompany.replace(/\s+/g, "_")}_Acceptance_Letter_2026.pdf`;
    updateJourney({
      confirmedCompany: selectedAcceptedCompany,
      confirmationLetterFileName: fileName,
      confirmationUploadedAt: new Date().toISOString().slice(0, 10),
      stage: 4,
    });
    setUploadedFile(fileName);
    setConfirmUploadDialog(false);
    setActiveStageTab(4);

    if (isAppOffline()) {
      enqueueOfflineAction(
        "company_confirmation",
        `Confirmed ${selectedAcceptedCompany} & uploaded ${fileName}`,
      );
    }
    toast.success("Company Acceptance Letter Uploaded & Confirmed", {
      description: `Proceed to Step 4 to submit your Field Mentor's details at ${selectedAcceptedCompany}.`,
    });
  }

  function executeSubmitMentorAndDispatchOtp() {
    const newOtp = journey.otpCode || `OTP-${Math.floor(100000 + Math.random() * 900000)}`;
    updateJourney({
      fieldMentorName: mentorForm.name.trim(),
      fieldMentorTitle: mentorForm.title.trim(),
      fieldMentorEmail: mentorForm.email.trim(),
      fieldMentorPhone: mentorForm.phone.trim(),
      otpCode: newOtp,
      mentorInviteDispatched: true,
      stage: 4,
    });
    setConfirmMentorDialog(false);

    if (isAppOffline()) {
      enqueueOfflineAction(
        "mentor_otp_dispatch",
        `Queued Field Mentor OTP invite for ${mentorForm.email}`,
      );
    }
    toast.success("Field Mentor Details Submitted & OTP Link Dispatched", {
      description: `A special onboarding link with One-Time Password (${newOtp}) has been sent to ${mentorForm.email}.`,
    });
  }

  const onboardingLink = `/mentor-onboard?student=${encodeURIComponent(
    studentName,
  )}&reg=${encodeURIComponent("CS/2021/0042")}&company=${encodeURIComponent(
    journey.confirmedCompany || "TechCorp Solutions Uganda Ltd",
  )}&mentor=${encodeURIComponent(
    journey.fieldMentorName || "Eng. James Otieno",
  )}&email=${encodeURIComponent(
    journey.fieldMentorEmail || "james.otieno@techcorp.co.ug",
  )}&otp=${encodeURIComponent(journey.otpCode || "OTP-849201")}`;

  const steps = [
    {
      num: 1 as const,
      title: "1. Submit Hopeful Companies",
      done: journey.prospectiveCompanies.length > 0,
    },
    {
      num: 2 as const,
      title: "2. Placement Letter & Testimonial",
      done: journey.universityLetterIssued,
    },
    {
      num: 3 as const,
      title: "3. Upload Acceptance Letter",
      done: Boolean(journey.confirmedCompany && journey.confirmationLetterFileName),
    },
    {
      num: 4 as const,
      title: "4. Field Mentor & OTP Link",
      done: journey.mentorInviteDispatched,
    },
  ];

  return (
    <Card className="rounded-xl border border-border/60 bg-card">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold">
              Internship Placement &amp; Supervisor Onboarding Journey
            </CardTitle>
            <CardDescription>
              Submit prospective companies, download your university placement letter &amp;
              testimonial, upload your company acceptance letter, and link your field mentor
            </CardDescription>
          </div>
          <Badge variant="secondary" className="w-fit text-xs">
            {journey.mentorInviteDispatched ? "All 4 Steps Complete" : `Stage ${journey.stage} of 4`}
          </Badge>
        </div>

        {/* 4-Step Interactive Progress Stepper */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {steps.map((s) => {
            const active = activeStageTab === s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setActiveStageTab(s.num)}
                className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs font-medium transition cursor-pointer ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : s.done
                      ? "border-border/70 bg-muted/50 text-foreground hover:bg-muted"
                      : "border-border/50 bg-background text-muted-foreground hover:bg-muted/30"
                }`}
              >
                <span className="truncate">{s.title}</span>
                {s.done && (
                  <CheckCircle2
                    className={`size-3.5 shrink-0 ${
                      active ? "text-primary" : "text-[#589E10] dark:text-primary"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        {/* STAGE 1: Submit Prospective Companies */}
        {activeStageTab === 1 && (
          <div className="space-y-4">
            <Alert className="border-border/60 bg-muted/30">
              <Building2 className="size-4" />
              <AlertTitle className="text-xs font-semibold">
                Stage 1: Submit Prospective Companies You Hope to Work In
              </AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                List the organizations you are applying to so the University can issue your
                Introductory Placement Letter and Academic Testimonial.
              </AlertDescription>
            </Alert>

            <div className="grid gap-2.5 sm:grid-cols-3">
              {journey.prospectiveCompanies.map((comp, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border/60 bg-background/60 p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground truncate">{comp.name}</span>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      Choice #{idx + 1}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {comp.industry} · {comp.city}
                  </p>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleAddProspectiveCompany}
              className="grid gap-2.5 sm:grid-cols-4 pt-1"
            >
              <Input
                placeholder="Company name (e.g. Stanbic Bank)"
                value={newCompany.name}
                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                className="h-9 text-xs sm:col-span-2"
              />
              <Input
                placeholder="Industry / Sector"
                value={newCompany.industry}
                onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                className="h-9 text-xs"
              />
              <Button type="submit" size="sm" className="h-9 text-xs font-medium gap-1.5">
                <Plus className="size-3.5" />
                Submit Company
              </Button>
            </form>
          </div>
        )}

        {/* STAGE 2: Download University Placement Letter & Testimonial */}
        {activeStageTab === 2 && (
          <div className="space-y-4">
            <Alert className="border-border/60 bg-muted/30">
              <FileText className="size-4" />
              <AlertTitle className="text-xs font-semibold">
                Stage 2: University Introductory Placement Letter &amp; Academic Testimonial
              </AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                The University has issued your official placement request letter and academic
                testimonial. Download or print them to present to your prospective companies.
              </AlertDescription>
            </Alert>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/60 p-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">
                    Introductory Placement Letter
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Official university introduction addressed to your prospective employers
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => printUniversityDocument("placement_letter")}
                  className="h-8 text-xs font-medium gap-1.5 shrink-0"
                >
                  <Download className="size-3.5" />
                  Download Letter
                </Button>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/60 p-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">
                    Academic Testimonial Certificate
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Certified academic standing &amp; recommendation from your faculty dean
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => printUniversityDocument("testimonial")}
                  className="h-8 text-xs font-medium gap-1.5 shrink-0"
                >
                  <Download className="size-3.5" />
                  Download Testimonial
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                size="sm"
                onClick={() => setActiveStageTab(3)}
                className="h-8 text-xs font-medium"
              >
                Next: Confirm Accepted Company →
              </Button>
            </div>
          </div>
        )}

        {/* STAGE 3: Confirm Accepted Company & Upload Acceptance Letter */}
        {activeStageTab === 3 && (
          <div className="space-y-4">
            <Alert className="border-border/60 bg-muted/30">
              <FileCheck2 className="size-4" />
              <AlertTitle className="text-xs font-semibold">
                Stage 3: Confirm Company &amp; Upload Acceptance / Confirmation Letter
              </AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                Select which company accepted your application and upload the signed confirmation
                letter they gave you.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Company That Granted Your Internship</Label>
                <select
                  value={selectedAcceptedCompany}
                  onChange={(e) => setSelectedAcceptedCompany(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-xs shadow-2xs outline-none focus:ring-2 focus:ring-ring"
                >
                  {journey.prospectiveCompanies.map((c, idx) => (
                    <option key={idx} value={c.name}>
                      {c.name} ({c.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Company Confirmation Letter (PDF / Scan)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setUploadedFile(file.name);
                    }}
                    className="h-9 text-xs"
                  />
                </div>
                {uploadedFile && (
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-0.5">
                    <Check className="size-3.5 text-[#589E10] dark:text-primary" />
                    Attached: <span className="font-mono text-foreground">{uploadedFile}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-muted-foreground">
                Last verified upload: {journey.confirmationUploadedAt}
              </span>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (!selectedAcceptedCompany.trim() || !uploadedFile.trim()) {
                    toast.warning("Empty Form Warning", {
                      description:
                        "Please select the accepted company and attach your confirmation letter before saving.",
                    });
                    return;
                  }
                  setConfirmUploadDialog(true);
                }}
                className="h-8 text-xs font-semibold gap-1.5"
              >
                <Upload className="size-3.5" />
                Confirm Company &amp; Save Letter
              </Button>
            </div>
          </div>
        )}

        {/* STAGE 4: Submit Field Mentor Details & Special OTP Onboarding Link */}
        {activeStageTab === 4 && (
          <div className="space-y-4">
            <Alert className="border-border/60 bg-muted/30">
              <KeyRound className="size-4" />
              <AlertTitle className="text-xs font-semibold">
                Stage 4: Submit Field Mentor Details &amp; Special OTP Onboarding Link
              </AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                Provide your workplace Field Mentor&apos;s details and email at{" "}
                <strong>{journey.confirmedCompany}</strong>. The University Admin dispatches a
                special link with a One-Time Password (OTP) showing you as their assigned student.
              </AlertDescription>
            </Alert>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <Label className="text-xs">Field Mentor Full Name</Label>
                <Input
                  value={mentorForm.name}
                  onChange={(e) => setMentorForm({ ...mentorForm, name: e.target.value })}
                  placeholder="e.g. Eng. James Otieno"
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Job Title / Position</Label>
                <Input
                  value={mentorForm.title}
                  onChange={(e) => setMentorForm({ ...mentorForm, title: e.target.value })}
                  placeholder="e.g. Lead Systems Architect"
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Official Company Email</Label>
                <Input
                  type="email"
                  value={mentorForm.email}
                  onChange={(e) => setMentorForm({ ...mentorForm, email: e.target.value })}
                  placeholder="mentor@company.co.ug"
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Phone Number</Label>
                <Input
                  value={mentorForm.phone}
                  onChange={(e) => setMentorForm({ ...mentorForm, phone: e.target.value })}
                  placeholder="+256 701 ..."
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (
                    !mentorForm.name.trim() ||
                    !mentorForm.title.trim() ||
                    !mentorForm.email.trim() ||
                    !mentorForm.phone.trim()
                  ) {
                    toast.warning("Empty Form Warning", {
                      description:
                        "Please complete all Field Mentor fields (Full Name, Job Title, Official Email, and Phone Number).",
                    });
                    return;
                  }
                  setConfirmMentorDialog(true);
                }}
                className="h-8 text-xs font-semibold gap-1.5"
              >
                <Send className="size-3.5" />
                Submit Mentor Details &amp; Send OTP Link
              </Button>

              {journey.mentorInviteDispatched && (
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs">
                  <span className="text-muted-foreground">
                    Dispatched OTP: <strong className="font-mono text-foreground">{journey.otpCode}</strong>
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.origin + onboardingLink);
                      toast.success("Special Field Mentor OTP Link copied to clipboard");
                    }}
                    className="h-7 px-2 text-[11px] gap-1"
                  >
                    <Copy className="size-3" />
                    Copy Link
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className="h-7 px-2.5 text-[11px] font-medium gap-1"
                  >
                    <Link href={onboardingLink}>
                      <span>Open Field Mentor Onboarding Link</span>
                      <ExternalLink className="size-3" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Yes / No Confirmation Dialog 1: Confirm Accepted Company & Upload Letter */}
      <ConfirmDialog
        open={confirmUploadDialog}
        onOpenChange={setConfirmUploadDialog}
        title="Confirm Accepted Host Company & Upload Letter?"
        description={
          <>
            Are you sure you want to confirm <strong>{selectedAcceptedCompany}</strong> as your
            official internship host organization and submit{" "}
            <code className="text-foreground">
              {uploadedFile || "Acceptance_Confirmation_Letter.pdf"}
            </code>{" "}
            to the University Administration?
          </>
        }
        confirmLabel="Yes, Confirm & Upload"
        cancelLabel="No, Review Again"
        onConfirm={executeConfirmCompanyUpload}
      />

      {/* Yes / No Confirmation Dialog 2: Submit Field Mentor Details & Send OTP Link */}
      <ConfirmDialog
        open={confirmMentorDialog}
        onOpenChange={setConfirmMentorDialog}
        title="Submit Field Mentor Details & Send OTP Onboarding Link?"
        description={
          <>
            This will register <strong>{mentorForm.name}</strong> ({mentorForm.email}) as your
            workplace Field Mentor at <strong>{journey.confirmedCompany}</strong> and dispatch a
            special onboarding link with a One-Time Password showing you as their assigned student.
            Do you want to proceed?
          </>
        }
        confirmLabel="Yes, Dispatch OTP Link"
        cancelLabel="No, Cancel"
        onConfirm={executeSubmitMentorAndDispatchOtp}
      />
    </Card>
  );
}
