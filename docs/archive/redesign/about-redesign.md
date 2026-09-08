# About Redesign Specification

> Current checkpoint: 2026-08-23
> Goal: stabilize the About page using the completed Home / Work visual system and prepare it for release.
> Scope: About user page only. Preserve existing API/Admin data flow and current section structure.

---

## 1. Core Principle

About is **not** a new redesign.

The current structure is already usable and should remain intact.

The goal is to align About with the completed Home / Work design system while improving:

- typography hierarchy
- profile information readability
- skill/tool grid balance
- long-form content readability
- orange experience-card readability
- section spacing and vertical rhythm
- black CTA / Footer continuity
- responsive stability

Do not redesign the page from scratch.

---

## 2. Page Role

```text
HOME
→ Landing / developer positioning

WORK
→ Project index

WORK DETAIL
→ Case study / technical reading

ABOUT
→ Developer background / capability / working style
```

About should explain:

```text
who I am
what I am good at
what I use
what experiences shaped my development approach
```

---

## 3. Source of Truth

### Functional

Preserve:

- existing About API
- existing About Admin CRUD
- current profile image
- current profile data
- current skills/tools data
- current experience data
- current section order
- current links
- current routing
- current loading/error handling

### Visual

Use as reference:

- completed Home page
- completed Work page
- current About implementation

Do not modify Backend / DTO / DB schema for visual alignment.

---

## 4. Final About Structure

Keep the existing order:

```text
Header

ABOUT INTRO
- main positioning title
- supporting description / meta

PROFILE
- profile image
- name
- positioning
- contact / basic information
- education / work background

WHAT I DO WELL
- capability 01
- capability 02
- capability 03

TOOLS / SKILLS
- Core Backend
- Database & AI
- Frontend
- existing data groups

ORANGE EXPERIENCE
- long-form highlighted experience

EXPERIENCE / BACKGROUND
- long-form administrator-authored content

BLACK CTA

Footer
```

Do not reorder sections unless a real defect exists.

---

## 5. Global Rules Inherited from Home

About must inherit the completed Home design language.

- Font: Pretendard
- Outer background: warm light gray
- Main canvas: white
- Main content baseline: same visual family as Home / Work
- Accent: orange
- Dark section: black
- restrained rounded corners
- restrained shadows
- section titles / body / meta use role-based hierarchy
- section spacing follows Home rhythm
- responsive checkpoints: 980px / 620px / 390px
- shared Header / Footer remain unchanged

Do not create a separate About-only design system.

---

## 6. Stage 1 — Common Visual Stabilization

### 6.1 About Intro

Current main message:

```text
문제의 원인을 끝까지 추적하는 백엔드 개발자
```

Preserve the meaning and current About positioning.

Improve only:

- title scale
- line-height
- supporting-copy readability
- spacing between hero title / supporting text / meta
- alignment with Home content baseline

Do not turn About into another Home Hero.

### 6.2 Profile Area

Preserve:

- real profile image
- name
- positioning
- current API data
- current education / work background
- current contact information

Improve:

- name / positioning / meta hierarchy
- label/value contrast
- spacing between profile blocks
- card internal padding
- long email / mixed-language wrapping
- education / work rows readability

Rules:

- do not remove real data to simplify the card
- do not invent missing profile values
- no fixed heights that depend on current data length
- profile image aspect ratio must remain intact

### 6.3 WHAT I DO WELL

Preserve the existing 3-capability structure.

Current labels may include:

```text
Backend Engineering
Frontend Engineering
Deployment & Operations
```

For Stage 1:

- keep current administrator/API content
- do not rename capability categories automatically
- improve typography / spacing / equal-height behavior only
- keep all 3 items visually balanced

Possible naming refinement may be handled separately only if explicitly requested.

### 6.4 TOOLS / SKILLS Grid

Current groups include:

```text
Core Backend
Database & AI
Frontend
```

The current layout can leave an unbalanced empty space when there are 3 groups.

Goal:

- use a responsive grid that adapts naturally to the number of groups
- avoid a rigid layout that leaves a large empty desktop cell
- preserve actual skill data and grouping
- improve card padding / label hierarchy / technology-name readability

Preferred behavior:

```text
Desktop
[ Backend ][ Database & AI ][ Frontend ]

Tablet
[ Backend ][ Database & AI ]
[ Frontend ]

Mobile
[ Backend ]
[ Database & AI ]
[ Frontend ]
```

Do not hardcode the layout to exactly 3 groups if the API can change later.

Prefer an adaptive grid such as:

```text
auto-fit / auto-fill
minmax(...)
```

or the equivalent existing responsive-grid approach.

### 6.4.1 SUPPORTING TOOLS

Home에서 사용 중인 Supporting Tools를 About의
`활용하는 기술과 도구` 영역 하단에도 동일한 의미로 노출합니다.

Main Skill Group과 Supporting Tools는 서로 다른 계층입니다.

Target:

```text
MAIN SKILL GROUPS

[ Core Backend ]
[ Database & AI ]
[ Frontend ]
[ future group... ]

SUPPORTING TOOLS

Photoshop     이미지 편집
Illustrator   그래픽 디자인
Figma         UI/UX
Notion        문서·협업
```

### 6.5 Orange Experience Card

