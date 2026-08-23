# Work Detail Redesign Specification

> Current checkpoint: 2026-08-23  
> Goal: stabilize the shared Work Detail template using the completed Home/Work design system and finish deployment-ready QA.  
> Scope: common project-detail UI only. Do not redesign individual projects separately.

---

## 1. Core Principle

COREWORK and Developer Portfolio Platform use the same Work Detail template.

The visible differences come from administrator-entered content:

- number of sections
- body length
- code blocks
- images
- lists
- tech stacks
- links

Therefore, do **not** create project-specific layouts.

The goal is to improve the shared detail template so that both short and long project content remain readable and stable.

---

## 2. Page Role

```text
HOME
→ Landing / developer positioning

WORK
→ Project index

WORK DETAIL
→ Case study / technical reading experience
```

Work Detail should inherit the completed Home/Work design language, but prioritize long-form readability over decorative presentation.

---

## 3. Source of Truth

### Functional
- Existing project detail API
- Existing project detail response types
- Existing project images
- Existing administrator-entered sections
- Existing project links
- Existing routing
- Existing loading/error/fallback behavior

### Visual
- Completed Home page
- Completed Work page
- Current Work Detail implementation

Do not modify backend/API contracts for visual work.

---

## 4. Shared Detail Structure

```text
Header

Project Hero Images

Project Basic Info
- title
- summary
- period / type / role / meta

Tech Stack

Project Details

Admin-authored Content Sections
- section title
- rich text
- lists
- code/pre blocks
- images
- emphasis blocks

Links

Footer
```

The amount of content may differ per project, but the visual rules must stay consistent.

---

## 5. Keep As-Is Unless a Real Defect Exists

Preserve:

- shared MainLayout/Header/Footer
- project detail routing
- API calls
- project response mapping
- hero image carousel/fallback behavior
- project metadata
- administrator-authored content order
- project links
- content section order
- existing sanitization/rich-text behavior

Do not rewrite administrator-authored content.

---

## 6. Stage 1 — Common Detail Visual Stabilization

### 6.1 Overall Page Width

The current detail body feels too narrow compared with Home/Work.

Goals:

- keep the same outer warm-gray background / white canvas language
- keep Home/Work page boundaries
- increase readable detail-content width moderately
- do not make long paragraphs excessively wide
- do not force fixed heights

Recommended visual range:

```text
Article/detail readable width: approximately 760–900px
```

Use the existing layout structure first.  
Do not introduce a second page shell.

### 6.2 Typography Hierarchy

Align with Home typography roles.

Separate:

```text
Project hero title
Section label
Section heading
Subheading
Body
Secondary body/meta
Link
Code/pre text
```

Goals:

- long text should be readable without browser zoom
- improve readability through role-based font-size, line-height, weight, and spacing
- do not globally enlarge every element
- keep Pretendard

Important:

- `PROJECT DETAILS` must read as a section heading
- administrator section headings must be stronger than body text
- nested headings need a clear second-level hierarchy
- body line-height must support long technical reading

### 6.3 Project Hero + Basic Info

Preserve the current hero/basic-info composition.

Adjust only if needed:

- hero/basic-info spacing
- title scale
- summary readability
- metadata spacing
- card padding
- overlap balance

Do not change actual project data.

### 6.4 Tech Stack

Preserve existing tech-stack data and card concept.

Improve:

- card padding
- technology-name readability
- meta/category hierarchy
- consistent gap
- flexible wrapping based on item count

Rules:

- no fixed total height
- cards must tolerate different tech-stack counts
- no horizontal overflow on mobile

### 6.5 Project Details / Rich Content

Highest priority.

Improve the shared rich-content reading experience:

- readable content width
- paragraph line-height
- heading spacing
- list spacing
- section-to-section vertical rhythm
- emphasis block spacing
- long-word wrapping

The same template must support:

```text
COREWORK
→ many sections / long content

Developer Portfolio Platform
→ code-heavy / image-heavy content
```

without project-specific CSS.

### 6.6 Code / Preformatted Blocks

Do not add syntax-highlighting packages before deployment.

Requirements:

```text
overflow-x: auto
max-width: 100%
stable padding
consistent radius
readable monospace size
comfortable line-height
```

Code blocks must never force page-level horizontal scrolling.

Preserve actual code text.

### 6.7 Rich Content Images

Administrator-authored images must follow:

```text
max-width: 100%
height: auto
object-fit: contain
```

Also:

- no image stretching
- images must stay inside article width
- use restrained Home-consistent radius when applicable
- preserve captions if present
- no hardcoded image height

### 6.8 Lists / Long Text Safety

Support:

- ordered lists
- unordered lists
- long technical names
- URLs
- English stack names
- Korean/English mixed text

Use safe wrapping where required:

```text
overflow-wrap
word-break
```

Do not hide overflowed text.

### 6.9 Links Section

Keep the current black `LINKS` area.

Align it with Home/Work black-section language:

- title hierarchy
- row height
- divider treatment
- orange arrow/accent
- link readability
- Footer spacing

