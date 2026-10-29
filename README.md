# UniFlow — Complete University Management System

A centralized, responsive, frontend-only University Management System (UMS) built using **HTML5**, **CSS3**, and modern **Vanilla JavaScript (ES6+ Modules)** with **Browser LocalStorage** persistence and **Native SVG** analytics.

---

## 1. Project Overview

**UniFlow** provides a centralized administration portal for managing an academic institution's entire structural hierarchy:

$$\text{University} \longrightarrow \text{Faculties / Departments} \longrightarrow \text{Degree Programs / Courses} \longrightarrow \text{Academic Sessions} \longrightarrow \text{Semesters} \longrightarrow \text{Classes / Sections} \longrightarrow \text{Enrollments} \longrightarrow \text{Students}$$

Built as a single-page architecture (SPA) with a lightweight client-side router, it requires zero external frameworks, build tools, or third-party CSS dependencies.

---

## 2. Core Modules & Features

### 🏛️ 1. Dynamic University Dashboard
* **Dynamic KPI Metrics**: Real-time counts of Total Students, Active Ratio, Departments, Degree Programs, Academic Sessions, and Configured Sections. (Never hardcoded; calculated on the fly).
* **Native SVG Bar Charts**: Department enrollment distribution and course program enrollment with animated bars, gridlines, and tooltips.
* **Native SVG Donut Charts**: Active vs. inactive student ratios with proportional SVG arcs and interactive legends.
* **Session Intake Chart**: Cohort volumes mapped against active academic calendars.
* **Audit History & Activity Feed**: Chronological log of recent institutional administrative actions.
* **Recent Matriculations**: Quick overview table of the latest admitted students with instant profile links.

### 🏢 2. Department Management
* Complete CRUD (Create, Read, Update, Delete) for academic faculties.
* Fields: Department Name, Unique Code, Head of Department (HOD), Status, Description, Timestamps.
* **Referential Integrity & Safe Deletion**: Blocks permanent deletion if dependent courses or enrolled students exist; provides a one-click safe deactivation alternative.
* Search by name/code, filter by status, and live sorting.
* Direct drill-down links to view each department's associated degree programs and enrolled students.

### 🎓 3. Course / Degree Program Management
* Configure Undergraduate, Postgraduate, Diploma, and Doctorate programs.
* Fields: Program Name, Unique Code, Parent Department, Degree Type, Duration in Years (1–6), Number of Semesters (1–12), Description, Status.
* **Automatic Semester Generation**: Automatically creates curriculum semester slots upon course creation.
* Search, department filters, status filters, and enrolled student counts.
* Safe deletion checks prevent deleting active programs with enrolled students.

### 📅 4. Academic Sessions Management
* Academic intake calendars (e.g. `2024–2025`, `2025–2026`, `2026–2027`).
* Date range validation (enforces Start Date < End Date).
* Status management (`active`, `upcoming`, `completed`, `inactive`).
* Student cohort counting per academic session.

### 📚 5. Semesters & Terms Module
* Curriculum semester levels organized under each course program.
* Uniqueness enforcement (prevents duplicate semester numbers for the same course).
* Enrolled student counts per semester.
* Course-based filtering and instant editing.

### 👥 6. Classes & Sections Module
* Class cohort groups (e.g. `Section A`, `Section B`) tied to Course, Semester, and Academic Session.
* Class Representative / Prefect appointment.
* Uniqueness validation prevents duplicate section names for the same semester cohort.
* Enrolled student count per section.

### 🎓 7. Student Registry & Management
* Comprehensive student directory with multi-field search (Name, Registration Number, Email, Phone).
* Multi-faceted filtering: Department, Course, Semester, Academic Session, Section, and Standing Status (`active`, `inactive`, `archived`).
* **Dynamic Cascading Placement**:
  $$\text{Department} \longrightarrow \text{Course} \longrightarrow \text{Semester} \longrightarrow \text{Section}$$
  Selecting a department immediately cascades to show only its courses; selecting a course dynamically loads its semesters; selecting a semester loads valid sections.
* Unique Registration Number enforcement (case-insensitive check against collision).
* Email format validation and required field trimming.
* Column sorting by Registration Number or Student Name.
* Client-side pagination with configurable page size (5, 10, 25, 50 rows).
* One-click CSV export of currently filtered student lists.

