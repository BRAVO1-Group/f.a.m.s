/**
 * PROTOTYPE / DEMO MODE
 * All data is mocked in-memory. Runs entirely in the client with no network or database calls.
 */

import type { AppRole } from "@/lib/auth";

export type MockUser = {
  id: string;
  email: string;
  full_name: string;
  role: AppRole;
  roles: AppRole[];
  phone: string;
  institution: string;
  course: string;
  student_number: string;
};

export type MockActivity = {
  id: string;
  student_id: string;
  internship_id: string;
  activity_date: string;
  arrival_time: string | null;
  departure_time: string | null;
  title: string;
  description: string;
  tools_used: string[];
  skills_gained: string[];
  challenges: string | null;
  solutions: string | null;
  status: "draft" | "submitted" | "approved" | "needs_correction";
  submitted_at: string | null;
  supervisor_feedback: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  attachments?: string[];
};

export type MockAttendance = {
  id: string;
  student_id: string;
  internship_id: string;
  attendance_date: string;
  check_in: string | null;
  check_out: string | null;
};

export type MockOrganization = {
  id: string;
  name: string;
  industry: string;
  address: string;
  contact_person: string;
  contact_email: string;
};

export type MockInternship = {
  id: string;
  student_id: string;
  organization_id: string;
  supervisor_id: string; // Host Organization Supervisor (Industry Mentor)
  academic_supervisor_id?: string | undefined; // University Academic Supervisor (Faculty Assessor)
  position: string;
  department: string;
  start_date: string;
  end_date: string;
  required_days: number;
  status: "active" | "completed" | "pending";
};

export type SupervisorType = "organization" | "university";

export type MockSupervisor = {
  id: string;
  user_id?: string | undefined;
  full_name: string;
  email: string;
  phone: string;
  type: SupervisorType; // "organization" (industry mentor) | "university" (academic supervisor)
  organization_name?: string | undefined;
  faculty_department?: string | undefined;
  title: string;
  assigned_student_ids: string[];
};

export type PermissionCategory =
  | "Logbooks & Activity Logging"
  | "Attendance & Verification"
  | "Milestones & Deliverables"
  | "Evaluations & Grading"
  | "Supervisors & Placements"
  | "RBAC Governance & Access Control";

export type MockPermission = {
  id: string;
  label: string;
  description: string;
  category: PermissionCategory;
};

export const SYSTEM_PERMISSIONS: MockPermission[] = [
  // Logbooks & Activity Logging
  {
    id: "logs:create",
    label: "Create Logbook Entries",
    description: "Submit daily internship logs, challenges, solutions, and tool logs",
    category: "Logbooks & Activity Logging",
  },
  {
    id: "logs:approve",
    label: "Approve / Reject Student Logs",
    description: "Provide feedback and sign off on submitted daily logs",
    category: "Logbooks & Activity Logging",
  },
  {
    id: "logs:override",
    label: "Administrative Log Override",
    description: "Arbitrate disputes and edit locked activity entries",
    category: "Logbooks & Activity Logging",
  },
  // Attendance & Verification
  {
    id: "attendance:record",
    label: "Punch Daily Attendance",
    description: "Clock in and out with geolocation timestamps",
    category: "Attendance & Verification",
  },
  {
    id: "attendance:audit",
    label: "Audit Attendance & Hours",
    description: "Review attendance trends, absence justifications, and shift logs",
    category: "Attendance & Verification",
  },
  // Milestones & Deliverables
  {
    id: "milestones:track",
    label: "Update Milestone Deliverables",
    description: "Mark weekly deliverables and technical tasks as completed",
    category: "Milestones & Deliverables",
  },
  {
    id: "milestones:certify",
    label: "Certify Milestone Phases",
    description: "Sign off on completed learning phases and core competencies",
    category: "Milestones & Deliverables",
  },
  // Evaluations & Grading
  {
    id: "assessments:grade",
    label: "Submit Midterm & Final Evaluations",
    description: "Evaluate technical skills, soft skills, punctuality, and assign letter grade",
    category: "Evaluations & Grading",
  },
  {
    id: "assessments:view_all",
    label: "Institutional Grade Roster",
    description: "Access department-wide grades, GPA weighting, and performance distribution",
    category: "Evaluations & Grading",
  },
  // Supervisors & Placements
  {
    id: "supervisors:create",
    label: "Create Supervisor Accounts",
    description: "Register organization mentors and university academic supervisors",
    category: "Supervisors & Placements",
  },
  {
    id: "supervisors:assign",
    label: "Assign Supervisors to Students",
    description: "Pair students with dual mentors (industry host + university faculty)",
    category: "Supervisors & Placements",
  },
  // RBAC Governance & Access Control
  {
    id: "rbac:manage",
    label: "Define Roles & Permissions",
    description: "Configure system security clearance, role hierarchies, and permission matrix",
    category: "RBAC Governance & Access Control",
  },
  {
    id: "accreditation:export",
    label: "Accreditation Dossier Export",
    description: "Generate dean-certified PDF audit reports for university graduation board",
    category: "RBAC Governance & Access Control",
  },
];

