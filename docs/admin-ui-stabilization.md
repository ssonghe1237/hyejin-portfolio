# Admin UI Stabilization Specification

> Current checkpoint: 2026-08-23
> Time budget: maximum 2 hours
> Goal: add a required shared Admin Header and make only the minimum usability improvements needed before deployment.
> Scope: Admin user interface only. Preserve existing CRUD/API/upload behavior.

---

## 1. Core Principle

This is **not** a full Admin redesign.

The admin pages already have working CRUD flows. The goal is to improve operation efficiency before deployment without reopening completed backend/API logic.

Priority:

```text
1. Shared Admin Header — REQUIRED
2. Navigation clarity
3. Primary action consistency
4. List/form usability
5. Minimal responsive safety
6. Build / lint / route QA
```

Stop if the work begins to expand beyond this scope.

---

## 2. Time Limit

Maximum implementation + QA time:

```text
2 hours
```

Recommended split:

```text
00:00–00:35
Shared Admin Header

00:35–01:15
Projects / Research / About / Contact common usability alignment

01:15–01:40
CRUD workflow check

01:40–02:00
Responsive / route / build / lint QA
```

If a change requires substantial backend/API/routing refactoring, do not implement it before deployment.

---

## 3. Admin Information Architecture

Required Admin navigation:

```text
ADMIN

Projects
Research
About
Contact

View Site ↗
```

Use the actual existing routes from the repository.

Do not invent new routes if equivalents already exist.

---

## 4. Shared Admin Header — REQUIRED

### Purpose

The Admin Header must make it obvious:

- that the user is in the Admin area
- which admin section is currently active
- how to move between admin sections
- how to return to the public site

### Suggested Structure

```text
┌────────────────────────────────────────────────────────────┐
│ SONG HYEJIN / ADMIN                                       │
│                                                            │
│ Projects   Research   About   Contact       View Site ↗    │
└────────────────────────────────────────────────────────────┘
```

Compact branding such as `PORTFOLIO ADMIN` is acceptable if it fits the existing code/style better.

### Required Behavior

- [ ] shared across all admin user pages
- [ ] Projects navigation
- [ ] Research navigation
- [ ] About navigation
- [ ] Contact navigation
- [ ] visible current-route active state
- [ ] `View Site ↗` returns to `/`
- [ ] keyboard `:focus-visible`
- [ ] no `href="#"`
- [ ] do not duplicate header markup per page if a shared wrapper/layout already exists
- [ ] do not reuse the public Header as the Admin Header

### Active State

Use restrained styling:

```text
Projects
────── orange
```

or a small orange indicator.

Avoid excessive pill labels or animation.

### Sticky Behavior

Sticky is optional.

Use it only if safe with the current admin layout. If it causes z-index/scroll/layout issues, keep a normal top header.

---

## 5. Admin Layout Strategy

Inspect the current admin route/layout structure first.

Preferred existing architecture if available:

```text
AdminLayout
├─ AdminHeader
└─ Outlet
   ├─ Projects
   ├─ Research
   ├─ About
   └─ Contact
```

If `AdminLayout` already exists, add the Header there.

If it does not exist:

- use the smallest safe shared wrapper change
- do not perform a large router refactor before deployment
- avoid copied headers in every page unless there is no safer shared option

Do not change public `MainLayout` behavior.

---

## 6. Common Admin Page Header

Each admin screen should have a consistent page-level intro.

Example:

```text
Projects
프로젝트 콘텐츠를 등록하고 공개 상태를 관리합니다.

[새 프로젝트 등록]
```

Use the same placement logic for Research / About / Contact.

Rules:

- consistent page-title position
- predictable primary CTA position
- no large marketing-style hero
- admin UI prioritizes clarity over decoration

---

## 7. Minimal Usability Improvements

Only fix real workflow friction.

### Projects

Check:

- list → create
- list → detail/edit
- edit → save
- save → expected destination
- delete action visibility
- published/status readability
- primary/secondary action hierarchy

Do not modify project API, upload API, image cleanup behavior, or project data model.

### Research

Check:

- list → create
- list → edit
- edit → save
- published/status visibility
- delete action hierarchy
- long-title wrapping

Do not modify Research API, Tiptap behavior, sanitizer behavior, or content schema.

### About

Check:

- major admin sections are easy to identify
- save/update action is easy to locate
- long forms have consistent spacing
- upload controls remain usable
- existing profile/skills/experience CRUD behavior is preserved

Do not add new About fields before deployment.

### Contact

Check:

- Email
- GitHub URL
- Resume upload/current file
- published/current state if present
- save/update action visibility

Do not add a new Contact backend feature.

---

## 8. Action Hierarchy

Use consistent action priority:

```text
Primary
Save / Update / Create

Secondary
Cancel / Back / View

Destructive
Delete
```

Rules:

