# UniFlow Implementation Plan

## 1. Project Initialization & Architecture Setup
- Create directory structure (`css/`, `js/`, `assets/`).
- Create `index.html` with modern semantic markup, accessible sidebar, header with global search & notification popover, breadcrumbs, main content area, modal containers, and toast container.
- Create CSS files:
  - `css/style.css`: Design tokens (CSS custom properties), dark navy/slate sidebar theme, header, layout shell, typography.
  - `css/components.css`: Modern UI components (buttons, badges, cards, data tables, modals, form controls, toast notifications, SVG chart styles, empty states, pagination).
  - `css/responsive.css`: Breakpoint styling for mobile drawer, tablet reflow, responsive tables and forms.

## 2. Storage & Data Models (`js/storage.js`)
- LocalStorage abstraction with error handling and quota detection.
- Collections: departments, courses, sessions, semesters, sections, students, enrollments, activities, settings.
- Initial demo data seeder (UniFlow University with 5 departments, 8 courses, 3 sessions, semesters, sections, 25+ realistic students, activity history).
- Referential integrity helpers & derived counts (course count per department, student count per course/semester/section).
- JSON export and schema-validated JSON import.

## 3. Core UI Utilities & Router (`js/ui.js`, `js/router.js`, `js/validation.js`)
- Client-side hash router (`#/dashboard`, `#/departments`, `#/courses`, `#/sessions`, `#/semesters`, `#/sections`, `#/students`, `#/student-details/:id`, `#/reports`, `#/settings`) with history support.
- Native SVG Icon library and SVG chart generation (bar chart, donut chart, progress ring).
- Accessible modal dialog manager and custom confirmation dialog.
- Toast notification manager with auto-dismiss.
- Validation utilities (email, required fields, date ranges, unique codes/reg numbers).

## 4. Module Implementations
- `dashboard.js`: KPI summary cards, SVG charts, recent activity timeline, recent students, quick action handlers.
- `departments.js`: CRUD, unique code validation, head of department, course/student counting, safe deletion check.
- `courses.js`: CRUD, department relationship, degree type, duration, semester count configuration, enrolled counts.
- `sessions.js`: Academic sessions CRUD, date range validation, session status, student counts.
- `semesters.js`: Semesters listing by course, semester number validation, student counts.
- `sections.js`: Class/section CRUD, cascade selectors (Course -> Semester -> Session), student counts.
- `students.js`: Student directory, multi-field search, multi-faceted filtering, sorting, pagination, Add/Edit modal with dynamic cascade dropdowns, status toggling.
- `student-details.js`: Complete student profile view, academic placement, enrollment history, archive/restore.
- `reports.js`: Tabulated reports (department, course, semester, session, active/inactive), CSV exporter, backup utilities.
- `settings.js`: University branding, display preferences, pagination, JSON export, validated JSON import preview, factory reset.
- `app.js`: Global initialization, global search autocomplete across entities, mobile drawer handling.

## 5. Verification & Testing
- Start local HTTP server.
- Run automated end-to-end checks using Node.js script to verify static serving, script syntax, routing, data seeding, CRUD logic, search/filtering, CSV generation, JSON validation, and error boundaries.
- Produce comprehensive documentation in `README.md`.