export type RolePermissionsMap = Record<AppRole, string[]>;

export const DEFAULT_ROLE_PERMISSIONS: RolePermissionsMap = {
  student: ["logs:create", "attendance:record", "milestones:track"],
  supervisor: [
    "logs:approve",
    "attendance:audit",
    "milestones:track",
    "milestones:certify",
    "assessments:grade",
  ],
  org_admin: [
    "logs:approve",
    "attendance:audit",
    "milestones:certify",
    "assessments:grade",
    "supervisors:create",
  ],
  uni_admin: [
    "logs:approve",
    "logs:override",
    "attendance:audit",
    "milestones:certify",
    "assessments:grade",
    "assessments:view_all",
    "supervisors:create",
    "supervisors:assign",
    "rbac:manage",
    "accreditation:export",
  ],
  system_admin: [
    "logs:create",
    "logs:approve",
    "logs:override",
    "attendance:record",
    "attendance:audit",
    "milestones:track",
    "milestones:certify",
    "assessments:grade",
    "assessments:view_all",
    "supervisors:create",
    "supervisors:assign",
    "rbac:manage",
    "accreditation:export",
  ],
};

export type MockMilestoneTask = {
  id: string;
  title: string;
  completed: boolean;
};

export type MockMilestone = {
  id: string;
  student_id: string;
  internship_id: string;
  phase: string;
  title: string;
  description: string;
  target_week: string;
  status: "not_started" | "in_progress" | "under_review" | "completed";
  skills: string[];
  tasks: MockMilestoneTask[];
  supervisor_feedback: string | null;
  completed_at: string | null;
};

export type MockEvaluation = {
  id: string;
  student_id: string;
  supervisor_id: string;
  internship_id: string;
  evaluation_date: string;
  period: "Mid-Term" | "Final Assessment";
  ratings: {
    technical: number;
    punctuality: number;
    communication: number;
    problem_solving: number;
  };
  overall_score: number;
  grade: string;
  recommendation: "full_time_offer" | "commendation" | "satisfactory" | "needs_improvement";
  comments: string;
  supervisor_name: string;
};

// ── Demo users ──────────────────────────────────────────────────────────────
export const DEMO_USERS: MockUser[] = [
  {
    id: "student-1",
    email: "alice@university.ac.ke",
    full_name: "Alice Wanjiku",
    role: "student",
    roles: ["student"],
    phone: "+254 712 345 678",
    institution: "University of Nairobi",
    course: "BSc. Computer Science",
    student_number: "CS/2021/0042",
  },
  {
    id: "supervisor-1",
    email: "james.otieno@techcorp.co.ke",
    full_name: "James Otieno",
    role: "supervisor",
    roles: ["supervisor"],
    phone: "+254 722 001 122",
    institution: "",
    course: "",
    student_number: "",
  },
  {
    id: "org-admin-1",
    email: "admin@techcorp.co.ke",
    full_name: "Fatuma Said",
    role: "org_admin",
    roles: ["org_admin"],
    phone: "+254 733 987 654",
    institution: "",
    course: "",
    student_number: "",
  },
  {
    id: "uni-admin-1",
    email: "dean@university.ac.ke",
    full_name: "Dr. Peter Kamau",
    role: "uni_admin",
    roles: ["uni_admin", "system_admin"],
    phone: "+254 701 234 567",
    institution: "University of Nairobi",
    course: "",
    student_number: "",
  },
];

// ── Organizations ───────────────────────────────────────────────────────────
export const organizations: MockOrganization[] = [
  {
    id: "org-1",
    name: "TechCorp Kenya Ltd",
    industry: "Information Technology",
    address: "Westlands, Nairobi",
    contact_person: "James Otieno",
    contact_email: "james.otieno@techcorp.co.ke",
  },
  {
    id: "org-2",
    name: "Safaricom PLC",
    industry: "Telecommunications",
    address: "Westlands Business Park, Nairobi",
    contact_person: "Grace Muthoni",
    contact_email: "grace.muthoni@safaricom.co.ke",
  },
  {
    id: "org-3",
    name: "Kenya Commercial Bank",
    industry: "Banking and Finance",
    address: "Kencom House, Nairobi CBD",
    contact_person: "Brian Njoroge",
    contact_email: "brian.njoroge@kcb.co.ke",
  },
];

