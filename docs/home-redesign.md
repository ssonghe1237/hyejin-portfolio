# Home Redesign Specification

> Current checkpoint: 2026-08-23  
> Goal: finish Home safely and prepare for deployment tomorrow.  
> Reference: `송혜진 포트폴리오 리디자인 시안.html`

---

## 1. Final Page Structure

```text
Hero
↓
ABOUT ME · 01
↓
WHAT I BUILD · 02
↓
SELECTED WORK · 03
↓
HOW I BUILD · 04
↓
LET'S WORK TOGETHER · 05
↓
Footer
```

### Removed from final Home

The separate Home `06 CONTACT` section is removed.

Do not keep:

```text
똑똑,
지금도 여기 있습니다!
```

`LET'S WORK TOGETHER · 05` connects directly to Footer.

---

## 2. Intentional Differences from Static Reference

Preserve:

- Current real About profile image
- Current implemented Hero right-side visual
- Actual API project images
- Existing routing/loading/error/image fallback behavior
- Actual API project data over static mock copy where applicable

---

## 3. Final Section Requirements

### Hero

Keep current content and visual.

### ABOUT ME · 01

Main section label is plain orange text, not a pill.

Profile meta target:

```text
POSITIONING | LOCATION
EMAIL       | HOBBY
```

Hobby rule:

- verify an existing real data source first
- do not invent a hobby
- do not modify backend/DTO only for Hobby
- use existing About API `interests` when available

### WHAT I BUILD · 02

Main title:

```text
어떤 개발이
가능한가
```

Card 01:

```text
SERVICE BACKEND
01
서비스의 중심을
견고하게 구현합니다.

REST API와 데이터 구조를 설계하고
Spring Boot 기반 비즈니스 로직을 구현합니다.

Spring Boot · JPA · REST API
```

Card 02:

```text
DATA & AI
02
데이터를 검색과
업무 경험으로 연결합니다.

PostgreSQL 기반 데이터 구조와
검색·RAG 기능을 실제 서비스에 연결합니다.

PostgreSQL · pgvector · RAG
```

Card 03:

```text
FULL SERVICE FLOW
03
API에서 화면까지
흐름을 완성합니다.

백엔드 API부터 React 사용자 화면과
관리자 기능까지 이어지는 흐름을 구현합니다.

React · TypeScript · Admin
```

### SELECTED WORK · 03

Use existing API/image/link logic.

Project 01 must include:

```text
FEATURED PROJECT
01
Project title
Project description

ROLE
actual role data

STACK
actual stack data

Actions
```

Project 02 / 03 desktop direction:

```text
TEXT LEFT ~35% | IMAGE RIGHT ~65%
```

Both use the same direction.

ROLE/STACK candidate fields:

- `role`
- `myRoleTitles`
- `techStacks`
- `techCategories`

Do not hardcode unavailable data.

### HOW I BUILD · 04

Main title:

```text
아이디어를 실제 서비스로 구현하는 방법
```

Description:

```text
사용자의 요구를 이해하는 것에서 시작해 서비스 구조를 설계하고,
적절한 기술을 선택해 실제 동작하는 결과물까지 완성합니다.
```

Required structure:

```text
HOW I BUILD outer container

[01 · DEVELOPMENT PROCESS]
[02 · DEVELOPMENT STACK]
[03 · DESIGN TO DEVELOPMENT]
```

Each is an independent inner card.

Shared intro:

```text
small label
main title
short description
```

Intro is centered. Detailed content may remain left-aligned.

#### 01 · DEVELOPMENT PROCESS

```text
01 · DEVELOPMENT PROCESS
이해하고, 설계하고, 구현한 뒤 검증합니다.

요구사항을 정리하고 구조를 설계한 뒤,
구현과 검증을 반복하며 완성도를 높입니다.
```

#### 02 · DEVELOPMENT STACK

```text
02 · DEVELOPMENT STACK
설계를 구현으로 옮기는 기술

각 기술은 독립된 목록이 아니라,
서비스의 전체 흐름을 완성하기 위해 사용합니다.
```

Keep current soft-lavender VS Code visual.

#### 03 · DESIGN TO DEVELOPMENT

```text
03 · DESIGN TO DEVELOPMENT
디자인 경험을 개발의 강점으로 확장했습니다.

기획과 디자인에서 익힌 사용자 관점과 구조화 경험을
개발 과정의 강점으로 연결합니다.
```

