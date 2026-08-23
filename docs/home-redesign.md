# Home Redesign Specification

> Current checkpoint: 2026-08-23
>
> Goal: finish Home safely and prepare for deployment tomorrow.
>
> Reference: `송혜진 포트폴리오 리디자인 시안.html`

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

The separate Home `06 CONTACT` section must be removed.

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
Keep current content and visual. Desktop scale is a Stage 2 task.

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
- if no source exists, leave as TODO

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

ROLE/STACK candidate fields to verify:
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

Keep Product Planning / UI UX / Visual Design / Documentation.

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

## 4. Current Screenshot Check — Interrupted Stage 1

The previous Codex run was stopped after 6+ hours. Treat the current code as WIP, not as completed Stage 1.

### Visually confirmed
- [x] Hero structure remains intact.
- [x] Real About profile image remains.
- [x] WHAT I BUILD Korean final direction/copy is substantially applied.
- [x] Project 02 is text-left / image-right.
- [x] Real project images remain.
- [x] LET'S WORK TOGETHER · 05 exists.

### Incomplete / verify in code
- [ ] Featured Project large decorative `01` is still missing.
- [ ] Project 01/02/03 explicit `ROLE` + value and `STACK` + value must be verified/fixed.
- [ ] Project 03 is still image-left / text-right; change to text-left / image-right.
- [ ] HOW I BUILD main title is still not the final title.
- [ ] HOW I BUILD three independent cards/shared intro pattern are not consistently complete.
- [ ] Hobby source is not confirmed.
- [ ] `06 CONTACT / 똑똑, 지금도 여기 있습니다!` still exists and must be removed.
- [ ] Build/lint status after the interrupted run must be checked before Stage 2.

### Stage 2 items — do not mix into Stage 1 restart
- Hero desktop scale
- typography hierarchy
- letter-spacing / line-height
- main section label pill removal
- section vertical spacing
- orange/black overlap

---

## 5. Stage Plan

### Stage 1 — Finish Structure & Content

- [x] WHAT I BUILD final Korean direction/copy substantially applied
- [ ] Featured Project large `01`
- [ ] ROLE / STACK for Projects 01/02/03
- [x] Project 02 text-left / image-right
- [ ] Project 03 text-left / image-right
- [ ] HOW I BUILD final main title
- [ ] HOW I BUILD three independent inner cards
- [ ] shared `label → title → description` intro pattern
- [ ] Hobby source verification
- [ ] remove Home `06 CONTACT`
- [ ] `npm run build`
- [ ] `npm run lint` and separate pre-existing issues

Stop and report after Stage 1.

### Stage 2 — Visual Alignment

Only after Stage 1 is verified:
- [ ] Hero desktop scale
- [ ] typography hierarchy
- [ ] letter-spacing / line-height
- [ ] remove pill styling from main section labels
- [ ] section vertical rhythm
- [ ] WHAT I BUILD visual alignment
- [ ] Selected Work spacing
- [ ] HOW I BUILD visual hierarchy
- [ ] orange Design card / black background overlap

### Stage 3 — Deployment QA

Release gate:
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
4. Stage 2 visual mismatch
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
