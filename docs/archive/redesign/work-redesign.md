# Work Redesign Specification

> Current checkpoint: 2026-08-23  
> Goal: stabilize the Work page using the completed Home design system and finish deployment-ready QA quickly.  
> Reference: current Work implementation + approved Work mockup + completed Home page.

---

## 1. Purpose

Work is not a new page redesign.

The existing Work API/data/routing structure is already implemented and must remain intact.

The goal is:

1. Add a stronger page intro at the top.
2. Add the supplied Work illustration to the right side of the intro.
3. Expand the Work intro description.
4. Align typography, spacing, page width, colors, and section rhythm with the completed Home page.
5. Preserve the existing Selected Work / Research / More Work structure.

---

## 2. Source of Truth

### Functional source of truth

- Existing WorkPage code
- Existing project API
- Existing Research API
- Existing project images
- Existing routing
- Existing loading/error handling

### Visual source of truth

- Completed Home page
- Approved Work mockup
- Supplied Work intro illustration

Do not recreate Home components inside Work.  
Reuse the same visual rules and existing shared layout where possible.

---

## 3. Work Intro Illustration Asset

### Source File

The supplied image currently exists outside the repository at:

```text
D:\dev\03_portfolio\temp\work_page_im.png
```

This file must **not** be referenced directly from `D:\dev\03_portfolio\temp` at runtime.

The image must be copied into the frontend repository and committed with the project.

### Target Asset Path

First inspect the frontend's existing asset/import convention.

If an equivalent Work asset directory already exists, follow that convention.

Otherwise use:

```text
frontend/src/assets/work/work-page-intro.png
```

Recommended copy:

```text
SOURCE
D:\dev\03_portfolio\temp\work_page_im.png

↓

TARGET
frontend/src/assets/work/work-page-intro.png
```

### Asset Rules

- [ ] Verify `D:\dev\03_portfolio\temp\work_page_im.png` exists before copying.
- [ ] Copy the file into the frontend repository.
- [ ] Do not move/delete the original temp file.
- [ ] Do not reference the absolute Windows temp path from React code.
- [ ] Do not recreate the illustration with CSS.
- [ ] Do not replace it with a mock image.
- [ ] Preserve the PNG's transparency.
- [ ] Do not stretch or crop the image.
- [ ] Commit the copied asset with the Work changes.

### React Import

If the project uses Vite/src asset imports, use a normal module import.

Example:

```tsx
import workIntroImage from '../assets/work/work-page-intro.png'
```

Adjust the relative path to match the actual Work component location.

Render it as an actual image:

```tsx
<img
  src={workIntroImage}
  alt=""
  aria-hidden="true"
/>
```

The illustration is decorative rather than informational, so an empty `alt` plus `aria-hidden="true"` is preferred.

If the project's existing accessibility convention differs, follow the repository convention.

---

## 4. Global Rules Inherited from Home

Work must follow the final Home design system.

- Font: Pretendard
- Outer background: warm light gray
- Main page canvas: white
- Main content max-width: same baseline as Home
- Accent: orange
- Dark sections: black
- Typography hierarchy: use Home as reference
- Section spacing: use Home vertical rhythm
- Link styling: orange text for lightweight actions
- Rounded corners / shadows: restrained and consistent with Home
- Responsive checkpoints: 980px / 620px / 390px
- MainLayout / Header / Footer stay shared
- No duplicated page-local Header/Footer

Do not create a second design system for Work.

---

## 5. Final Work Page Structure

```text
Header

WORK INTRO
├─ Left: title + expanded description
└─ Right: supplied Work illustration

↓

SELECTED WORK
├─ COREWORK
├─ 맛집네
└─ Developer Portfolio Platform

↓

RESEARCH
└─ orange research card / latest items

↓

MORE WORK
└─ 2 project cards in one desktop row

↓

Footer
```

---

## 6. Work Intro

### Goal

The current Work page begins too abruptly with `Selected Work`.

Add a lightweight intro area that explains what the Work page contains before the project list begins.

This is **not** a Home-style large Hero.

The projects remain the main focus of the page.

### Desktop Layout

```text
TEXT 55~60% | VISUAL 40~45%
```

Structure:

```text
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  PROJECT                         [work-page-intro.png]    │
│  Selected Work                                           │
│                                                          │
│  expanded intro copy                                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

Rules:

- left: label / title / expanded description
- right: supplied Work illustration
- intro is shallower than Home Hero
- use the same content boundaries as Home
- do not wrap the entire intro in another unnecessary decorative card
- image should visually balance the text but must not dominate the projects below
- keep generous whitespace between the intro and the first project row

### Copy

Small label:

```text
PROJECT
```

Main title:

```text
Selected Work
```

Description:

```text
문제를 구조화하고, 실제 동작하는 서비스로 구현한 프로젝트를 소개합니다.

요구사항 분석부터 데이터와 API 설계, 사용자 화면과 관리자 기능 구현,
검증과 개선까지 직접 참여한 작업을 중심으로 정리했습니다.

