# Contact Redesign Specification

> Current checkpoint: 2026-08-23
> Goal: finalize Contact using the completed Home / Work / About design system, then proceed to Research.
> Scope: Contact user page only. Preserve shared layout and existing routing.

---

## 1. Core Principle

Contact is already visually close to the completed site.

Do **not** redesign it from scratch.

The goal is to:

1. verify actual contact/resume data
2. align spacing/typography with Home
3. preserve the black-section visual language
4. verify responsive behavior
5. finish release QA quickly

---

## 2. Page Role

```text
HOME
→ positioning

WORK
→ projects

WORK DETAIL
→ case study

ABOUT
→ background / capability

CONTACT
→ final conversion / contact action
```

Contact should be short, direct, and action-oriented.

---

## 3. Current Structure To Preserve

```text
Header

GET IN TOUCH
Let's build something together

Supporting description

Contact Cards
- Email
- GitHub

Resume CTA
- orange card
- View Resume

Footer
```

Do not add a contact form before deployment.

---

## 4. Global Rules Inherited From Home

- Font: Pretendard
- Shared MainLayout/Header/Footer
- Same page/canvas boundaries as Home
- Black primary background
- Orange accent
- restrained borders / radius
- Home typography hierarchy
- responsive checkpoints: 980px / 620px / 390px
- no duplicate Footer
- no page-specific design system

---

## 5. Highest-Priority Functional Check

The current screenshot shows placeholder-looking values:

```text
EMAIL
example@example.com

GITHUB
https://github.com/example
```

Before release, verify whether these are:

1. temporary hardcoded placeholders
2. actual API/config values
3. screenshot-only test data

### Required behavior

- [ ] Email uses the real portfolio contact email
- [ ] GitHub uses the real portfolio GitHub URL
- [ ] Resume CTA uses the actual resume URL/file
- [ ] Header `GET IN TOUCH` route remains unchanged
- [ ] Footer Email/GitHub/Resume destinations remain consistent with Contact
- [ ] no `href="#"`
- [ ] no `javascript:void(0)`
- [ ] external links use safe target/rel attributes when opening a new tab

### Data-source rule

Prefer existing shared data/config/API if it already exists.

Do not create Backend/DTO/DB fields only to fix Contact.

If Contact currently uses frontend constants and the project already has canonical contact values elsewhere, reuse or centralize the existing frontend source with the smallest safe change.

---

## 6. Stage 1 — Contact Final Stabilization

### 6.1 Intro

Preserve:

```text
GET IN TOUCH
Let's build something together
```

Preserve the current meaning of the supporting copy.

Improve only if needed:

- Home-aligned title scale
- line-height
- intro/content spacing
- max-width
- wrapping

Do not turn Contact into another large Hero.

### 6.2 Contact Cards

Preserve the current 2-card desktop structure.

```text
[ EMAIL ] [ GITHUB ]
```

Improve only if needed:

- card padding
- label/value hierarchy
- icon alignment
- long URL/email wrapping
- hover/focus states
- keyboard-visible focus

Responsive target:

```text
Desktop: 2 columns
Mobile: 1 column
```

### 6.3 Resume CTA

Preserve:

- orange card
- current title
- `View Resume` action

Verify:

- real resume link
- button contrast
- button/link focus state
- no overflow
- responsive stacking

### 6.4 Footer

Preserve the shared Footer.

Contact black background and Footer should remain visually continuous.

No white gap.

---

## 7. Stage 1 Checklist

- [x] Preserve current Contact structure
- [x] Verify/remove placeholder email if applicable
- [x] Verify/remove placeholder GitHub if applicable
- [x] Verify real Resume destination
- [x] Keep shared Header/Footer
- [x] Align intro typography/spacing with Home
- [x] Verify contact card hierarchy
- [x] Verify email/GitHub wrapping
- [x] Verify hover/focus states
- [x] Preserve orange Resume CTA
- [x] Preserve black Contact → Footer continuity
- [x] no placeholder/broken links
- [x] no Backend/DTO/DB changes
- [x] npm run build
- [x] npm run lint
- [x] no new TypeScript/lint errors

**Status: DATA UPDATE REQUIRED**

Stop and report after Stage 1.

---

## 8. Stage 2 — Responsive / Release QA

### Viewports

- [x] 1440px
- [x] 980px
- [x] 620px
- [x] 390px

### Validate

- [x] page-level horizontal overflow
- [x] intro wrapping
- [x] Email card
- [x] GitHub card
- [x] long email/URL wrapping
- [x] contact actions
- [x] Resume CTA
- [x] Resume link
- [x] Header route
- [x] Footer links
- [x] keyboard focus visibility
- [x] black background continuity
- [x] Footer connection
- [x] build
- [x] lint
- [x] no new TypeScript errors

Do not redesign during Stage 2.
Only fix actual release defects.

---

## 9. Explicit Non-Goals

Do not add before deployment:

- contact form
- email-sending backend
- captcha
- new API
- new DB table
- animation system
- new package
- new page section

---

## 10. Validation / Report

After the requested stage:

```bash
npm run build
npm run lint
```

Report:

1. changed files
2. actual contact data source
3. placeholder-data result
4. Email/GitHub/Resume link result
5. visual changes
6. responsive handling
7. Header/Footer preservation
8. build result
9. lint result
10. remaining TODO

Do not automatically continue to Stage 2.