// ── Internships ─────────────────────────────────────────────────────────────
export const internships: MockInternship[] = [
  {
    id: "intern-1",
    student_id: "student-1",
    organization_id: "org-1",
    supervisor_id: "sup-org-1",
    academic_supervisor_id: "sup-uni-1",
    position: "Software Engineering Intern",
    department: "Product Engineering",
    start_date: "2026-07-01",
    end_date: "2026-09-30",
    required_days: 60,
    status: "active",
  },
  {
    id: "intern-2",
    student_id: "student-2",
    organization_id: "org-2",
    supervisor_id: "sup-org-2",
    academic_supervisor_id: "sup-uni-2",
    position: "Network Engineering Intern",
    department: "Infrastructure",
    start_date: "2026-07-01",
    end_date: "2026-09-30",
    required_days: 60,
    status: "active",
  },
  {
    id: "intern-3",
    student_id: "student-3",
    organization_id: "org-3",
    supervisor_id: "sup-org-3",
    academic_supervisor_id: "sup-uni-1",
    position: "Data Analyst Intern",
    department: "Business Intelligence",
    start_date: "2026-06-01",
    end_date: "2026-08-31",
    required_days: 60,
    status: "completed",
  },
  {
    id: "intern-4",
    student_id: "student-4",
    organization_id: "org-1",
    supervisor_id: "sup-org-1",
    academic_supervisor_id: undefined, // Unassigned academic supervisor to demonstrate assignment flow
    position: "Cybersecurity Analyst Intern",
    department: "InfoSec Operations",
    start_date: "2026-07-15",
    end_date: "2026-10-15",
    required_days: 60,
    status: "active",
  },
];