This is a high-priority readability area.

Preserve:

- orange gradient
- existing experience content
- current section meaning
- current content order

Improve:

- inner readable width
- title / subtitle / body hierarchy
- paragraph line-height
- paragraph spacing
- list spacing
- long mixed Korean/English wrapping
- internal vertical rhythm

Goal:

```text
strong orange visual
+
comfortable long-form reading
```

Avoid:

- reducing content
- making the card extremely tall through excessive padding
- shrinking typography to fit
- fixed heights

### 6.6 Long-form Experience / Background Content

Current section:

```text
지금의 개발 방식을 만든 경험들
```

Use the same principle established in Work Detail:

```text
wide section header
↓
narrower readable article
```

Recommended visual structure:

```text
Section header baseline
≈ Home / Work content width

Long-form article
≈ 760–880px readable range
```

Important:

- section title should not look accidentally indented
- long article text should remain narrower for readability
- headings / paragraphs / lists need clear hierarchy
- administrator-authored content/order must remain unchanged

Do not create experience-specific CSS per content item.

### 6.7 Rich Text Safety

For long About content, ensure common rules for:

- paragraphs
- headings
- ordered lists
- unordered lists
- long Korean/English strings
- links
- emphasis
- inline code, if present

Requirements:

```text
overflow-wrap: safe
word-break: safe
max-width: 100%
```

Do not hide overflowed text.

### 6.8 Black CTA

Preserve the current black CTA area and shared Footer.

Improve only if needed:

- title hierarchy
- supporting copy
- CTA link readability
- internal spacing
- black-section continuity into Footer

Target flow:

```text
About white content
↓
Black CTA
↓
Footer
```

No white gap between CTA and Footer.

---

## 7. Common Safety Rules

Avoid:

```text
fixed content heights
About-content-specific absolute positioning
one-off margin-left hacks
backend/API changes
```

Prefer:

```text
natural document flow
responsive grid
max-width
auto height
safe wrapping
shared spacing tokens / existing CSS conventions
```

---

## 8. Primary Files To Inspect

Start with About-related frontend files only.

Likely relevant files:

```text
frontend/src/pages/AboutPage.tsx
frontend/src/pages/AboutPage.module.css
frontend/src/components/about/*
frontend/src/types/about.ts
frontend/src/api/aboutApi.ts
```

Use actual repository filenames if different.

If Home visual reference is needed, inspect only:

```text
frontend/src/pages/HomePage.module.css
```

Do not modify Home.

Do not repeatedly scan unrelated repository areas.

---

## 9. Stage 1 Checklist — Common Visual Stabilization

- [ ] Preserve existing About section order
- [ ] Preserve About API/Admin data flow
- [ ] Preserve profile image/data
- [ ] Align Intro typography with Home
- [ ] Improve Profile typography / spacing
- [ ] Improve long meta/email wrapping
- [ ] Keep current 3-capability content
- [ ] Improve 3-capability visual balance
- [ ] Convert Skills/Tools to adaptive responsive grid
- [ ] Improve Skills/Tools card readability
- [ ] Improve orange experience-card readability
- [ ] Apply wide-header / narrow-article rule to long-form experience section
- [ ] Improve long-form heading/body/list hierarchy
- [ ] Keep administrator-authored content/order unchanged
- [ ] Preserve black CTA / Footer continuity
- [ ] No About-specific fixed-height hacks
- [ ] Add SUPPORTING TOOLS below the Skills/Tools main grid
- [ ] Show Photoshop / Illustrator / Figma / Notion
- [ ] Keep Supporting Tools independent from the main skill-group count
- [ ] Preserve responsive wrapping without horizontal overflow
- [ ] `npm run build`
- [ ] `npm run lint`
- [ ] no new TypeScript/lint errors

Stop and report after Stage 1.

---

## 10. Stage 2 — Responsive / Release QA

Only after Stage 1 is verified.

### Viewports

- [x] 1440px
- [ ] 980px
- [x] 620px
- [x] 390px

### Validate

- [x] page-level horizontal overflow
- [x] About intro
- [x] profile image ratio
- [x] profile data wrapping
- [x] email wrapping
- [x] capability cards
- [x] skills grid
- [x] skill-card wrapping
- [x] orange experience content
- [x] long-form article
- [x] lists
- [x] links
- [x] black CTA
- [x] CTA → Footer connection
- [x] actual About API data
- [x] loading/error behavior
- [x] build
- [x] lint
- [x] no new TypeScript errors

Do not redesign during Stage 2.
Only fix actual release defects.

---

## 11. Explicit Non-Goals Before Deployment

Do not add:

- new About sections
- new API fields
- backend changes
- new Admin features
- animation system
- timeline interaction
- sticky navigation
- new packages
- cosmetic libraries
- new content schema

These can be post-deployment work.

---

## 12. Validation / Report

After the requested stage:

```bash
npm run build
npm run lint
```

Report:

1. changed files
2. Intro changes
3. Profile changes
4. Capability changes
5. Skills/Tools grid changes
6. orange experience readability changes
7. long-form article changes
8. CTA/Footer changes
9. API/data/routing preservation
10. build result
11. lint result
12. remaining TODO

Do not automatically continue to the next stage.