각 프로젝트에서 사용한 기술의 나열보다,
어떤 문제를 어떻게 해결하고 서비스 흐름으로 연결했는지에 집중해 보여드립니다.
```

The copy may be line-broken for layout, but the meaning should remain unchanged.

### Illustration Styling

Recommended behavior:

```css
object-fit: contain;
width: 100%;
height: auto;
```

Use a bounded visual container instead of forcing a fixed image height.

Desktop:

- visual occupies roughly 40~45% of the intro grid
- image should align optically with the title/description block
- do not crop the orange orbit line
- do not let the illustration touch the viewport edge

Mobile / tablet:

- move visual below the text
- keep centered
- reduce visual width naturally
- preserve transparency
- no horizontal overflow

---

## 7. Selected Work

Preserve the current project API and actual images.

Projects:

```text
01 COREWORK
02 맛집네
03 Developer Portfolio Platform
```

### Keep

- existing API selection/sorting
- existing project images
- existing project detail links
- current desktop image/text relationship
- project meta
- current divider structure

### Visual Alignment

Only align with Home:

- title size
- body size
- meta size
- line-height
- letter-spacing
- action-link size/color
- section spacing
- project-row spacing

Do not redesign the project rows into Home Featured cards.

### Label Rule

The `PROJECT` label above `Selected Work` remains.

This label provides section classification.

Do not add decorative labels to every project row.

---

## 8. Research

Preserve the existing Research API/list.

### Visual

- orange gradient card
- no `STUDY` / `RESEARCH` pill above the Research title
- title should simply read `Research`
- keep latest Research list structure
- keep actual title/summary/date/category data
- keep `Read Research →`
- keep `View all Research →` when currently implemented

### Background Relationship

The black More Work background must extend upward behind the lower part of the orange Research card.

Target:

```text
        ORANGE RESEARCH CARD
   ┌────────────────────────────┐
███│ lower research rows        │███
███└────────────────────────────┘███
████████ BLACK BACKGROUND █████████
████████ MORE WORK ████████████████
```

Rules:

- orange card remains above black background
- black is the real More Work/background region, not a new rounded box
- no extra decorative black card
- no white gap between intended overlap and More Work
- preserve responsive stability

---

## 9. More Work

### Title

```text
More Work
```

Do not add a pill/rounded label above this title.

### Content

- no filter
- desktop: exactly 2 cards in one row
- mobile: natural single-column stack
- reuse actual available project data if the current implementation already does so
- if current More Work has no data, do not invent permanent backend data

### Card Direction

Each card remains simple:

```text
image
date / project type
title
short description
stack
detail link
```

Keep Home typography/button/link rules.

---

## 10. Footer

Reuse the existing shared Footer.

The black More Work region and Footer should connect naturally.

Avoid:

- white gap before Footer
- duplicate page-local Footer
- new Work-only footer styling

---

## 11. Stage Plan

### Stage 1 — Intro + Home Visual Alignment

Current task.

#### Asset

- [ ] Confirm source file exists:
  `D:\dev\03_portfolio\temp\work_page_im.png`
- [ ] Copy image into the frontend asset directory
- [ ] Preferred target:
  `frontend/src/assets/work/work-page-intro.png`
- [ ] Preserve transparency
- [ ] Do not reference the absolute temp path from runtime code
- [ ] Import and render the copied image in the Work intro

#### Intro

- [ ] Add Work intro area above the project list
- [ ] Place Work illustration on the right on desktop
- [ ] Replace short Work intro copy with expanded copy
- [ ] Keep intro shallower than Home Hero
- [ ] Match Home content max-width
- [ ] Match Home typography hierarchy
- [ ] Match Home section vertical rhythm
- [ ] Tablet/mobile intro converts to one column
- [ ] Illustration does not clip or overflow

#### Existing Sections

- [ ] Keep `PROJECT` label above Selected Work
- [ ] Preserve Selected Work API / images / links
- [ ] Preserve Research API/list
- [ ] Keep Research without a decorative pill label
- [ ] Preserve Research → black More Work overlap
- [ ] Keep More Work without a decorative pill label
- [ ] Keep More Work as 2 desktop cards / no filter
- [ ] Preserve shared Header / Footer

#### Validation

- [ ] `npm run build`
- [ ] `npm run lint`
- [ ] no new TypeScript/lint errors

Stop and report after Stage 1.

---

### Stage 2 — Responsive / Release QA

Only after Stage 1 is verified.

- [ ] desktop visual comparison
- [ ] 980px
- [ ] 620px
- [ ] 390px
- [ ] intro illustration clipping
- [ ] intro image aspect ratio
- [ ] horizontal overflow
- [ ] project image crop
- [ ] project detail links
- [ ] Research links
- [ ] More Work links
- [ ] orange Research / black background overlap
- [ ] Footer connection
- [ ] loading/error regression
- [ ] production build
- [ ] lint
- [ ] no new TypeScript errors

Do not redesign the page in Stage 2.

---

## 12. Change Restrictions

Do not modify unless a real defect requires it:

- Backend Controller
- Backend Service
- Repository
- Entity
- DTO
- DB schema
- API URL
- project sorting/publishing logic
- Research sorting/publishing logic
- MainLayout structure
- Header responsibilities
- Footer responsibilities
- completed Home page
- Admin pages

Also:

- no `any`
- no `href="#"`
- no new package without approval
- no mock project API
- no fake project screenshots
- no unnecessary component refactor
- do not delete the original temp image
- do not keep runtime references to `D:\dev\03_portfolio\temp`

---

## 13. Validation / Report

After the requested stage:

```bash
npm run build
npm run lint
```

Report:

1. changed files
2. intro implementation
3. source illustration path
4. final repository asset path
5. image import/render method
6. Home visual rules reused
7. API/data/routing preservation
8. responsive changes, if any
9. build result
10. lint result
11. remaining TODO

Do not automatically continue to the next stage.
