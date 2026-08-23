# Research Redesign Specification

> Current checkpoint: 2026-08-23
> Goal: finalize Research List + Research Detail using the completed Home / Work / About design system and prepare the user site for release.
> Scope: user Research pages only. Preserve existing API/Admin data flow, routing, content order, and shared layout.

---

## 1. Core Principle

Research is already structurally complete.

Do **not** redesign it from scratch.

The goal is to stabilize:

- Research list typography and row rhythm
- long title / summary wrapping
- list action readability
- Research detail long-form readability
- Rich Text / code / image safety
- previous / list / next navigation
- shared Footer continuity
- responsive behavior

Research List and Research Detail should be treated as one feature family.

---

## 2. Page Role

```text
HOME
→ developer positioning

WORK
→ project index

WORK DETAIL
→ project case study

ABOUT
→ background / capability

CONTACT
→ contact action

RESEARCH
→ technical notes / learning / implementation records
```

Research should feel quieter and more editorial than Home/Work while keeping the same typography family, page canvas, orange accent, and Footer language.

---

## 3. Source of Truth

### Functional

Preserve:

- existing Research API
- existing Admin Research CRUD
- published-data filtering
- current sorting/order
- actual title / summary / category / updatedAt
- Research detail body content
- previous / next navigation behavior
- list/detail routing
- loading/error handling
- shared Header/Footer

### Visual

Use as reference:

- completed Home page
- completed Work Detail long-form rules
- current Research List
- current Research Detail

Do not modify Backend / DTO / DB schema for visual work.

---

## 4. Final Structure

### Research List

```text
Header

RESEARCH INTRO
- large centered title
- supporting description
- meta/category line

RESEARCH LIST
- date / category
- title
- summary
- Read Research →

Footer
```

### Research Detail

```text
Header

ARTICLE HEADER
- title
- category
- updated date

ARTICLE BODY
- rich text

ARTICLE NAVIGATION
- previous
- back to list
- next

Footer
```

---

## 5. Global Rules Inherited From Completed Pages

- Font: Pretendard
- warm light-gray outer background
- white page canvas
- orange accent
- black shared Footer
- Home/Work content baseline family
- restrained borders / backgrounds
- responsive checkpoints: 980px / 620px / 390px
- no duplicate page-local Header/Footer
- no second Research-only design system

Research Detail may use a narrower article width for readability.

---

## 6. Stage 1 — Research List + Detail Visual Stabilization

### 6.1 Research List Intro

Preserve the current centered intro structure.

Current intent:

```text
기록하고 실험하며,
개발의 이유를 정리합니다.
```

Improve only if needed:

- title scale / line-height
- supporting-copy width
- meta line spacing
- Home-aligned vertical rhythm

Do not turn the intro into another Hero card.

---

### 6.2 Research List Rows

Preserve actual API data and row order.

Each row should continue to contain:

```text
date / category
title
summary
Read Research →
```

Improve:

- title / summary / meta hierarchy
- vertical row spacing
- long title wrapping
- long summary wrapping
- action-link readability
- hover/focus state
- alignment of date/category, content, action

Rules:

- no fixed row height
- no clipping
- no truncation that hides actual content unless already part of current product behavior
- no project-card redesign
- no filter/search/pagination added before deployment

Current subtle alternate/highlight backgrounds may remain if already implemented and visually stable.

---

### 6.3 Research Detail Header

Preserve:

- actual title
- category
- updated date

Improve only if needed:

- title max-width
- large-title line-height
- category/date hierarchy
- spacing before article divider/body

Long Research titles must wrap naturally without page overflow.

Do not reduce title font excessively just to fit.

---

### 6.4 Research Detail Article Width

Use the long-form reading principle already established in Work Detail:

```text
wide page/section baseline
↓
narrower readable article
```

Recommended visual article range:

```text
approximately 760–880px
```

Goals:

- readable paragraph length
- comfortable line-height
- clear heading hierarchy
- consistent paragraph/list spacing

Do not make the body as wide as the full page canvas.

---

### 6.5 Rich Text Safety

Preserve actual administrator-authored Research content.

Ensure safe common rules for:

- headings
- paragraphs
- bold / emphasis
- ordered lists
- unordered lists
- links
- inline code
- pre/code blocks
- blockquotes if supported
- images
- long Korean/English technical strings
- long URLs

Code/pre requirements:

```text
max-width: 100%
overflow-x: auto
```

Rich-content image requirements:

```text
max-width: 100%
height: auto
object-fit: contain
```

No page-level horizontal overflow caused by article content.

Do not add a syntax-highlighting package before deployment.

---

### 6.6 Previous / List / Next Navigation

Preserve current behavior:

```text
이전글
목록으로 돌아가기
이후글
```

Improve only if needed:

- visual hierarchy
- alignment
- hit area
- hover/focus states
- disabled/missing previous/next state
- mobile stacking