// ── Activities ──────────────────────────────────────────────────────────────
export const activities: MockActivity[] = [
  {
    id: "act-1",
    student_id: "student-1",
    internship_id: "intern-1",
    activity_date: "2026-09-23",
    arrival_time: "08:30",
    departure_time: "17:00",
    title: "Implemented REST API for user onboarding",
    description:
      "Built and tested a REST API endpoint for new user registration using Node.js and Express. Integrated input validation with Zod and wrote unit tests with Jest achieving 90% coverage.",
    tools_used: ["Node.js", "Express", "Zod", "Jest"],
    skills_gained: ["REST API design", "Unit testing", "Input validation"],
    challenges: "Handling edge cases in phone number validation for different country formats.",
    solutions: "Used a regular expression library that covers international formats.",
    status: "approved",
    submitted_at: "2026-09-23T18:00:00Z",
    supervisor_feedback:
      "Excellent work! The test coverage is impressive. Consider adding integration tests next.",
    reviewed_by: "supervisor-1",
    reviewed_at: "2026-09-24T09:00:00Z",
  },
  {
    id: "act-2",
    student_id: "student-1",
    internship_id: "intern-1",
    activity_date: "2026-09-22",
    arrival_time: "08:45",
    departure_time: "17:30",
    title: "Database schema design for analytics module",
    description:
      "Designed relational schema for the analytics dashboard. Created entity-relationship diagrams, defined indexes for performance, and reviewed the schema with the senior engineer.",
    tools_used: ["PostgreSQL", "dbdiagram.io", "DBeaver"],
    skills_gained: ["Database design", "ER diagrams", "Query optimization"],
    challenges: "Deciding between denormalized and normalized schema for high-read tables.",
    solutions: "Opted for partial denormalization on summary tables with materialized views.",
    status: "submitted",
    submitted_at: "2026-09-22T18:00:00Z",
    supervisor_feedback: null,
    reviewed_by: null,
    reviewed_at: null,
  },
  {
    id: "act-3",
    student_id: "student-1",
    internship_id: "intern-1",
    activity_date: "2026-09-20",
    arrival_time: "09:00",
    departure_time: "17:00",
    title: "Frontend component library setup",
    description:
      "Set up a shared component library using React and Storybook. Created base components for buttons, inputs, and modals with design token support.",
    tools_used: ["React", "TypeScript", "Storybook", "shadcn/ui"],
    skills_gained: ["Component design", "Design systems", "Storybook"],
    challenges: "Configuring Storybook with Vite and TypeScript path aliases.",
    solutions: "Updated Storybook webpack config to mirror Vite alias resolution.",
    status: "approved",
    submitted_at: "2026-09-20T17:30:00Z",
    supervisor_feedback: "Well structured. Make sure to document props thoroughly.",
    reviewed_by: "supervisor-1",
    reviewed_at: "2026-09-21T10:00:00Z",
  },
  {
    id: "act-4",
    student_id: "student-1",
    internship_id: "intern-1",
    activity_date: "2026-09-18",
    arrival_time: "09:00",
    departure_time: "17:00",
    title: "Bug fix — payment gateway timeout",
    description:
      "Investigated and resolved a critical bug causing payment gateway requests to time out after 30 seconds. The issue was traced to a missing connection pool configuration.",
    tools_used: ["Node.js", "Axios", "Postman"],
    skills_gained: ["Debugging", "HTTP clients", "Connection pooling"],
    challenges: "Reproducing the issue in the local dev environment.",
    solutions: "Used Charles Proxy to intercept requests and simulate slow network conditions.",
    status: "needs_correction",
    submitted_at: "2026-09-18T18:00:00Z",
    supervisor_feedback:
      "Please add more detail about the root cause analysis process and the specific config values changed.",
    reviewed_by: "supervisor-1",
    reviewed_at: "2026-09-19T09:30:00Z",
  },
  {
    id: "act-5",
    student_id: "student-1",
    internship_id: "intern-1",
    activity_date: "2026-09-24",
    arrival_time: "08:30",
    departure_time: null,
    title: "Today's draft — onboarding flow UI",
    description: "Working on the onboarding wizard UI components for new user registration.",
    tools_used: ["React", "Tailwind CSS"],
    skills_gained: ["UI/UX design", "Wizard patterns"],
    challenges: null,
    solutions: null,
    status: "draft",
    submitted_at: null,
    supervisor_feedback: null,
    reviewed_by: null,
    reviewed_at: null,
  },
  {
    id: "act-6",
    student_id: "student-2",
    internship_id: "intern-2",
    activity_date: "2026-09-23",
    arrival_time: "09:00",
    departure_time: "17:00",
    title: "Network topology mapping exercise",
    description:
      "Documented existing network topology using Cisco Packet Tracer. Identified bottlenecks in the current LAN setup.",
    tools_used: ["Cisco Packet Tracer", "Visio"],
    skills_gained: ["Network analysis", "Documentation"],
    challenges: "Access to legacy equipment documentation was limited.",
    solutions: "Used network scanning tools to reverse-engineer topology.",
    status: "submitted",
    submitted_at: "2026-09-23T18:00:00Z",
    supervisor_feedback: null,
    reviewed_by: null,
    reviewed_at: null,
  },
  {
    id: "act-7",
    student_id: "student-2",
    internship_id: "intern-2",
    activity_date: "2026-09-22",
    arrival_time: "09:00",
    departure_time: "17:00",
    title: "Firewall rule audit and update",
    description:
      "Reviewed existing firewall rules and removed redundant entries. Updated ingress rules to reflect current security policy.",
    tools_used: ["pfSense", "Wireshark"],
    skills_gained: ["Network security", "Firewall management"],
    challenges: null,
    solutions: null,
    status: "submitted",
    submitted_at: "2026-09-22T18:00:00Z",
    supervisor_feedback: null,
    reviewed_by: null,
    reviewed_at: null,
  },
  {
    id: "act-8",
    student_id: "student-3",
    internship_id: "intern-3",
    activity_date: "2026-08-30",
    arrival_time: "08:30",
    departure_time: "17:30",
    title: "Monthly sales dashboard final iteration",
    description:
      "Completed the final iteration of the monthly sales dashboard with drill-down capabilities and export to Excel.",
    tools_used: ["Power BI", "Excel", "SQL"],
    skills_gained: ["Data visualization", "Business intelligence", "SQL"],
    challenges: "DAX measures for YoY comparison were complex.",
    solutions: "Used SAMEPERIODLASTYEAR function in DAX.",
    status: "approved",
    submitted_at: "2026-08-30T18:00:00Z",
    supervisor_feedback: "Outstanding dashboard. Very polished.",
    reviewed_by: "supervisor-1",
    reviewed_at: "2026-08-31T09:00:00Z",
  },
  {
    id: "act-9",
    student_id: "student-4",
    internship_id: "intern-4",
    activity_date: "2026-09-24",
    arrival_time: "08:30",
    departure_time: "17:00",
    title: "Vulnerability assessment on customer portal API",
    description:
      "Conducted automated and manual vulnerability assessment using OWASP ZAP and Postman. Identified 2 CORS misconfigurations and drafted remediation notes.",
    tools_used: ["OWASP ZAP", "Postman", "Burp Suite"],
    skills_gained: ["API security", "CORS policy auditing", "Penetration testing"],
    challenges: "False positives in automated scan reports.",
    solutions: "Manually replayed suspected requests to verify vulnerability impact.",
    status: "submitted",
    submitted_at: "2026-09-24T17:00:00Z",
    supervisor_feedback: null,
    reviewed_by: null,
    reviewed_at: null,
  },
  {
    id: "act-10",
    student_id: "student-4",
    internship_id: "intern-4",
    activity_date: "2026-09-21",
    arrival_time: "08:30",
    departure_time: "17:00",
    title: "SIEM log analysis and alert rule tuning",
    description:
      "Reviewed Splunk alerts for anomalous SSH logins on production staging servers. Created a tuned correlation search to filter out authorized CI/CD runners.",
    tools_used: ["Splunk", "Linux Bash", "Regex"],
    skills_gained: ["SIEM engineering", "Log analysis", "Incident response"],
    challenges: "High volume of noise from ephemeral runner IP addresses.",
    solutions: "Whitelisted runner subnets in the correlation query.",
    status: "approved",
    submitted_at: "2026-09-21T17:30:00Z",
    supervisor_feedback:
      "Great analytical work, Kevin. Good job filtering out the false positives without compromising perimeter coverage.",
    reviewed_by: "supervisor-1",
    reviewed_at: "2026-09-22T08:30:00Z",
  },
];

