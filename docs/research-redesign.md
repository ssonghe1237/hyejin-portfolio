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

- [ ] Preserve Research API/order/routing
- [ ] Preserve current list structure
- [ ] Align intro typography/spacing with completed site
- [ ] Improve list-row hierarchy
- [ ] Improve row vertical rhythm
- [ ] Support long title/summary wrapping
- [ ] Verify `Read Research →` readability
- [ ] Verify hover/focus states

### Research Detail

- [ ] Preserve actual article title/category/date/body
- [ ] Improve article-header hierarchy
- [ ] Apply readable article width
- [ ] Improve body heading/paragraph/list hierarchy
- [ ] Ensure long technical strings wrap safely
- [ ] Ensure code/pre uses internal horizontal scroll
- [ ] Ensure rich-content images stay within article width
- [ ] Preserve previous/list/next navigation
- [ ] Improve navigation hover/focus only if needed
- [ ] Preserve Footer connection

### Validation

- [ ] no Backend/DTO/DB changes
- [ ] no administrator content changes
- [ ] `npm run build`
- [ ] `npm run lint`
- [ ] no new TypeScript/lint errors

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

- [ ] 1440px
- [ ] 980px
- [ ] 620px
- [ ] 390px

### Validate List

- [ ] intro
- [ ] row wrapping
- [ ] title wrapping
- [ ] summary wrapping
- [ ] date/category
- [ ] Read Research link
- [ ] page-level horizontal overflow
- [ ] actual API data

### Validate Detail

- [ ] long title
- [ ] category/date
- [ ] article width
- [ ] paragraphs
- [ ] headings
- [ ] lists
- [ ] links
- [ ] code/pre overflow
- [ ] rich-content images
- [ ] long URL/technical strings
- [ ] previous/list/next navigation
- [ ] missing previous/next state
- [ ] Footer connection
- [ ] loading/error behavior
- [ ] actual API data

### Release Gate

- [ ] `npm run build`
- [ ] `npm run lint`
- [ ] no new TypeScript errors
- [ ] no release blocker

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

---

## 13. Post-QA Enhancement — Research Explore v1

> Status: optional post-QA usability enhancement before deployment  
> Scope: Research List only  
> Goal: add lightweight title search + category filtering without reopening backend/API design.

Research List and Detail have already passed visual stabilization and responsive/release QA.

This enhancement must **not** redesign Research or invalidate the completed Detail QA.

### 13.1 Product Goal

Research content will continue to accumulate over time.

The list should let users quickly answer:

```text
특정 카테고리의 글만 보고 싶다
제목에 특정 키워드가 있는 글을 찾고 싶다
```

Add only:

```text
1. Title search
2. Category filter
3. Combined AND filtering
4. Empty-result state
5. Reset behavior
6. URL query-state preservation
```

Do not add full-text search or backend search APIs before deployment.

---

### 13.2 Final UI Direction

Place the explore controls between the Research intro/meta area and the list.

Recommended structure:

```text
Research Intro

Research Notes · Backend · Architecture · Data

[ 제목으로 검색................................ ]

ALL    JAVA    WEB    SPRING    ...

Research List
```

### Visual Rules

- Search input: thin border, white background, restrained radius
- Category controls: text navigation, not large pills
- Active category: orange text and/or thin orange underline
- Keep the UI visually quieter than Home/Work
- Do not create another card container around the whole control area
- Preserve existing Research row design
- Controls must not push the list into a new visual system

---

### 13.3 Data Source

Use the **already loaded published Research list**.

Do not add:

```text
GET /api/research?keyword=...
GET /api/research?category=...
```

or any new backend endpoint.

Filtering is performed client-side against the current published Research data.

Use the actual existing Research response field names from the repository.

---

### 13.4 Title Search

Search scope for v1:

```text
title only
```

Do not search:

- summary
- body
- HTML content
- tags
- slug

Behavior:

- trim leading/trailing whitespace
- case-insensitive comparison
- partial match using `includes`
- empty query means no title filtering

Conceptual logic:

```ts
const normalizedQuery = query.trim().toLocaleLowerCase()

const matchesTitle =
  normalizedQuery.length === 0 ||
  item.title.toLocaleLowerCase().includes(normalizedQuery)
```

Use the project's actual TypeScript types.

Do not introduce `any`.

---

### 13.5 Category Filter

Category options must be derived from the actual loaded Research data.

Do not hardcode:

```ts
['JAVA', 'WEB', 'SPRING']
```

Target:

```text
ALL + unique categories from current published Research
```

Conceptual logic:

```ts
const categories = [
  'ALL',
  ...Array.from(
    new Set(items.map((item) => item.category).filter(Boolean))
  ),
]
```

If the actual category field can be nullable, handle it safely using the existing type contract.

Do not invent a fake category for null values unless the current product already defines one.

---

### 13.6 Combined Filtering

Title search and category selection use **AND** semantics.

Example:

