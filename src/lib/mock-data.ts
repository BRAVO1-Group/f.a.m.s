/**
 * PROTOTYPE / DEMO MODE
 * All data is mocked in-memory. No Supabase or network calls are made.
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
  supervisor_id: string;
  position: string;
  department: string;
  start_date: string;
  end_date: string;
  required_days: number;
  status: "active" | "completed" | "pending";
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
    supervisor_id: "supervisor-1",
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
    supervisor_id: "supervisor-1",
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
    supervisor_id: "supervisor-1",
    position: "Data Analyst Intern",
    department: "Business Intelligence",
    start_date: "2026-06-01",
    end_date: "2026-08-31",
    required_days: 60,
    status: "completed",
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
    institution: "KU",
    course: "BSc. Networking",
  },
  {
    id: "student-3",
    full_name: "Carol Achieng",
    email: "carol@strathmore.edu",
    institution: "Strathmore University",
    course: "BSc. Data Science",
  },
  {
    id: "supervisor-1",
    full_name: "James Otieno",
    email: "james.otieno@techcorp.co.ke",
    institution: "",
    course: "",
  },
  {
    id: "org-admin-1",
    full_name: "Fatuma Said",
    email: "admin@techcorp.co.ke",
    institution: "",
    course: "",
  },
  {
    id: "uni-admin-1",
    full_name: "Dr. Peter Kamau",
    email: "dean@university.ac.ke",
    institution: "University of Nairobi",
    course: "",
  },
];

export const userRoles: { user_id: string; role: AppRole }[] = [
  { user_id: "student-1", role: "student" },
  { user_id: "student-2", role: "student" },
  { user_id: "student-3", role: "student" },
  { user_id: "supervisor-1", role: "supervisor" },
  { user_id: "org-admin-1", role: "org_admin" },
  { user_id: "uni-admin-1", role: "uni_admin" },
  { user_id: "uni-admin-1", role: "system_admin" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