// ── Attendance ───────────────────────────────────────────────────────────────
const todayStr = new Date().toISOString().slice(0, 10);
const pastDay = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

export const attendance: MockAttendance[] = [
  {
    id: "att-1",
    student_id: "student-1",
    internship_id: "intern-1",
    attendance_date: todayStr,
    check_in: new Date().toISOString(),
    check_out: null,
  },
  {
    id: "att-2",
    student_id: "student-1",
    internship_id: "intern-1",
    attendance_date: pastDay(1),
    check_in: new Date(Date.now() - 86400000).toISOString(),
    check_out: new Date(Date.now() - 86400000 + 8 * 3600000).toISOString(),
  },
  {
    id: "att-3",
    student_id: "student-1",
    internship_id: "intern-1",
    attendance_date: pastDay(2),
    check_in: new Date(Date.now() - 2 * 86400000).toISOString(),
    check_out: new Date(Date.now() - 2 * 86400000 + 8 * 3600000).toISOString(),
  },
  {
    id: "att-4",
    student_id: "student-1",
    internship_id: "intern-1",
    attendance_date: pastDay(3),
    check_in: new Date(Date.now() - 3 * 86400000).toISOString(),
    check_out: new Date(Date.now() - 3 * 86400000 + 7.5 * 3600000).toISOString(),
  },
  {
    id: "att-5",
    student_id: "student-1",
    internship_id: "intern-1",
    attendance_date: pastDay(4),
    check_in: new Date(Date.now() - 4 * 86400000).toISOString(),
    check_out: new Date(Date.now() - 4 * 86400000 + 8 * 3600000).toISOString(),
  },
  {
    id: "att-6",
    student_id: "student-1",
    internship_id: "intern-1",
    attendance_date: pastDay(7),
    check_in: new Date(Date.now() - 7 * 86400000).toISOString(),
    check_out: new Date(Date.now() - 7 * 86400000 + 8 * 3600000).toISOString(),
  },
  {
    id: "att-7",
    student_id: "student-1",
    internship_id: "intern-1",
    attendance_date: pastDay(8),
    check_in: new Date(Date.now() - 8 * 86400000).toISOString(),
    check_out: new Date(Date.now() - 8 * 86400000 + 8 * 3600000).toISOString(),
  },
  {
    id: "att-8",
    student_id: "student-1",
    internship_id: "intern-1",
    attendance_date: pastDay(9),
    check_in: new Date(Date.now() - 9 * 86400000).toISOString(),
    check_out: new Date(Date.now() - 9 * 86400000 + 8 * 3600000).toISOString(),
  },
  {
    id: "att-9",
    student_id: "student-1",
    internship_id: "intern-1",
    attendance_date: pastDay(10),
    check_in: new Date(Date.now() - 10 * 86400000).toISOString(),
    check_out: new Date(Date.now() - 10 * 86400000 + 7 * 3600000).toISOString(),
  },
  {
    id: "att-10",
    student_id: "student-1",
    internship_id: "intern-1",
    attendance_date: pastDay(14),
    check_in: new Date(Date.now() - 14 * 86400000).toISOString(),
    check_out: new Date(Date.now() - 14 * 86400000 + 8 * 3600000).toISOString(),
  },
  {
    id: "att-11",
    student_id: "student-1",
    internship_id: "intern-1",
    attendance_date: pastDay(15),
    check_in: new Date(Date.now() - 15 * 86400000).toISOString(),
    check_out: new Date(Date.now() - 15 * 86400000 + 8 * 3600000).toISOString(),
  },
  {
    id: "att-12",
    student_id: "student-1",
    internship_id: "intern-1",
    attendance_date: pastDay(16),
    check_in: new Date(Date.now() - 16 * 86400000).toISOString(),
    check_out: new Date(Date.now() - 16 * 86400000 + 8 * 3600000).toISOString(),
  },
  {
    id: "att-13",
    student_id: "student-1",
    internship_id: "intern-1",
    attendance_date: pastDay(17),
    check_in: new Date(Date.now() - 17 * 86400000).toISOString(),
    check_out: new Date(Date.now() - 17 * 86400000 + 8 * 3600000).toISOString(),
  },
];