Do not change route semantics.

---

### 6.7 Footer

Reuse the shared Footer.

Research white content should connect cleanly into Footer.

No accidental large blank block caused by fixed minimum heights.

The detail page may naturally have whitespace when an article is short, but avoid artificial layout gaps.

---

## 7. Common Safety Rules

Avoid:

```text
fixed article heights
fixed list-row heights
project-specific CSS copied into Research
title-specific hacks
one-off margin-left positioning
Backend/API changes
```

Prefer:

```text
natural document flow
max-width
responsive grid/flex
safe wrapping
auto height
role-based typography
```

---

## 8. Primary Files To Inspect

Start only with Research user-page files.

Likely relevant files:

```text
frontend/src/pages/ResearchListPage.tsx
frontend/src/pages/ResearchListPage.module.css
frontend/src/pages/ResearchDetailPage.tsx
frontend/src/pages/ResearchDetailPage.module.css
frontend/src/components/common/RichTextContent.tsx
frontend/src/components/common/RichTextContent.module.css
frontend/src/api/researchApi.ts
```

Use actual repository filenames if different.

If visual reference is needed, inspect only:

```text
frontend/src/pages/HomePage.module.css
frontend/src/components/project/detail/ProjectContentSection.module.css
```

Do not modify Home / Work Detail.

---

## 9. Stage 1 Checklist — Visual Stabilization

### Research List

- [x] Preserve Research API/order/routing
- [x] Preserve current list structure
- [x] Align intro typography/spacing with completed site
- [x] Improve list-row hierarchy
- [x] Improve row vertical rhythm
- [x] Support long title/summary wrapping
- [x] Verify `Read Research →` readability
- [x] Verify hover/focus states

### Research Detail

- [x] Preserve actual article title/category/date/body
- [x] Improve article-header hierarchy
- [x] Apply readable article width
- [x] Improve body heading/paragraph/list hierarchy
- [x] Ensure long technical strings wrap safely
- [x] Ensure code/pre uses internal horizontal scroll
- [x] Ensure rich-content images stay within article width
- [x] Preserve previous/list/next navigation
- [x] Improve navigation hover/focus only if needed
- [x] Preserve Footer connection

### Validation

- [x] no Backend/DTO/DB changes
- [x] no administrator content changes
- [x] `npm run build`
- [x] `npm run lint`
- [x] no new TypeScript/lint errors

Stop and report after Stage 1.

---

## 10. Stage 2 — Responsive / Release QA

Validate both:

```text
Research List
Research Detail
```

Use at least one real long-title Research article for Detail QA.

### Viewports

- [x] 1440px
- [x] 980px
- [x] 620px
- [x] 390px

### Validate List

- [x] intro
- [x] row wrapping
- [x] title wrapping
- [x] summary wrapping
- [x] date/category
- [x] Read Research link
- [x] page-level horizontal overflow
- [x] actual API data

### Validate Detail

- [x] long title
- [x] category/date
- [x] article width
- [x] paragraphs
- [x] headings
- [x] lists
- [x] links
- [x] code/pre overflow
- [x] rich-content images
- [x] long URL/technical strings
- [x] previous/list/next navigation
- [x] missing previous/next state
- [x] Footer connection
- [x] loading/error behavior
- [x] actual API data

### Release Gate

- [x] `npm run build`
- [x] `npm run lint`
- [x] no new TypeScript errors
- [x] no release blocker

Do not redesign during Stage 2.
Only fix concrete release defects.

---

## 11. Explicit Non-Goals Before Deployment

Do not add:

- Research search
- category filter
- pagination redesign
- table of contents
- comments
- likes/bookmarks
- syntax-highlighting package
- animation system
- new API
- new DB fields
- new Admin features

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
2. Research List changes
3. Research Detail changes
4. article-width / typography changes
5. rich-text/code/image handling
6. navigation changes
7. API/data/routing preservation
8. build result
9. lint result
10. remaining TODO

Do not automatically continue to Stage 2.

## Final Release Status

- [x] Stage 1 — Research List + Detail Visual Stabilization
- [x] Stage 2 — Responsive / Release QA
- [x] 1440px
- [x] 980px
- [x] 620px
- [x] 390px
- [x] actual published Research data
- [x] long title / summary wrapping
- [x] actual pre/code rendering
- [x] pre/code internal horizontal scrolling
- [x] previous / list / next navigation
- [x] missing previous/next state
- [x] no page-level horizontal overflow
- [x] API / filtering / sorting / routing preserved
- [x] npm run build
- [x] npm run lint
- [x] no release blocker

Actual published data did not currently contain:
- ordered/unordered lists
- rich-text links / long URLs
- rich-text images

The common CSS/DOM safety rules for those content types are implemented.
They are not considered release blockers.

**Status: COMPLETE — RELEASE READY**