export interface FamsNavItem {
  label: string;
  active: boolean;
}

export interface FamsNavGroup {
  cat: string;
  items: FamsNavItem[];
}

export interface FamsCameraPose {
  rx: number;
  ry: number;
  rz: number;
  scale: number;
  tx: number;
  ty: number;
}

export interface FamsRoleConfig {
  idx: number;
  key: string;
  tier: string;
  short: string;
  pillTitle: string;
  pillSub: string;
  pillBadgeBg: string;
  pillBadgeBorder: string;
  pillBadgeText: string;
  pillBarColor: string;
  windowTier: string;
  url: string;
  name: string;
  roleLabel: string;
  initials: string;
  scopeBadge: string;
  hudIcon: string;
  hudPerm: string;
  hudTitle: string;
  baseCamera: FamsCameraPose;
  navGroups: FamsNavGroup[];
}

export const FAMS_ROLES: FamsRoleConfig[] = [
  {
    idx: 0,
    key: "student",
    tier: "Tier 1",
    short: "STUDENT",
    pillTitle: "Student Intern",
    pillSub: "Alice Wanjiku",
    pillBadgeBg: "bg-indigo-500/25",
    pillBadgeBorder: "border-indigo-400/40",
    pillBadgeText: "text-indigo-300",
    pillBarColor: "bg-indigo-400",
    windowTier: "TIER 1 (STUDENT INTERN)",
    url: "https://interntrack.uonbi.ac.ke/logbook",
    name: "Alice Wanjiku",
    roleLabel: "Student",
    initials: "AW",
    scopeBadge: "University of Nairobi • BSc. Computer Science (CS/2021/0042)",
    hudIcon: "",
    hudPerm: "logs:create • attendance:record • milestones:track",
    hudTitle: "Student Punching Shift Clock-In & Submitting AI-Polished Logbook",
    baseCamera: { rx: 7, ry: -9, rz: 0.4, scale: 0.96, tx: 0, ty: 0 },
    navGroups: [
      {
        cat: "OVERVIEW",
        items: [
          { label: "Dashboard", active: false },
          { label: "Reports & Dossier", active: false },
        ],
      },
      {
        cat: "LOGBOOK & TRACKING",
        items: [
          { label: "Digital Logbook", active: true },
          { label: "Attendance & Clock", active: false },
          { label: "Milestones Roadmap", active: false },
        ],
      },
      { cat: "ACCOUNT", items: [{ label: "My Profile", active: false }] },
    ],
  },
  {
    idx: 1,
    key: "field_supervisor",
    tier: "Tier 2",
    short: "HOST",
    pillTitle: "Field Supervisor",
    pillSub: "James Otieno (Host)",
    pillBadgeBg: "bg-lime-500/20",
    pillBadgeBorder: "border-lime-400/40",
    pillBadgeText: "text-lime-300",
    pillBarColor: "bg-lime-400",
    windowTier: "TIER 2 (HOST ORG FIELD SUPERVISOR)",
    url: "https://interntrack.uonbi.ac.ke/review",
    name: "James Otieno",
    roleLabel: "Host Org Field Supervisor",
    initials: "JO",
    scopeBadge: "TechCorp Kenya Ltd • Pre-Provisioned Login Bound to Alice & Kevin",
    hudIcon: "",
    hudPerm: "logs:approve • attendance:audit (Scoped to Assigned Mentees)",
    hudTitle: "Field Supervisor Reviewing Daily Engineering Log & Signing Off",
    baseCamera: { rx: 6, ry: 8, rz: -0.4, scale: 0.96, tx: 0, ty: 0 },
    navGroups: [
      {
        cat: "OVERVIEW",
        items: [
          { label: "Dashboard", active: false },
          { label: "Reports & Dossier", active: false },
        ],
      },
      { cat: "LOGBOOK & TRACKING", items: [{ label: "Milestones Roadmap", active: false }] },
      {
        cat: "SUPERVISORY CONTROLS",
        items: [
          { label: "Review Queue", active: true },
          { label: "Assigned Interns", active: false },
          { label: "Performance Evaluations", active: false },
        ],
      },
      { cat: "ACCOUNT", items: [{ label: "My Profile", active: false }] },
    ],
  },
  {
    idx: 2,
    key: "uni_supervisor",
    tier: "Tier 3",
    short: "FACULTY",
    pillTitle: "Uni Supervisor",
    pillSub: "Dr. Joyce Chelangat",
    pillBadgeBg: "bg-sky-500/20",
    pillBadgeBorder: "border-sky-400/40",
    pillBadgeText: "text-sky-300",
    pillBarColor: "bg-sky-400",
    windowTier: "TIER 3 (UNIVERSITY ACADEMIC SUPERVISOR)",
    url: "https://interntrack.uonbi.ac.ke/evaluations",
    name: "Dr. Joyce Chelangat",
    roleLabel: "University Academic Assessor",
    initials: "JC",
    scopeBadge: "️ University of Nairobi • Dept. of Software Engineering Assessor",
    hudIcon: "️",
    hudPerm: "assessments:grade • milestones:certify",
    hudTitle: "University Assessor Grading 5-Point Rubric & Certifying Phase 2",
    baseCamera: { rx: 8, ry: -7, rz: 0.3, scale: 0.96, tx: 0, ty: 0 },
    navGroups: [
      {
        cat: "OVERVIEW",
        items: [
          { label: "Dashboard", active: false },
          { label: "Reports & Dossier", active: false },
        ],
      },
      { cat: "LOGBOOK & TRACKING", items: [{ label: "Milestones Roadmap", active: false }] },
      {
        cat: "SUPERVISORY CONTROLS",
        items: [
          { label: "Review Queue", active: false },
          { label: "Assigned Interns", active: false },
          { label: "Performance Evaluations", active: true },
        ],
      },
      { cat: "ACCOUNT", items: [{ label: "My Profile", active: false }] },
    ],
  },
  {
    idx: 3,
    key: "uni_admin",
    tier: "Tier 4",
    short: "UNIVERSITY",
    pillTitle: "Uni Admin (Dean)",
    pillSub: "Dr. Peter Kamau",
    pillBadgeBg: "bg-purple-500/20",
    pillBadgeBorder: "border-purple-400/40",
    pillBadgeText: "text-purple-300",
    pillBarColor: "bg-purple-400",
    windowTier: "TIER 4 (UNIVERSITY ADMIN & DEAN)",
    url: "https://interntrack.uonbi.ac.ke/assignments",
    name: "Dr. Peter Kamau",
    roleLabel: "University Admin",
    initials: "DP",
    scopeBadge: "️ Dean of Computing • Institutional Pairing, Credentials & RBAC Matrix",
    hudIcon: "️",
    hudPerm: "supervisors:create • supervisors:assign • rbac:manage • accreditation:export",
    hudTitle: "University Admin Pairing Dual Supervisors & Governing RBAC Matrix",
    baseCamera: { rx: 6.5, ry: 6.5, rz: -0.3, scale: 0.96, tx: 0, ty: 0 },
    navGroups: [
      {
        cat: "OVERVIEW",
        items: [
          { label: "Dashboard", active: false },
          { label: "Reports & Dossier", active: false },
        ],
      },
      {
        cat: "SUPERVISORY CONTROLS",
        items: [
          { label: "Review Queue", active: false },
          { label: "Assigned Interns", active: false },
          { label: "Performance Evaluations", active: false },
        ],
      },
      {
        cat: "INSTITUTIONAL & RBAC",
        items: [
          { label: "Supervisor Accounts", active: false },
          { label: "Supervisor Pairing", active: true },
          { label: "RBAC Control Matrix", active: false },
          { label: "Placement Accreditation", active: false },
        ],
      },
    ],
  },
];