// ── Profiles for admin UI ────────────────────────────────────────────────────
export const profiles = [
  {
    id: "student-1",
    full_name: "Alice Wanjiku",
    email: "alice@university.ac.ke",
    institution: "University of Nairobi",
    course: "BSc. Computer Science",
  },
  {
    id: "student-2",
    full_name: "Brian Mwangi",
    email: "brian@university.ac.ke",
    institution: "Kenyatta University",
    course: "BSc. Telecommunications & Networking",
  },
  {
    id: "student-3",
    full_name: "Carol Achieng",
    email: "carol@strathmore.edu",
    institution: "Strathmore University",
    course: "BSc. Data Science & Analytics",
  },
  {
    id: "student-4",
    full_name: "Kevin Kiprono",
    email: "kevin.kiprono@university.ac.ke",
    institution: "University of Nairobi",
    course: "BSc. Computer Science (Cybersecurity)",
  },
  {
    id: "supervisor-1",
    full_name: "James Otieno",
    email: "james.otieno@techcorp.co.ke",
    institution: "TechCorp Kenya Ltd",
    course: "",
  },
  {
    id: "supervisor-2",
    full_name: "Dr. Joyce Chelangat",
    email: "jchelangat@university.ac.ke",
    institution: "University of Nairobi",
    course: "Faculty Assessor",
  },
  {
    id: "org-admin-1",
    full_name: "Fatuma Said",
    email: "admin@techcorp.co.ke",
    institution: "TechCorp Kenya Ltd",
    course: "",
  },
  {
    id: "uni-admin-1",
    full_name: "Dr. Peter Kamau",
    email: "dean@university.ac.ke",
    institution: "University of Nairobi",
    course: "Dean of Computing",
  },
];

export const userRoles: { user_id: string; role: AppRole }[] = [
  { user_id: "student-1", role: "student" },
  { user_id: "student-2", role: "student" },
  { user_id: "student-3", role: "student" },
  { user_id: "student-4", role: "student" },
  { user_id: "supervisor-1", role: "supervisor" },
  { user_id: "supervisor-2", role: "supervisor" },
  { user_id: "org-admin-1", role: "org_admin" },
  { user_id: "uni-admin-1", role: "uni_admin" },
  { user_id: "uni-admin-1", role: "system_admin" },
];

// ── Milestones & Weekly Roadmap ─────────────────────────────────────────────
export const milestones: MockMilestone[] = [
  {
    id: "m-1",
    student_id: "student-1",
    internship_id: "intern-1",
    phase: "Phase 1: Orientation & Architecture",
    title: "Development Environment & Codebase Onboarding",
    description:
      "Set up local toolchains, review system architecture, and configure coding standards.",
    target_week: "Weeks 1 - 2",
    status: "completed",
    skills: ["Git & GitHub", "Docker", "Architecture Review"],
    tasks: [
      { id: "t-1", title: "Clone repository and verify local environment build", completed: true },
      { id: "t-2", title: "Complete security clearance & credentials setup", completed: true },
      { id: "t-3", title: "Submit first introductory pull request to verify CI", completed: true },
    ],
    supervisor_feedback: "Successfully completed onboarding ahead of schedule with zero blockers.",
    completed_at: "2026-09-08T16:00:00Z",
  },
  {
    id: "m-2",
    student_id: "student-1",
    internship_id: "intern-1",
    phase: "Phase 2: Core Feature Implementation",
    title: "UI Design System & State Architecture",
    description:
      "Design reusable UI components, integrate responsive viewports, and implement mock state.",
    target_week: "Weeks 3 - 6",
    status: "in_progress",
    skills: ["React 19", "Tailwind CSS v4", "Radix UI", "TanStack Router"],
    tasks: [
      {
        id: "t-4",
        title: "Implement Radix dialog and tabs in logbook review queue",
        completed: true,
      },
      { id: "t-5", title: "Build responsive stats dashboard with Recharts", completed: true },
      { id: "t-6", title: "Complete accessibility and screen-reader audit", completed: false },
    ],
    supervisor_feedback:
      "Great eye for UX details. Ensure mobile responsiveness is checked thoroughly.",
    completed_at: null,
  },
  {
    id: "m-3",
    student_id: "student-1",
    internship_id: "intern-1",
    phase: "Phase 3: Integration & Testing",
    title: "Performance Optimization & Automated Validation",
    description:
      "Optimize bundle sizes, implement unit test suites, and conduct cross-browser stress tests.",
    target_week: "Weeks 7 - 9",
    status: "not_started",
    skills: ["Performance Profiling", "Vitest", "Bundle Analysis"],
    tasks: [
      { id: "t-7", title: "Audit bundle size using Vite visualizer", completed: false },
      { id: "t-8", title: "Write component unit tests for critical form inputs", completed: false },
      { id: "t-9", title: "Conduct peer review session with senior mentor", completed: false },
    ],
    supervisor_feedback: null,
    completed_at: null,
  },
  {
    id: "m-4",
    student_id: "student-1",
    internship_id: "intern-1",
    phase: "Phase 4: Capstone & Final Evaluation",
    title: "Internship Capstone Presentation & Defense",
    description:
      "Compile final logbook reports, submit portfolio deliverables, and present capstone to department.",
    target_week: "Weeks 10 - 12",
    status: "not_started",
    skills: ["Technical Presentation", "Technical Writing", "Portfolio Delivery"],
    tasks: [
      {
        id: "t-10",
        title: "Generate and export final verified logbook dossier (PDF)",
        completed: false,
      },
      {
        id: "t-11",
        title: "Deliver 20-minute capstone demonstration to engineering team",
        completed: false,
      },
      {
        id: "t-12",
        title: "Complete institutional exit interview & feedback rubric",
        completed: false,
      },
    ],
    supervisor_feedback: null,
    completed_at: null,
  },
];