Keep:

- Product Planning
- UI / UX
- Visual Design
- Documentation

### LET'S WORK TOGETHER · 05

Keep this section and its three value statements.

Final flow:

```text
DESIGN TO DEVELOPMENT
↓
LET'S WORK TOGETHER · 05
↓
Footer
```

No separate Home Contact section.

---

## 4. Current Implementation Check

The interrupted long-running Stage 1 work was later resumed and completed.  
The checklist below reflects the current verified state after Stage 2-B.

### Confirmed

- [x] Hero structure remains intact.
- [x] Real About profile image remains.
- [x] WHAT I BUILD final Korean direction/copy applied.
- [x] Featured Project large decorative `01` restored.
- [x] Project 01/02/03 explicit `ROLE` + value and `STACK` + value applied.
- [x] Project 02/03 use text-left / image-right on desktop.
- [x] Real project images remain.
- [x] HOW I BUILD final main title applied.
- [x] HOW I BUILD three independent cards/shared intro pattern applied.
- [x] Hobby source verified and applied from existing About API `interests`.
- [x] `06 CONTACT / 똑똑, 지금도 여기 있습니다!` removed.
- [x] LET'S WORK TOGETHER · 05 remains and connects to Footer.
- [x] `npm run build` succeeds.
- [x] lint executed; only the two known pre-existing errors remain.

Known pre-existing lint errors:

```text
ProjectHeroImages.tsx
- synchronous setState inside effect

types/about.ts
- empty interface
```

---

## 5. Stage Plan

### Stage 1 — Finish Structure & Content

- [x] WHAT I BUILD final structure
- [x] Featured Project large `01`
- [x] Project 01/02/03 ROLE / STACK
- [x] Project 02/03 text-left / image-right
- [x] HOW I BUILD final title
- [x] HOW I BUILD three independent cards
- [x] `label → title → description`
- [x] Hobby source verified and applied
- [x] Home `06 CONTACT` removed
- [x] `npm run build`
- [x] lint executed and existing 2 errors separated

**Status: COMPLETE**

---

### Stage 2 — Visual Alignment

- [x] Hero desktop scale
- [x] typography hierarchy
- [x] letter-spacing / line-height
- [x] remove pill styling from main section labels
- [x] section vertical rhythm
- [x] WHAT I BUILD visual alignment
- [x] Selected Work spacing
- [x] HOW I BUILD visual hierarchy
- [x] orange Design card / black background overlap baseline adjustment

**Status: COMPLETE**

> Note: the final Contact-transition overlap refinement is separated into Stage 2-C below.

---

## Stage 2-B — Visual Polish / Final Corrections

### Selected Work

- [x] Featured Project `상세 보기 →` changed from low-contrast white to Home accent orange
- [x] hover / focus contrast reinforced
- [x] existing detail routing preserved
- [x] GitHub / PDF / external-link styling left unchanged unless required

### HOW I BUILD — Main Intro

- [x] `HOW I BUILD · 04` title and right-side description re-aligned inside desktop content width
- [x] Home content max-width respected
- [x] desktop layout no longer solved by shrinking the title typography
- [x] final copy preserved

Implemented desktop alignment:

```text
max-width: 1120px
2-column grid
column-gap: 72px
```

### HOW I BUILD — Inner Section Labels

- [x] orange dot/bullet removed from `01 · DEVELOPMENT PROCESS`
- [x] orange dot/bullet removed from `02 · DEVELOPMENT STACK`
- [x] orange dot/bullet removed from `03 · DESIGN TO DEVELOPMENT`
- [x] `01 ·`, `02 ·`, `03 ·` text preserved
- [x] pill background/padding preserved
- [x] label alignment kept consistent

### 01 · DEVELOPMENT PROCESS — Step Icons

- [x] 01 요구사항 분석 icon added
- [x] 02 설계 icon added
- [x] 03 개발 icon added
- [x] 04 검증과 개선 icon added
- [x] implemented without a new package
- [x] inline SVG icons used
- [x] icons placed between number and title
- [x] existing process arrows preserved
- [x] no new lint error introduced

Icon meaning:

```text
01 요구사항 분석 → search
02 설계          → layers / structure
03 개발          → code
04 검증과 개선   → verify / check
```

### 03 · DESIGN TO DEVELOPMENT — Capability Descriptions

