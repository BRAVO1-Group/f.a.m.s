# InternTrack Pro — Smart Internship Management System

InternTrack Pro is a modern, enterprise-grade Digital Internship Management & Logbook Operating System designed to replace traditional paper-based attachment logbooks with a secure, centralized, and accredited online platform.

The system connects **Students**, **Host Organization Field Supervisors**, **University Faculty Assessors**, and **Institutional Administrators** into a unified, real-time workflow. It streamlines daily logging, automated attendance verification, dual-track supervisor sign-offs, and institutional defense clearance.

---

## Table of Contents

- [Overview & Value Proposition](#overview--value-proposition)
- [System Architecture & Tech Stack](#system-architecture--tech-stack)
- [Role-Based Access Control (RBAC Architecture)](#role-based-access-control-rbac-architecture)
- [Core Stakeholder Modules](#core-stakeholder-modules)
  - [1. Student Intern Portal](#1-student-intern-portal)
  - [2. Host Organization Field Supervisor (Industry Mentor)](#2-host-organization-field-supervisor-industry-mentor)
  - [3. University Academic Supervisor (Faculty Assessor)](#3-university-academic-supervisor-faculty-assessor)
  - [4. University Administrator Console](#4-university-administrator-console)
- [Functional Capabilities](#functional-capabilities)
  - [Digital Logbook Lifecycle](#digital-logbook-lifecycle)
  - [Attendance & Time Tracking](#attendance--time-tracking)
  - [Dual-Supervisor Pairing & Credential Dispatch](#dual-supervisor-pairing--credential-dispatch)
  - [RBAC Control Matrix](#rbac-control-matrix)
  - [Accredited Report Generation & AI Assistant](#accredited-report-generation--ai-assistant)
- [Repository Structure](#repository-structure)
- [Getting Started & Local Development](#getting-started--local-development)
- [Demo Personas & Test Credentials](#demo-personas--test-credentials)
- [Build & Deployment](#build--deployment)
- [Lovable Integration](#lovable-integration)

---

## Overview & Value Proposition

Traditional university attachment and internship programs suffer from critical operational bottlenecks:

- **Lost or forged physical logbooks** lacking verifiable audit trails.
- **Delayed supervisor feedback** that reaches students weeks after tasks are completed.
- **Uncoordinated dual supervision** between on-site industry mentors and visiting university faculty.
- **Labor-intensive manual grading** and last-minute report preparation panics prior to academic defense.

**InternTrack Pro** resolves these challenges by providing:

- **Real-Time Verification**: Instant daily activity submission, approval, revision requests, and digital timestamping.
- **Dual Supervision Model**: Simultaneous oversight from host organization field mentors and university academic advisors.
- **University Credential Dispatch**: Company supervisors receive pre-provisioned university credentials tied directly to their assigned interns, preventing unauthorized access.
- **Accredited Exports**: Instant generation of standardized, defense-ready PDF/Word logbook dossiers.

---

## System Architecture & Tech Stack

InternTrack Pro is engineered as a high-performance, full-stack TypeScript application utilizing modern web standards:

| Layer                       | Technologies                                                                                                                |
| :-------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| **Frontend Framework**      | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)                                               |
| **Routing & SSR**           | [TanStack Start](https://tanstack.com/start), [TanStack Router](https://tanstack.com/router) (type-safe file-based routing) |
| **Data Fetching & State**   | [TanStack Query](https://tanstack.com/query) with reactive in-memory & session persistence                                  |
| **UI Components & Icons**   | [shadcn/ui](https://ui.shadcn.com/) primitives, [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)  |
| **Styling & Design Tokens** | [Tailwind CSS v4](https://tailwindcss.com/) with custom OKLCH color palettes and glassmorphism                              |
| **Charts & Visualizations** | [Recharts](https://recharts.org/) (time-series attendance curves, competency radars, completion meters)                     |
| **Notifications**           | [Sonner](https://sonner.emilkowal.ski/) rich-toast notification engine                                                      |
| **Runtime & Build Tooling** | [Vite](https://vitejs.dev/), [Nitro Server](https://nitro.unjs.io/)                                                         |

---

## Role-Based Access Control (RBAC Architecture)

The system implements a **5-Tier Role-Based Access Control** hierarchy enforcing strict principle-of-least-privilege boundaries:

```
┌─────────────────────────────────────────────────────────────┐
│                 Tier 5: System Administrator                │
│     Global Infrastructure, Audit Logs, System Operations     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│           Tier 4 / Tier 3: University Administrator         │
│  Supervisor Provisioning, Intern Pairing, RBAC Governance   │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            │                                     │
┌───────────▼─────────────┐             ┌─────────▼───────────┐
│ Tier 2A: Field Mentor   │             │ Tier 2B: Faculty    │
│ Host Org Supervisor     │             │ Academic Assessor   │
│ (Dispatched Logins)     │             │ (Curriculum Defense)│
└───────────┬─────────────┘             └─────────┬───────────┘
            │                                     │
            └──────────────────┬──────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                   Tier 1: Student Intern                    │
│   Daily Logbook, Check-In/Out, Milestone Tracking, Exports  │
└─────────────────────────────────────────────────────────────┘
```

| Role                          |    Tier    | Primary Responsibilities & Scope                                                                                                                                                    |
| :---------------------------- | :--------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Student Intern**            |  `Tier 1`  | Records daily technical logs, punches attendance timestamps, tracks milestones, generates accredited logbook reports.                                                               |
| **Host Org Field Supervisor** |  `Tier 2`  | Receives university-issued logins; scoped strictly to assigned student(s); reviews logs, approves daily submissions, adds technical guidance notes, completes industry evaluations. |
| **Academic Supervisor**       |  `Tier 2`  | Faculty assessor monitoring academic syllabus competencies, visiting assessments, and institutional defense readiness.                                                              |
| **University Administrator**  | `Tier 3/4` | Provisions supervisor accounts, assigns host organizations/field mentors and academic staff to students, customizes RBAC permissions matrix, audits cohort compliance.              |
| **System Administrator**      |  `Tier 5`  | Platform-level operations, security policies, backup scheduling, and infrastructure health.                                                                                         |

---

## Core Stakeholder Modules

### 1. Student Intern Portal

- **Daily Activity Logging**: Record date, check-in/out hours, technical summary, detailed task description, tools/frameworks utilized, skills acquired, challenges encountered, and evidence attachments.
- **Real-Time Status Tracking**: Dynamic status indicators (`Draft`, `Submitted / In Review`, `Approved`, `Revision Requested`).
- **Workplace Attendance Meter**: Real-time attendance percentage, total verified days accumulator (e.g. 42 / 60 required days), and shift duration logs.
- **Supervisor Feedback Timeline**: Immediate visibility into mentor feedback notes with explicit guidance on requested corrections.
- **Milestone Goals**: Interactive roadmap decomposing 12-week placements into structured milestones (Onboarding, Architecture Design, Core Development, Performance Optimization, Defense Preparation).

### 2. Host Organization Field Supervisor (Industry Mentor)

- **University-Dispatched Credentials**: Field supervisors log in using pre-provisioned credentials dispatched by the university administration (self-registration is disabled).
- **Student-Bound Scope**: Access is strictly sandboxed to allocated intern(s). Field supervisors only see candidates assigned to their direct workplace supervision.
- **One-Click Review & Approval Queue**:
  - `Quick Approve`: Digitally stamps logbook entries as verified by host organization.
  - `Request Revision`: Rejects inadequate entries with explicit guidance for student resubmission.
  - `Mentor Notes`: Adds technical recommendations recorded directly in the official accreditation logbook.
- **Attendance Verification**: Reviews daily start/finish timestamps and total completed workplace shifts.
- **Industry Evaluations**: Evaluates professional competencies (technical proficiency, punctuality, teamwork, problem-solving).

### 3. University Academic Supervisor (Faculty Assessor)

- **Academic Milestone Auditing**: Evaluates whether student activities satisfy university departmental curriculum and engineering syllabus requirements.
- **Visiting Assessment Logs**: Records notes and scoring from physical/virtual on-site evaluation visits.
- **Mid-Term & Final Defense Clearance**: Grants institutional sign-off verifying candidates have fulfilled prerequisite days and competencies.

### 4. University Administrator Console

- **Supervisor Account Provisioning**: Creates accounts for both Host Organization Mentors (field supervisors) and University Academic Staff.
- **Dual-Supervisor Allocation**: Pairs students with an employer field supervisor and a faculty advisor in a single unified workflow.
- **Credential Dispatch Management**: Generates and dispatches pre-provisioned login credentials directly to corporate supervisors.
- **Cohort Compliance Dashboard**: Real-time tracking across partner companies (average attendance, total verified entries, at-risk candidates).
- **Interactive RBAC Permission Matrix**: Grants or restricts fine-grained permissions across all system roles with instant enforcement.

---

## Functional Capabilities

### Digital Logbook Lifecycle

```
[Draft Saved] ──► [Submitted for Review] ──► [Supervisor Review Queue]
                                                     │
                             ┌───────────────────────┴───────────────────────┐
                             │                                               │
                             ▼                                               ▼
               [Approved & Digitally Stamped]                  [Revision Requested with Notes]
                             │                                               │
                             ▼                                               ▼
              (Increments Verified Days)                          (Student Edits & Resubmits)
```

### Attendance & Time Tracking

- Shift tracking with automatic work-hour calculation (e.g. 08:30 – 17:00 = 8.5 hours).
- Required days progress gauge against university targets (e.g. 42 / 60 days = 70% completed).
- Historical log of on-time arrival and daily shift records.

### Dual-Supervisor Pairing & Credential Dispatch

- Assigning an organization to an intern fundamentally represents **assigning the company's designated Field Supervisor**.
- The university administrator inputs the employer mentor's details (name, corporate email, job title, department).
- A pre-provisioned corporate credential set is generated and linked strictly to that student's record.

### RBAC Control Matrix

- Full-matrix permission manager allowing university administrators to toggle granular permissions across 13 functional privileges:
  - `logbook.create`, `logbook.edit`, `logbook.view_own`, `logbook.view_assigned`, `logbook.approve`
  - `attendance.punch`, `attendance.view_own`, `attendance.view_assigned`
  - `reports.generate`, `reports.export_pdf`
  - `admin.supervisors`, `admin.assignments`, `admin.rbac`
- Changes take effect dynamically across all active sessions.

### Accredited Report Generation & AI Assistant

- **Automated Dossier Generation**: Generates official accreditation reports with institution headings, attendance logs, verified supervisor stamps, and grade breakdowns.
- **Export Formats**: Standardized PDF and Word document (.docx) formats.
- **AI Report Assistant**: Transforms brief student log notes into polished, articulate engineering summaries adhering to institutional documentation standards.

---

## Repository Structure

```
intern-flow/
├── public/                      # Static assets, logos, and favicon
├── src/
│   ├── components/
│   │   ├── ui/                  # Reusable shadcn/ui components (cards, tables, badges, dialogs, etc.)
│   │   └── AppShell.tsx         # Unified dashboard shell with responsive navigation and persona switcher
│   ├── lib/
│   │   ├── auth.tsx             # Authentication context, session management, and RBAC utilities
│   │   ├── mock-data.ts         # In-memory mock database and state initializers
│   │   └── utils.ts             # Styling and class merging helpers
│   ├── routes/
│   │   ├── __root.tsx           # Application root layout with Sonner Toaster
│   │   ├── index.tsx            # Public landing page with interactive 3-role sandbox simulation
│   │   ├── auth.tsx             # Secure login and role-dispatch demo portal
│   │   ├── _authenticated.tsx   # Authenticated route guard layout
│   │   ├── _authenticated.dashboard.tsx   # Role-adaptive dashboard (Student, Supervisor, University)
│   │   ├── _authenticated.logbook.tsx     # Student digital logbook drafting & entry history
│   │   ├── _authenticated.attendance.tsx  # Shift clock-in/out and attendance meters
│   │   ├── _authenticated.milestones.tsx  # 12-week competency roadmap and goal tracker
│   │   ├── _authenticated.review.tsx      # Supervisor submission review & approval queue
│   │   ├── _authenticated.supervisors.tsx # University supervisor provisioning console
│   │   ├── _authenticated.assignments.tsx # Dual-supervisor pairing & organization assignment
│   │   ├── _authenticated.rbac.tsx        # Interactive RBAC permissions control matrix
│   │   ├── _authenticated.students.tsx    # Cohort student directory & progress tracking
│   │   ├── _authenticated.evaluations.tsx # Industrial and academic evaluation scoring
│   │   ├── _authenticated.reports.tsx     # Defense report & accredited logbook exporter
│   │   └── _authenticated.profile.tsx     # User profile and account preferences
│   ├── styles.css               # Design system tokens, OKLCH color definitions, and Tailwind config
│   ├── routeTree.gen.ts         # Automatically generated TanStack Router route tree
│   └── start.ts / server.ts     # TanStack Start / Nitro SSR server entrypoints
├── package.json                 # Project dependencies and script definitions
├── vite.config.ts               # Vite configuration and build pipelines
└── tsconfig.json                # TypeScript compiler configuration
```

---

## Getting Started & Local Development

### Prerequisites

- **Node.js**: Version 18.18.0 or newer
- **npm** (or **bun** / **pnpm**)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shaficmukama0-hash/intern-flow.git
   cd intern-flow
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Launch the development server:

   ```bash
   npm run dev
   ```

4. Open your browser at:
   ```
   http://localhost:8080/
   ```

### Available Scripts

| Script            | Purpose                                                           |
| :---------------- | :---------------------------------------------------------------- |
| `npm run dev`     | Starts Vite dev server with hot-module replacement on port `8080` |
| `npm run build`   | Compiles client and SSR bundles with full TypeScript validation   |
| `npm run preview` | Previews the compiled production build locally                    |
| `npm run format`  | Runs Prettier across all project files                            |
| `npm run lint`    | Performs ESLint static code analysis                              |

---

## Demo Personas & Test Credentials

The platform includes pre-configured demo personas to immediately explore each role's permissions and workflow:

| Stakeholder Role                | Demo User         | Organization / Department                   | Clearance Level |
| :------------------------------ | :---------------- | :------------------------------------------ | :-------------: |
| **Student Intern**              | Alice Wanjiku     | TechCorp Kenya Ltd (Intern)                 |    `Tier 1`     |
| **Host Org Field Supervisor**   | James Otieno      | TechCorp Kenya Ltd (Senior Staff Engineer)  |    `Tier 2`     |
| **Academic Faculty Supervisor** | Dr. Agnes Kimani  | University of Nairobi (School of Computing) |    `Tier 2`     |
| **University Administrator**    | Dr. Patrick Kamau | University of Nairobi (Dean's Office)       |    `Tier 4`     |
| **System Administrator**        | Alex Mercer       | InternTrack Infrastructure Operations       |    `Tier 5`     |

> [!TIP]
> Use the **Account Menu** in the top navigation bar or the **Persona Quick Switcher** at the bottom of the sidebar to seamlessly toggle between personas and observe real-time RBAC UI adaptation.

---

## Build & Deployment

InternTrack Pro compiles into a unified client-server bundle powered by TanStack Start and Nitro:

```bash
# Build production bundle
npm run build
```

The output directory `.output/` is ready for zero-config serverless or edge deployment on **Cloudflare Pages / Workers**, **Vercel**, **Netlify**, or **Node.js Docker containers**.

---

## Lovable Integration

This project is connected with [Lovable](https://lovable.dev).

### Development with Lovable

- Changes committed and pushed to the repository automatically sync with the Lovable editor.
- Git history should preserve clean, progressive commits without history rewriting (`git push --force` or destructive rebasing).

---

## License

This software is released under the **MIT License**. Copyright &copy; 2026 InternTrack Pro.