// ── Supervisor Evaluations ──────────────────────────────────────────────────
export const evaluations: MockEvaluation[] = [
  {
    id: "eval-1",
    student_id: "student-1",
    supervisor_id: "supervisor-1",
    internship_id: "intern-1",
    evaluation_date: "2026-09-20",
    period: "Mid-Term",
    ratings: {
      technical: 5,
      punctuality: 5,
      communication: 4,
      problem_solving: 5,
    },
    overall_score: 4.8,
    grade: "A (Distinction)",
    recommendation: "full_time_offer",
    comments:
      "Alice has exceeded expectations in frontend engineering. Her work on UI design systems and self-directed problem solving has been exemplary.",
    supervisor_name: "James Otieno",
  },
];

// ── Supervisors (Organization Mentors & University Supervisors) ──────────────
export const initialSupervisors: MockSupervisor[] = [
  {
    id: "sup-org-1",
    user_id: "supervisor-1",
    full_name: "James Otieno",
    email: "james.otieno@techcorp.co.ke",
    phone: "+254 722 001 122",
    type: "organization",
    organization_name: "TechCorp Kenya Ltd",
    faculty_department: "Product Engineering",
    title: "Senior Lead Architect & Industry Mentor",
    assigned_student_ids: ["student-1", "student-4"],
  },
  {
    id: "sup-org-2",
    user_id: undefined,
    full_name: "Grace Muthoni",
    email: "grace.muthoni@safaricom.co.ke",
    phone: "+254 722 334 455",
    type: "organization",
    organization_name: "Safaricom PLC",
    faculty_department: "Infrastructure & Cloud",
    title: "Head of Cloud Infrastructure",
    assigned_student_ids: ["student-2"],
  },
  {
    id: "sup-org-3",
    user_id: undefined,
    full_name: "Brian Njoroge",
    email: "brian.njoroge@kcb.co.ke",
    phone: "+254 733 445 566",
    type: "organization",
    organization_name: "Kenya Commercial Bank",
    faculty_department: "Business Intelligence",
    title: "Data Platform Lead",
    assigned_student_ids: ["student-3"],
  },
  {
    id: "sup-uni-1",
    user_id: "uni-admin-1",
    full_name: "Dr. Peter Kamau",
    email: "dean@university.ac.ke",
    phone: "+254 701 234 567",
    type: "university",
    organization_name: "University of Nairobi",
    faculty_department: "School of Computing & Informatics",
    title: "Dean of Computing & Faculty Assessor",
    assigned_student_ids: ["student-1", "student-3"],
  },
  {
    id: "sup-uni-2",
    user_id: "supervisor-2",
    full_name: "Dr. Joyce Chelangat",
    email: "jchelangat@university.ac.ke",
    phone: "+254 711 889 900",
    type: "university",
    organization_name: "University of Nairobi",
    faculty_department: "Department of Software Engineering",
    title: "Senior Lecturer & Academic Advisor",
    assigned_student_ids: ["student-2"],
  },
  {
    id: "sup-uni-3",
    user_id: undefined,
    full_name: "Prof. Evans Omondi",
    email: "eomondi@university.ac.ke",
    phone: "+254 799 112 233",
    type: "university",
    organization_name: "University of Nairobi",
    faculty_department: "Department of Information Systems",
    title: "Associate Professor & Industrial Liaison",
    assigned_student_ids: [],
  },
];

