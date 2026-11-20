# Bright Campus Control Hub

Build the initial production-minded foundation for SchoolOS, a multi-tenant school operating system for nursery, primary and secondary schools in Nigeria, designed to expand across Africa.

This is Phase 1 only: create a polished, navigable application shell and the foundational UI patterns. Do not pretend backend features work yet, and do not seed fake operational data or create fake statistics. Use clearly labeled empty states and sample UI only where explicitly marked demo.

Product direction:
- Premium, trustworthy, modern school-management SaaS. Responsive desktop-first admin console with excellent mobile behavior.
- Brand name: SchoolOS. Use a clean navy/indigo and warm neutral visual system, restrained accent colors, clear typography, consistent spacing, accessible contrast.
- App layout: left sidebar on desktop, collapsible navigation on smaller screens, top bar with school/campus selector placeholder, global search UI, notification UI, profile menu placeholder.
- Initial navigation groups: Overview; School Setup; Students; Admissions; Academics; Attendance; Exams & Results; Finance; Staff & HR; Communication; Parent Portal; Reports & Insights; Settings.
- Build a useful overview dashboard skeleton with meaningful empty states and onboarding checklist, no invented metrics.
- Create routes/pages for: Login, Forgot Password, Platform Admin placeholder, School Dashboard, School Setup wizard, Students list/detail placeholder, Admissions, Classes & Subjects, Attendance, Exams & Results, Fees & Payments, Staff, Communications, Reports, Settings.
- Include role-aware navigation concepts for Platform Super Admin, Proprietor, School Admin, Principal, Teacher, Bursar/Accountant, HR, Parent and Student. For now, visibly mark backend authorization as pending integration; do not rely on frontend role hiding for security.
- School setup wizard should gather school name, school type, country (Nigeria default), state, timezone (Africa/Lagos default), academic session, campus structure and branding basics. Do not submit or store data yet.
- Add reusable UI components: data table with filters/search/empty state, status badges, form fields, confirmation dialog, page header/breadcrumb, stat card component only when populated by real data, loading/skeleton state, error state.
- Ensure there are no dead buttons: for incomplete actions, either disable with an explanatory tooltip/text or provide a clear placeholder interaction that says backend setup is pending.
- Use TypeScript, clean reusable components, semantic HTML and accessible labels. Keep architecture modular and maintainable.
- Do not connect or provision any database in this phase. Do not store real student/guardian/staff data. Do not publish publicly.
- Before finishing, summarize generated routes, components, assumptions and outstanding backend/security dependencies.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bright-campus-control-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/86e8b82d-263f-4e33-a428-9962fc0fbbd4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
