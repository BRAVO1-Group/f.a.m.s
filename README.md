<div align="center">

# 🎓 InternFlow Pro

### _Modern Frontend Template & UI Kit for Internship Management & Digital Logbooks_

[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Zero Backend Required](https://img.shields.io/badge/Backend-Zero%20Config%20Required-success?style=for-the-badge)](https://github.com/shaficmukama0-hash/intern-flow)

<p align="center">
  <b>A sleek, interactive frontend starter template for student logbooks, mentorship portals, and internship tracking.</b><br/>
  Runs 100% in the browser out of the box with zero server configuration, mock personas, responsive dashboard layouts, and clean UI components.
</p>

<p align="center">
  <a href="#-quick-start">🚀 Quick Start</a> •
  <a href="#-interactive-demo-personas">🎭 Demo Personas</a> •
  <a href="#-ui-features--screens">✨ UI Features</a> •
  <a href="#-route-map">🗺️ Route Map</a> •
  <a href="#-frontend-tech-stack">🛠️ Tech Stack</a> •
  <a href="#-interactive-tour-checklist">✅ Tour Checklist</a>
</p>

</div>

---

## 🌟 Why This Template?

Need to build or demo an educational internship platform, digital logbook, or student activity portal without setting up complex backend servers or databases?

| Traditional Prototypes                     | ⚡ InternFlow Frontend Template                                          |
| :----------------------------------------- | :----------------------------------------------------------------------- |
| Empty static wireframes with `Lorem Ipsum` | **Realistic mock state** with student records, logbooks & analytics      |
| Requires spinning up databases & servers   | **Zero backend setup** — clone, `npm install`, and run instantly in Vite |
| One generic view for every user            | **4 Switchable user personas** (Student, Supervisor, Org Admin, Dean)    |
| Hardcoded, rigid UI elements               | **Modular React 19 + Radix UI + Tailwind CSS v4** component library      |
| Basic text tables                          | **Interactive Recharts**, live search filters & printable report layouts |

---

## 🎭 Interactive Demo Personas

Test all persona views directly in the browser! Switch roles with a single click from the `/auth` screen:

| Role              | Persona             | Email                         | UI Views Demonstrated                                                           |
| :---------------- | :------------------ | :---------------------------- | :------------------------------------------------------------------------------ |
| 🧑‍🎓 **Student**    | **Alice Wanjiku**   | `alice@university.ac.ke`      | Daily activity logbook, AI text enhancement, digital clock-in, report generator |
| 👨‍💼 **Supervisor** | **James Otieno**    | `james.otieno@techcorp.co.ke` | Review queue, entry approval/rejection cards, feedback drawers                  |
| 🏢 **Org Admin**  | **Fatuma Said**     | `admin@techcorp.co.ke`        | Company roster view, mentor assignments, placement metrics                      |
| 🏛️ **Uni Admin**  | **Dr. Peter Kamau** | `dean@university.ac.ke`       | University-wide overview, active/inactive student filters, summary tables       |

<details>
<summary><b>👉 How to switch personas instantly</b></summary>

1. Start your local dev server (`npm run dev`).
2. Go to [http://localhost:3000/auth](http://localhost:3000/auth).
3. Click any of the **Demo User Cards** (Alice, James, Fatuma, Dr. Peter) to instantly explore the app as that persona!

</details>

---

## ✨ UI Features & Screens

### 📖 1. Digital Logbook View

- **Rich Activity Form**: Inputs for date, arrival/departure timestamps, tools used, skills gained, challenges, solutions, and work attachments.
- **⚡ Quick Starter Templates**: 1-click presets for Frontend Components, API Caching, Bug Triage, and Sprint Planning.
- **📄 Work Evidence & Attachments**: Simulated file attachment dropzone with previews and file chips.
- **Dynamic UI Tags**: Color-coded badges for `Draft`, `Submitted`, `Approved` ✅, and `Changes Requested` ⚠️.
- **Instant Search & Filter**: Filter client-side entries in real time by search query, tools, or status.

### 🤖 2. Simulated AI Writing Assistant UI

- Features an interactive **"AI Polish"** action that takes quick notes and formats them into professional descriptions:

```diff
- "Fixed bug in login button"
+ "Identified and resolved race condition in OAuth callback handler; implemented defensive error states and improved authentication latency by 14%."
```

<details>
<summary><b>🔍 Preview AI prompt transformation examples</b></summary>

| Student's Rough Note                            | Transformed Output                                                                                                                                                              |
| :---------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| _"Designed some Figma screens and showed team"_ | _"Engineered responsive UI/UX prototypes adhering to WCAG 2.1 accessibility standards in Figma; conducted stakeholder design review and iterated based on ergonomic feedback."_ |
| _"Looked into database slowdown"_               | _"Profiled slow-query traces, structured indexing on high-traffic tables, and reduced query latency by 35%."_                                                                   |

</details>

### 🎯 3. Milestones & 12-Week Roadmap (`/milestones`)

- **Structured Phases**: Tracks progression across 4 phases (Orientation, Core Implementation, Integration, Capstone).
- **Interactive Checklists**: Students and mentors can check off required milestone deliverables.
- **Mentor Sign-Offs**: Displays supervisor feedback notes on validated milestones.

### 🏆 4. Supervisor Performance Rubric & AI Appraisals (`/review`)

- **Multi-Pillar Rubric**: Evaluates interns across Technical Execution, Punctuality, Teamwork, and Problem Solving (1-5 stars).
- **Dynamic Grading**: Calculates composite grade (`A+ Outstanding`, `A Distinction`, `B+ Proficient`).
- **AI Recommendation Draft**: Generates customized appraisal narratives and employment recommendation letters.

### ⏱️ 5. Attendance & Turnstile Verification (`/attendance`)

- **QR Code Turnstile Scanner**: Simulated optical entrance badge scanner.
- **GPS Geofence Indicator**: Verified office coordinates and perimeter badge.
- **Active Shift Tracker**: Real-time shift status with attendance history and completion rate.

### 📊 6. Analytics & Competency Matrix (`/dashboard`)

- **Recharts Charts**: Pre-configured responsive charts for activity volume trends.
- **Competency Progression Matrix**: Visual skill mastery gauges mapped against curriculum standards.

### 📑 7. Printable Report Dossier (`/reports`)

- Pre-styled print template for Weekly, Monthly, and Final Internship dossiers.
- Standard CSS print stylesheets for clean browser PDF export.

---

## 🗺️ Route Map

| Route         | Role Preview    | Screen Description                                             |
| :------------ | :-------------- | :------------------------------------------------------------- |
| `/`           | Public          | Marketing landing page with hero, feature grid, and stats      |
| `/auth`       | Public          | Demo persona selection & login interface                       |
| `/dashboard`  | Authenticated   | Competency matrix, activity volume charts & stats cards        |
| `/logbook`    | Student View    | Quick templates, AI polish tool, evidence chips & log entries  |
| `/milestones` | All Roles       | 12-week curriculum roadmap & interactive task deliverables     |
| `/attendance` | Student View    | QR scanner simulator, GPS geofence verification & history      |
| `/review`     | Supervisor View | Activity triage queue & 4-pillar performance evaluation rubric |
| `/reports`    | All Roles       | Formatted reports ready for browser printing or PDF saving     |
| `/profile`    | All Roles       | Student details card, institution profile & placement status   |
| `/admin`      | Admin View      | Institutional directory, intern roster & company filters       |

---

## 🛠️ Frontend Tech Stack

<div align="center">

| Layer                    | Tools                                                                                           |
| :----------------------- | :---------------------------------------------------------------------------------------------- |
| **Core**                 | [React 19](https://react.dev/), [TypeScript 5.8](https://www.typescriptlang.org/)               |
| **Styling**              | [Tailwind CSS v4](https://tailwindcss.com/), `@tailwindcss/vite`, `tw-animate-css`              |
| **Component Primitives** | [Radix UI](https://www.radix-ui.com/) (Dialogs, Dropdowns, Tabs, Tooltips, Popovers)            |
| **Routing**              | [TanStack Router](https://tanstack.com/router) with type-safe client navigation                 |
| **Data Visualization**   | [Recharts 2](https://recharts.org/)                                                             |
| **Forms & Validation**   | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)                        |
| **Icons**                | [Lucide React](https://lucide.dev/)                                                             |
| **Bundler**              | [Vite 8](https://vitejs.dev/) with fast HMR                                                     |
| **Data Layer**           | 100% In-Memory Mock Store (`src/lib/mock-data.ts`) — easily swappable with any REST/GraphQL API |

</div>

---

## 🚀 Quick Start

### 1. Clone & Enter

```bash
git clone https://github.com/shaficmukama0-hash/intern-flow.git
cd intern-flow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Launch the Frontend Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the template in your browser. No environment variables or database setup needed!

### Available Scripts

| Script            | Purpose                                       |
| :---------------- | :-------------------------------------------- |
| `npm run dev`     | Launch local Vite dev server with instant HMR |
| `npm run build`   | Build the frontend bundle for production      |
| `npm run preview` | Locally preview the production build          |
| `npm run lint`    | Run ESLint checks                             |
| `npm run format`  | Format code with Prettier                     |

---

## ✅ Interactive Tour Checklist

Explore all the pre-built screens in minutes:

- [ ] **Step 1:** Visit `/auth` and select **Alice Wanjiku (Student)**.
- [ ] **Step 2:** Navigate to `/logbook` and click **New Entry**.
- [ ] **Step 3:** Enter a draft activity note, click **✨ AI Polish**, and observe the UI update.
- [ ] **Step 4:** Navigate to `/attendance` and test the **Check In** button.
- [ ] **Step 5:** Return to `/auth` and select **James Otieno (Supervisor)**.
- [ ] **Step 6:** Visit `/review` to test the supervisor approval and feedback modal.
- [ ] **Step 7:** Switch to **Dr. Peter Kamau (Admin)** and view the institution roster at `/admin`.
- [ ] **Step 8:** Visit `/reports` and preview the printable internship dossier!

---

## 🎨 Customizing & Connecting an API

This template is designed to be easily adapted:

- **Mock Data**: Edit [src/lib/mock-data.ts](file:///home/byte/Projects/dev/intern-flow/src/lib/mock-data.ts) to adjust initial demo records, students, and companies.
- **Color Theme**: Tailored using Tailwind CSS v4 variables in [src/styles.css](file:///home/byte/Projects/dev/intern-flow/src/styles.css).
- **API Integration**: Replace the in-memory mock handlers with your preferred HTTP client (`fetch`, `axios`, or TanStack Query) when connecting to your own backend.

---

<div align="center">

Built as a modern, clean frontend starter for educational and internship platforms.

**[⬆ Back to Top](#-internflow-pro)**

</div>