- destructive action must not look identical to primary save
- do not create a new modal system solely for this task
- preserve existing confirmation behavior
- button placement should be predictable across admin pages

---

## 9. Long Form Usability

For long forms:

- consistent field spacing
- clear section headings
- readable label/value hierarchy
- no fixed form height
- no horizontal overflow
- save action remains easy to locate

Do not introduce a sticky action bar unless it can be added with very low risk.

---

## 10. Loading / Empty / Error States

If already implemented:

- align existing loading-state spacing
- align empty-state spacing
- ensure error messages remain readable

Do not build a new global toast/notification system before deployment.

---

## 11. Responsive Target

Admin does not require the same mobile polish as the public site before deployment.

Minimum target:

```text
Desktop
980px
620px
```

At 620px:

- header navigation may wrap or use horizontal scrolling
- form controls remain usable
- primary actions remain reachable
- no page-level horizontal overflow caused by the new Header
- do not build a new mobile drawer/menu system

390px may be checked opportunistically, but it is not a scope-expansion target.

---

## 12. Visual Language

Admin should belong to the same portfolio product without copying the public marketing UI.

Use:

- Pretendard
- orange accent
- white / warm-light background
- black text
- restrained border/radius
- clear typography hierarchy
- simple active states

Avoid:

- large gradients
- oversized marketing typography
- decorative hero sections
- complex animation
- public-page card styling copied everywhere

---

## 13. Primary Files To Inspect

Start from Admin routing/layout and current Admin pages.

Likely areas:

```text
frontend/src/App.tsx
frontend/src/pages/admin/*
frontend/src/components/admin/*
frontend/src/components/layout/*
```

Possible page/component families:

```text
AdminProject*
AdminResearch*
AdminAbout*
AdminContact*
```

Use actual repository names.

Inspect only directly relevant frontend files first.

Do not repeatedly scan unrelated backend/domain code.

---

## 14. Explicit Non-Goals

Do not implement before deployment:

- new Admin dashboard
- analytics/charts
- new search feature
- new filters
- bulk actions
- new auth/permission system
- backend/API/DTO changes
- DB schema changes
- new form framework
- new UI library
- global state refactor
- large route refactor
- drag-and-drop redesign
- new toast/notification platform
- public-page redesign

---

## 15. Stage 1 — Required Header + Minimal UX Stabilization

### Shared Admin Header

- [ ] identify current admin route/layout structure
- [ ] create/reuse shared Admin Header
- [ ] Projects nav
- [ ] Research nav
- [ ] About nav
- [ ] Contact nav
- [ ] active route state
- [ ] View Site ↗
- [ ] keyboard focus-visible
- [ ] no `href="#"`
- [ ] public Header not duplicated

### Common Admin UX

- [ ] consistent page title position
- [ ] consistent primary CTA position
- [ ] primary/secondary/destructive action hierarchy
- [ ] long-form spacing
- [ ] list action readability
- [ ] save/update action discoverability
- [ ] preserve existing CRUD behavior
- [ ] preserve upload behavior
- [ ] preserve API/routing contracts

### Validation

- [ ] `npm run build`
- [ ] `npm run lint`
- [ ] no new TypeScript/lint errors

Stop and report after Stage 1.

---

## 16. Stage 2 — Admin Release QA

Only after Stage 1 is visually accepted.

### Routes

Verify:

```text
Admin Projects
Admin Research
Admin About
Admin Contact
View Site
```

### Workflows

Verify at minimum:

```text
Projects
list → create/edit → save

Research
list → create/edit → save

About
open → update/save

Contact
open → update/save
```

Do not create test data if doing so could disturb deployment-prep content. Use existing data where possible.

### Viewports

- [ ] desktop
- [ ] 980px
- [ ] 620px

### QA

- [ ] Admin Header visible
- [ ] active nav correct
- [ ] navigation routes correct
- [ ] View Site route correct
- [ ] no page-level horizontal overflow from new Header
- [ ] forms remain usable
- [ ] buttons remain reachable
- [ ] loading/error/empty states not regressed
- [ ] existing uploads not regressed
- [ ] build
- [ ] lint
- [ ] no release blocker

Do not redesign during Stage 2.

---

## 17. Time-Box Stop Rules

Stop and report instead of expanding scope if:

- Header requires a major router rewrite
- a usability fix requires Backend changes
- an existing CRUD defect is unrelated to this Admin UI task
- a new library appears necessary
- the work exceeds the 2-hour target because of unrelated legacy issues

The goal is a usable release-ready Admin, not a perfect Admin system.

---

## 18. Final Report Format

After Stage 1 report:

1. changed files
2. Admin Header implementation location
3. navigation/routes
4. active-state implementation
5. View Site behavior
6. common usability improvements
7. CRUD/API/upload preservation
8. responsive handling
9. build result
10. lint result
11. remaining Stage 2 TODO
12. whether the work remains inside the 2-hour scope

Do not automatically continue to Stage 2.