const SUPERVISORS_STORAGE_KEY = "internflow_supervisors_v1";
const RBAC_STORAGE_KEY = "internflow_rbac_matrix_v1";
const INTERNSHIPS_STORAGE_KEY = "internflow_internships_v1";
const ACTIVITIES_STORAGE_KEY = "internflow_activities_v1";
const ATTENDANCE_STORAGE_KEY = "internflow_attendance_v1";

export function getStoredAttendance(): MockAttendance[] {
  if (typeof window === "undefined") return attendance;
  try {
    const raw = sessionStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return attendance;
}

export function saveStoredAttendance(data: MockAttendance[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("internflow-attendance-change"));
  } catch (e) {
    // fallback
  }
}

export function getStoredActivities(): MockActivity[] {
  if (typeof window === "undefined") return activities;
  try {
    const raw = sessionStorage.getItem(ACTIVITIES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return activities;
}

export function saveStoredActivities(data: MockActivity[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("internflow-activities-change"));
  } catch (e) {
    // fallback
  }
}

export function approveOrCorrectActivity(
  actId: string,
  status: "approved" | "needs_correction",
  reviewerId: string,
  feedback?: string,
) {
  const all = getStoredActivities();
  const updated = all.map((a) =>
    a.id === actId
      ? {
          ...a,
          status,
          reviewed_by: reviewerId,
          reviewed_at: new Date().toISOString(),
          supervisor_feedback:
            feedback ||
            (status === "approved"
              ? "Verified and signed off by Host Organization Mentor."
              : "Please revise this activity log with additional technical details."),
        }
      : a,
  );
  saveStoredActivities(updated);
  return updated;
}

export function getStoredSupervisors(): MockSupervisor[] {
  if (typeof window === "undefined") return initialSupervisors;
  try {
    const raw = sessionStorage.getItem(SUPERVISORS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return initialSupervisors;
}

export function saveStoredSupervisors(data: MockSupervisor[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SUPERVISORS_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("internflow-data-change"));
  } catch (e) {
    // fallback
  }
}

export function addSupervisor(
  sup: Omit<MockSupervisor, "id" | "assigned_student_ids">,
): MockSupervisor {
  const all = getStoredSupervisors();
  const newSupervisor: MockSupervisor = {
    ...sup,
    id: `sup-${sup.type === "organization" ? "org" : "uni"}-${Date.now().toString(36)}`,
    assigned_student_ids: [],
  };
  const updated = [newSupervisor, ...all];
  saveStoredSupervisors(updated);
  return newSupervisor;
}

export function getStoredRBAC(): RolePermissionsMap {
  if (typeof window === "undefined") return DEFAULT_ROLE_PERMISSIONS;
  try {
    const raw = sessionStorage.getItem(RBAC_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return DEFAULT_ROLE_PERMISSIONS;
}

export function saveStoredRBAC(data: RolePermissionsMap) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(RBAC_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("internflow-rbac-change"));
  } catch (e) {
    // fallback
  }
}

export function getStoredInternships(): MockInternship[] {
  if (typeof window === "undefined") return internships;
  try {
    const raw = sessionStorage.getItem(INTERNSHIPS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return internships;
}

export function saveStoredInternships(data: MockInternship[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(INTERNSHIPS_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("internflow-data-change"));
  } catch (e) {
    // fallback
  }
}

export function assignSupervisors(
  studentId: string,
  orgSupervisorId: string,
  academicSupervisorId: string,
) {
  const currentInternships = getStoredInternships();
  const currentSupervisors = getStoredSupervisors();

  // Update internship
  const updatedInternships = currentInternships.map((intern) => {
    if (intern.student_id === studentId) {
      return {
        ...intern,
        supervisor_id: orgSupervisorId,
        academic_supervisor_id: academicSupervisorId,
      };
    }
    return intern;
  });
  saveStoredInternships(updatedInternships);

  // Update assigned_student_ids in supervisors
  const updatedSupervisors = currentSupervisors.map((s) => {
    let assigned = s.assigned_student_ids.filter((id) => id !== studentId);
    if (s.id === orgSupervisorId || s.id === academicSupervisorId) {
      assigned = [...assigned, studentId];
    }
    return {
      ...s,
      assigned_student_ids: Array.from(new Set(assigned)),
    };
  });
  saveStoredSupervisors(updatedSupervisors);
}

// ── Helpers ──────────────────────────────────────────────────────────────────
export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