### 👤 8. Dedicated Student Profile / Dossier (`#/student-details/:id`)
* Student hero card with initials avatar, status pill, and official university credentials.
* Contact demographics: Email, Phone, Gender, Admission Date.
* Current Academic Placement breakdown (Department, Program, Term, Cohort Section, Session).
* **Academic Placement Workflow**: Interactive modal to promote a student to a new semester or transfer programs, preserving historic placement records.
* **Enrollment History Timeline**: Chronological visual audit trail of all previous placements.

### 📊 9. Reports & Analytical Exports
* Dedicated analytical reports for:
  1. Department-wise student enrollment summary & institutional share
  2. Course program breakdown by degree level
  3. Semester-wise enrollment milestones
  4. Academic session intake reports
  5. Student standing & status breakdown
* **CSV Export**: Clean CSV output with RFC 4180 escaping (commas, double quotes, line breaks).

### ⚙️ 10. Settings & Data Management
* University profile settings (Display Name, Shorthand Initials, Registrar Email, Tagline, Default Page Size).
* **Full JSON Backup**: One-click download of the complete institutional database snapshot.
* **Schema-Validated JSON Import**: Comprehensive JSON validator that verifies collection structures, foreign key relationships, detects duplicate registration numbers/department codes, previews record counts, and requires explicit user confirmation before applying.
* **Demo Data Reset**: Instant recovery of the 28-student baseline demonstration dataset.
* **Complete Database Wipe**: Irreversible purge utility with double confirmation.

### 🔍 11. Global Search (`Ctrl+K`)
* Omnibox search bar accessible in the top navigation header or via keyboard shortcut `Ctrl+K`.
* Instant search across Students, Courses, and Departments with live categorized popup results and keyboard/mouse navigation.

---

## 3. Technology Stack

* **Markup**: Semantic HTML5 (Custom Accessible Modals, Tables, Forms, Layout Elements)
* **Styling**: Pure CSS3 with CSS Custom Properties (Variables), Dark Navy Sidebar (`#091428`), Crisp Neutral Surfaces (`#f8fafc`), Clean Status Badges, and Mobile Breakpoint Drawer Navigation.
* **Logic**: Vanilla JavaScript (ES6+ Modules)
* **Persistence**: Browser `localStorage` with JSON serialization, schema versioning, and referential integrity helpers.
* **Graphics**: Native Inline SVG for crisp vector icons and responsive charts.
* **Zero Dependencies**: No React, Next.js, TypeScript, Tailwind, Bootstrap, jQuery, Supabase, or Firebase.

---

## 4. Directory Structure

```
assignflow/
├── index.html                 # Main HTML5 application shell & modal hosts
├── PLAN.md                    # Project development plan
├── README.md                  # Comprehensive documentation & delivery report
├── server.js                  # Zero-dependency local Node.js static HTTP server
├── test_syntax.js             # Automated JS syntax and parsing test script
├── test_integration.js        # 41-assertion automated storage & validation test suite
├── test_browser.js            # Headless Chrome DOM render & SVG verification test
├── css/
│   ├── style.css              # Design system variables, dark navy sidebar, header, shell layout
│   ├── components.css         # UI components: buttons, cards, tables, badges, modals, toasts, SVG charts
│   └── responsive.css         # Breakpoint rules for desktop, tablet, and mobile drawer
└── js/
    ├── app.js                 # Bootstrap, mobile drawer, global search, notifications popover
    ├── router.js              # Client-side hash router with parameter matching & badge counters
    ├── storage.js             # LocalStorage engine, CRUD helpers, 28-student demo seeder, backup/import
    ├── validation.js          # Business rules, regex validation, uniqueness, and safe deletion checks
    ├── ui.js                  # Modal manager, non-blocking confirm dialogs, toasts, SVG chart renderers
    ├── dashboard.js           # Dynamic dashboard view, KPI calculation, SVG bar/donut charts, audit log
    ├── departments.js         # Department management, course/student counting, safe deletion
    ├── courses.js             # Academic programs, degree levels, semester generation, filtering
    ├── sessions.js            # Academic calendar sessions, date range validation
    ├── semesters.js           # Course semesters, semester number validation, student rosters
    ├── sections.js            # Cohort sections, class representatives, cascading relations
    ├── students.js            # Student registry, multi-faceted filtering, cascading admissions modal, CSV export
    ├── student-details.js     # Student dossier view, enrollment history timeline, promotion workflow
    ├── reports.js             # Tabulated institutional reports & CSV export facilities
    └── settings.js            # University preferences, JSON backup download, validated JSON restore
```