- [x] `Product Planning` description restored
- [x] `UI / UX` description restored
- [x] `Visual Design` description restored
- [x] `Documentation` description restored

Final content:

```text
Product Planning
요구사항 · 서비스 구조

UI / UX
사용자 흐름 · 화면 상태

Visual Design
정보 구조 · 시각적 우선순위

Documentation
설계 · 구현 내용 공유
```

- [x] title/description hierarchy separated
- [x] four box heights aligned
- [x] desktop 2 × 2 structure preserved
- [x] orange gradient retained

### Stage 2-B Completion

- [x] Featured `상세 보기 →` is readable
- [x] HOW I BUILD main title/description stay within content width
- [x] unnecessary label dots removed
- [x] four process icons visible
- [x] existing arrows preserved
- [x] four Design-to-Development capabilities include title + description
- [x] API / project data / routing unchanged
- [x] `HomePage.tsx` changes limited to icon/description content needs
- [x] no unrelated CSS changes reported
- [x] `npm run build` succeeds
- [x] no new lint errors

**Status: COMPLETE**

---

## Stage 2-C — Contact Transition Final Polish

This is the **current remaining visual polish stage** before deployment QA.

### LET'S WORK TOGETHER Intro Alignment

- [x] Verify `LET'S WORK TOGETHER · 05` main title and description stay inside the Home content max-width.
- [x] Align the left intro block (`label / title / description / CTA`) and right value list to the same section content boundaries.
- [x] Do not solve the problem by shrinking typography.
- [x] Check and adjust only as needed:
  - `grid-template-columns`
  - `max-width`
  - `padding-inline`
  - `column-gap`
  - `margin-inline`
- [x] Preserve the Stage 2 typography hierarchy.

### Design Card → Black Background Overlap

- [x] Extend the existing `LET'S WORK TOGETHER` black background upward behind the lower capability area of the `03 · DESIGN TO DEVELOPMENT` orange card.

Target:

```text
        Orange Design Card
   ┌────────────────────────┐
███│ Capability boxes       │███
███│                        │███
███└────────────────────────┘███
████████ BLACK BACKGROUND █████
████ LET'S WORK TOGETHER ██████
```

- [x] Keep the orange card position and gradient.
- [x] Do not create a new rounded black card.
- [x] Use the existing black section background and extend it upward.
- [x] Black background must be visible in the left/right gutters behind the lower orange-card area.
- [x] Keep the orange card above the black background layer.
- [x] Prefer stable layout techniques:
  - relative positioning
  - negative margin
  - padding compensation
  - wrapper background
- [x] Avoid brittle absolute positioning.
- [x] Preserve responsive behavior at 620px / 390px.
- [x] No white/ivory strip should appear between the intended overlap and black section.
- [x] Footer must continue naturally from the black section.

### Stage 2-C Completion

- [x] LET'S WORK TOGETHER title/description aligned inside content width
- [x] left intro and right value list share the same section boundaries
- [x] black background starts visually behind the lower orange Design card
- [x] left/right gutters show black in the overlap zone
- [x] orange card remains above black background
- [x] no unintended white/ivory strip
- [x] no horizontal overflow introduced
- [x] Stage 1/2 API, DOM, content, icons, capability descriptions remain unchanged
- [x] `npm run build` succeeds
- [x] no new lint errors

**Status: TODO — NEXT**

---

## Stage 3 — Deployment QA

Release gate after Stage 2-C.

- [ ] full desktop visual check
- [ ] 980px
- [ ] 620px
- [ ] 390px
- [ ] horizontal overflow
- [ ] project image crop
- [ ] internal routes
- [ ] external links
- [ ] no `href="#"`
- [ ] loading/error regression
- [ ] production build
- [ ] lint reviewed
- [ ] no new TypeScript errors

---

## 6. Deployment Priority

If time is constrained:

1. Build/type safety and routing/API regressions
2. Stage 1 structural blockers
3. Broken mobile layouts/horizontal overflow
4. Stage 2 / 2-C visual mismatch
5. Decorative polish

Do not risk deployment stability for low-value visual refactors.

---

## 7. Validation / Report

After each requested stage:

```bash
npm run build
npm run lint
```

Report only:

1. changed files
2. completed checklist items
3. API/data/routing preservation
4. build result
5. lint result
6. remaining TODO

Do not automatically start the next stage.