Target:

```text
Detail white content
↓
LINKS black section
↓
Footer black section
```

Avoid a white gap between Links and Footer.

---

## 7. Common Template Safety Rules

The CSS must not depend on a specific project's content length.

Avoid:

```text
fixed content heights
project-specific selectors
COREWORK-only overrides
Portfolio-only overrides
absolute positioning tied to content length
```

Prefer:

```text
auto height
max-width
min/max constraints
natural document flow
responsive wrapping
overflow-x only on code blocks
```

---

## 8. Primary Files To Inspect

Start with shared project-detail files only.

Likely relevant existing files:

```text
frontend/src/pages/ProjectDetailPage.tsx
frontend/src/pages/ProjectDetailPage.module.css

frontend/src/components/project/detail/ProjectBasicInfo.tsx
frontend/src/components/project/detail/ProjectBasicInfo.module.css

frontend/src/components/project/detail/ProjectContentSection.tsx
frontend/src/components/project/detail/ProjectContentSection.module.css

frontend/src/components/project/detail/ProjectSectionBody.tsx
frontend/src/components/project/detail/ProjectSectionBody.module.css

frontend/src/components/project/detail/ProjectSectionItem.tsx
frontend/src/components/project/detail/ProjectSectionItem.module.css

frontend/src/components/project/detail/ProjectSectionImages.tsx
frontend/src/components/project/detail/ProjectSectionImages.module.css

frontend/src/components/project/detail/ProjectTechStackSection.tsx
frontend/src/components/project/detail/ProjectTechStackSection.module.css

frontend/src/components/project/detail/ProjectLinkSection.tsx
frontend/src/components/project/detail/ProjectLinkSection.module.css

frontend/src/components/project/detail/ProjectHeroImages.tsx
frontend/src/components/project/detail/ProjectHeroImages.module.css
```

Use actual repository filenames if they differ.

Do not scan unrelated repository areas after the shared detail structure is identified.

---

## 9. Stage 1 Checklist — Common Detail Visual Stabilization

- [x] Keep one shared template for all projects
- [x] Align page/content width with completed Home/Work
- [x] Improve typography hierarchy
- [x] Improve body readability / line-height
- [x] Improve section spacing
- [x] Preserve Hero / Basic Info structure
- [x] Improve Tech Stack card readability
- [x] Improve rich-content heading hierarchy
- [x] Stabilize lists and long mixed-language text
- [x] Ensure code/pre blocks use internal horizontal scrolling
- [x] Ensure rich-content images stay inside content width
- [x] Align black Links section with Home/Work
- [x] Preserve project API/data/routing
- [x] Preserve administrator-authored content/order
- [x] No project-specific CSS
- [x] npm run build
- [x] npm run lint
- [x] no new TypeScript/lint errors

Stop and report after Stage 1.

---

## 10. Stage 2 — Responsive / Release QA

Use at least two project-detail examples:

```text
COREWORK
Developer Portfolio Platform
```

These are validation examples only, not separate templates.

### Viewports

- [x] 1440px
- [ ] 980px
- [x] 620px
- [x] 390px

### Validate

- [x] page-level horizontal overflow
- [x] hero image clipping
- [x] hero carousel / indicators / fallback
- [x] basic-info card
- [x] tech-stack wrapping
- [x] long paragraphs
- [x] nested headings
- [x] ordered/unordered lists
- [x] code/pre internal scrolling
- [x] content images
- [x] long URLs / English technical strings
- [x] project links
- [x] Links → Footer connection
- [x] loading/error behavior
- [x] actual API data
- [x] build
- [x] lint
- [x] no new TypeScript errors

Do not redesign during Stage 2.  
Only fix actual release defects.

---

## 11. Explicit Non-Goals Before Deployment

Do not add:

- syntax-highlighting library
- sticky table of contents
- scroll progress UI
- new animation system
- project-specific navigation
- new content schema
- backend changes
- new editor features
- new packages for cosmetic purposes

These can be post-deployment improvements.

---

## 12. Validation / Report

After the requested stage:

```bash
npm run build
npm run lint
```

Report only:

1. changed files
2. shared template changes
3. typography/content-width changes
4. Tech Stack changes
5. rich-content/code/image safety changes
6. Links/Footer changes
7. API/data/routing preservation
8. build result
9. lint result
10. remaining TODO

Do not automatically continue to the next stage.

## Final Release Status

- [x] Stage 1 — Common Detail Visual Stabilization
- [x] Stage 2 — Responsive / Release QA
- [x] Post-QA Project Details header alignment
- [x] COREWORK actual-content rendering verified
- [x] Developer Portfolio Platform template consistency verified
- [x] 1440px / 980px / 620px / 390px
- [x] no page-level horizontal overflow
- [x] code/pre internal overflow handling
- [x] rich-content image sizing
- [x] Hero carousel / indicator / fallback
- [x] API / data / routing preserved
- [x] LINKS → Footer connection
- [x] npm run build
- [x] npm run lint
- [x] no release blocker

**Status: COMPLETE — RELEASE READY**