---

## 5. How to Run Locally

You can serve UniFlow using any static HTTP server.

### Option A: Using the Included Node.js Static Server (Recommended)
```bash
node server.js
```
Then open your browser and navigate to:
```
http://localhost:8080/
```

### Option B: Using Python
```bash
# Python 3
python -m http.server 8080
```
Then open: `http://localhost:8080/`

### Option C: Using npx serve
```bash
npx serve .
```

---

## 6. Demo Dataset Explanation

When first opened, UniFlow seeds a realistic university structure:
* **Institution**: UniFlow University
* **5 Academic Departments**:
  1. Computer Applications (`CA`) — HOD: Dr. Alan Turing
  2. Management Studies (`MS`) — HOD: Dr. Peter Drucker
  3. Commerce & Banking (`COM`) — HOD: Dr. Raghuram Rajan
  4. Physical & Applied Sciences (`PAS`) — HOD: Dr. Marie Curie
  5. Humanities & Social Sciences (`HSS`) — HOD: Dr. Amartya Sen
* **8 Degree Courses**: BCA, MCA, BBA, MBA, B.Com, B.Com (Hons), B.Sc Computer Science, BA English Literature.
* **3 Academic Sessions**: `2024–2025`, `2025–2026` (Active Current), `2026–2027`.
* **44 Curriculum Semesters** and **30 Class Sections**.
* **28 Realistic Matriculated Students** complete with valid registration numbers (`UF-2025-0001` through `UF-2025-0028`), official emails, phones, and academic placement records.

> **Reseeding Guard**: The demo data initializes **only once** on initial launch (`uniflow_initialized`). It **never** reseeds or overwrites changes when you refresh the page.

---

## 7. Testing & Quality Verification

UniFlow includes automated test suites covering syntax, logic, and browser DOM rendering.

### 1. JavaScript Syntax Verification
```bash
node test_syntax.js
```
* **Result**: All 15 JavaScript source files passed strict syntax analysis.

### 2. Automated Integration & Business Rule Tests
```bash
node test_integration.js
```
* **Result**: **41 assertions PASSED, 0 FAILED**.
* Validates:
  - Fresh demo data seeding
  - Re-seeding prevention (preserves user edits across reboots)
  - Live referential counts calculation (Department, Course, Semester, Section, Session)
  - Email format and date range validation
  - Registration number and Department code uniqueness
  - Safe deletion enforcement (blocks deleting departments or courses with dependent students)
  - Student placement and enrollment history records
  - Full backup JSON serialization and schema validation
  - Rejection of malformed JSON, missing collections, and duplicate registration numbers.

### 3. Headless Chrome Real-Browser Verification
```bash
node test_browser.js
```
* **Result**: **10 passed, 0 failed**.
* Launches Google Chrome in headless mode against `http://localhost:8089/#/dashboard`.
* Verifies:
  - HTML5 app shell delivery
  - ES Module execution
  - KPI metric calculations
  - Native SVG bar chart and donut chart generation
  - Navigation routing and sidebar badge updates.

---

## 8. Security & Storage Limitations

* **Client-Side Persistence**: Browser `localStorage` is origin-specific and bound to the local browser profile. It does not provide shared multi-user access across different computers.
* **Sensitive Records**: Do not store passwords, secret keys, or confidential identity documents in `localStorage`.
* **Safe DOM APIs**: All user-provided inputs rendered in HTML tables, profiles, and reports are sanitized using HTML entity escaping (`UI.escapeHTML()`) to prevent Cross-Site Scripting (XSS).
* **Backup Strategy**: Use the built-in **Export Backup (JSON)** feature in Settings to archive your data to disk.

---

## 9. Future Backend Integration Recommendations

For institutional enterprise production deployment:
1. **RESTful / GraphQL API**: Replace `storage.js` CRUD methods with `fetch()` calls to a backend service (e.g. Node/Express, Go, Python/FastAPI).
2. **Relational Database**: Store collections in PostgreSQL with foreign keys and cascading deletion rules (`ON DELETE RESTRICT`).
3. **Role-Based Access Control (RBAC)**: Implement JWT or session authentication with granular roles (Registrar, Dean, Faculty Member, Student).
4. **Audit Logs**: Store administrative actions in an append-only database audit log table with server-side timestamps.