```text
Category = JAVA
Query = image

↓

category is JAVA
AND
title contains "image"
```

Conceptual logic:

```ts
const filteredItems = items.filter((item) => {
  const matchesCategory =
    selectedCategory === 'ALL' ||
    item.category === selectedCategory

  const matchesTitle =
    query.trim().length === 0 ||
    item.title
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase())

  return matchesCategory && matchesTitle
})
```

Do not mutate or resort the original API list.

Preserve the current published API ordering.

---

### 13.7 URL Query State — Recommended and In Scope

Use React Router search parameters so filter state survives:

- refresh
- browser back/forward
- returning from a Research Detail page

Recommended query shape:

```text
/research?category=JAVA&q=image
```

Preferred implementation:

```ts
useSearchParams()
```

Rules:

- omit `q` when the search query is empty
- omit `category` when `ALL` is selected
- preserve no unnecessary empty query parameters
- browser history/back behavior must remain natural

Do not add a new state-management library.

---

### 13.8 Accessibility

Search control must have an accessible label.

Example intent:

```text
Research 제목 검색
```

The label may be visually hidden if that matches the existing project convention.

Category controls must:

- be keyboard reachable
- expose selected/current state appropriately
- have visible `:focus-visible`
- not rely on color alone if an underline/current marker already exists

Use semantic `button` elements unless the repository already has a better established pattern.

Do not use clickable `div`.

---

### 13.9 Empty Result State

When no item matches:

```text
조건에 맞는 Research가 없습니다.
```

Optionally show a lightweight reset action:

```text
검색 조건 초기화
```

Do not replace the whole page or remove the intro.

No-result state belongs only where the list normally renders.

---

### 13.10 Reset Behavior

Provide a clear way to return to:

```text
query = empty
category = ALL
```

Reset must also clear the URL query parameters.

Do not add a large secondary toolbar solely for reset.

A small text button or input clear action is sufficient.

---

### 13.11 Responsive Behavior

Validate:

```text
1440px
980px
620px
390px
```

Recommended behavior:

#### Desktop

```text
Search input
Category text navigation
```

may share one row if space permits.

#### Tablet / Mobile

- Search input becomes full width
- Categories wrap naturally or use contained horizontal scrolling
- no page-level horizontal overflow
- active category remains visible
- search control remains easy to use
- no mobile drawer

Do not force every category onto one line if it makes controls too small.

---

### 13.12 Primary Files

Start with:

```text
frontend/src/pages/ResearchListPage.tsx
frontend/src/pages/ResearchListPage.module.css
```

Only inspect existing Research types/API if needed:

```text
frontend/src/api/researchApi.ts
frontend/src/types/*
```

Do not modify Research Detail unless a real regression is discovered.

Do not modify:

- Backend
- DTO
- DB
- Admin Research
- published filtering
- API sorting
- Research Detail design
- Home / Work / About / Contact

---

### 13.13 Explicit Non-Goals

Do not add:

- body/full-text search
- backend search endpoint
- repository/service search methods
- pagination
- tag system
- sort UI
- search suggestions
- autocomplete
- fuzzy search
- debounce library
- new state library
- new UI package
- search analytics

This is **Research Explore v1**, not a search platform.

---

### 13.14 Enhancement Checklist

- [ ] title-search input added
- [ ] title-only case-insensitive partial matching
- [ ] categories derived from actual published data
- [ ] `ALL` category supported
- [ ] category + title use AND semantics
- [ ] original API ordering preserved
- [ ] `useSearchParams` query state
- [ ] empty query params omitted
- [ ] no-result state
- [ ] reset behavior
- [ ] keyboard-accessible category controls
- [ ] visible focus state
- [ ] no `any`
- [ ] no backend/API changes
- [ ] no Research Detail redesign
- [ ] 1440 / 980 / 620 / 390 QA
- [ ] no page-level horizontal overflow
- [ ] `npm run build`
- [ ] `npm run lint`
- [ ] no release blocker

---

### 13.15 Enhancement QA

Validate with actual current Research data.

Examples:

```text
1. ALL + empty query
   → all published items in existing API order

2. Category = JAVA
   → JAVA only

3. Query = part of a known title
   → matching title(s) only

4. Category = JAVA + matching query
   → AND result

5. Category + non-matching query
   → empty-result state

6. Reset
   → all items return and URL params clear

7. Detail navigation / browser back
   → category/query state restored
```

Also verify:

- public Research Detail routes still work
- `Read Research →` still points to the correct article
- filter logic does not mutate API data
- no console error
- build
- lint

---

### 13.16 Final Report Format

Report:

1. changed files
2. title-search implementation
3. category derivation method
4. combined filter logic
5. URL query-state behavior
6. empty/reset behavior
7. accessibility handling
8. responsive result
9. API/order/routing preservation
10. build result
11. lint result
12. release blocker

Stop after this enhancement and QA.

Do not automatically add more Research functionality.

