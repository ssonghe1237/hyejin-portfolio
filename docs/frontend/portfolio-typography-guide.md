# 포트폴리오 사이트 Typography Guide

> 작성 기준: 2026-08-19  
> 적용 대상: 포트폴리오 사용자 화면(Home 및 이후 Work / About / Research 디자인 확장)  
> 목적: 화면별 폰트 크기를 임의로 지정하지 않고, 역할에 따라 일관된 Typography Scale을 적용하기 위한 기준 문서

---

## 1. 기본 원칙

현재 포트폴리오 사이트는 넓은 여백, 큰 카드, Gray Outer Background + White Site Shell 구조를 사용한다.

이 레이아웃에서는 텍스트가 지나치게 작으면 화면 전체가 축소된 시안처럼 보이고, 반대로 모든 제목을 크게 만들면 정보 위계가 무너진다.

따라서 폰트 크기는 다음 원칙으로 관리한다.

1. **Hero > Section > Card Title > Body > UI > Label > Meta** 순서로 명확한 크기 차이를 둔다.
2. 본문은 실제 읽기 편한 크기를 우선한다.
3. 작은 화면에서도 Meta / Label을 과도하게 축소하지 않는다.
4. 제목은 반응형으로 줄이되, 본문은 가독성을 위해 최소 크기를 유지한다.
5. 같은 역할의 텍스트는 페이지가 달라도 동일한 크기 체계를 사용한다.
6. 크기뿐 아니라 `font-weight`, `line-height`, `color`, `spacing`으로도 위계를 구분한다.

---

## 2. 기본 Typography Scale

포트폴리오 사용자 화면의 기본 Typography Token은 아래와 같이 사용한다.

| Token | 크기 | 용도 |
|---|---:|---|
| `--font-meta` | 10px | Window meta, 상태값, 장식성 정보 |
| `--font-label` | 12px | Section Kicker, Small Label, 보조 안내 |
| `--font-ui` | 14px | Button, Link, Tag, Chip |
| `--font-card` | 16px | 카드 본문, 작은 설명, Project Summary |
| `--font-body` | 18px | 주요 본문, Section Description |
| `--font-subtitle` | 22px | Card 강조 제목, Subheader |
| `--font-section-title` | 반응형 | 주요 Section H2 |
| `--font-hero-title` | 반응형 | Home Hero H1 |

권장 CSS 변수 예시:

```css
:root {
  --font-meta: 10px;
  --font-label: 12px;
  --font-ui: 14px;
  --font-card: 16px;
  --font-body: 18px;
  --font-subtitle: 22px;
}
```

---

## 3. 최종 제목 크기

### Hero Title

Home 첫 화면의 가장 중요한 제목이다.

| 화면 | 크기 |
|---|---:|
| Desktop | **50px** |
| Tablet | **44px** |
| Mobile | **36px** |

예시:

```css
.heroTitle {
  font-size: 50px;
}

@media (max-width: 1024px) {
  .heroTitle {
    font-size: 44px;
  }
}

@media (max-width: 620px) {
  .heroTitle {
    font-size: 36px;
  }
}
```

Hero는 `h1` semantic을 유지한다.

예:

```text
사용자 화면부터 백엔드와 운영 구조까지
연결하는 개발을 고민합니다.

웹 개발자
송혜진
```

크기 차이뿐 아니라 다음과 같이 굵기와 색상으로도 강조한다.

```css
.heroTitle span {
  color: #111;
  font-weight: 700;
}

.heroTitle strong {
  color: #fff;
  font-weight: 900;
}
```

---

## 4. Section Title

다음과 같은 주요 Section의 `h2`에 적용한다.

- 01 · ABOUT
- 02 · CORE COMPETENCIES
- 03 · SELECTED WORK
- 04 · TECHNICAL SKILLS
- 05 · WHY ME
- 06 · CONTACT

| 화면 | 크기 |
|---|---:|
| Desktop | **35px** |
| Tablet | **31px** |
| Mobile | **28px** |

예시:

```css
.section h2,
.why h2,
.contact h2 {
  font-size: 35px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.035em;
}

@media (max-width: 1024px) {
  .section h2,
  .why h2,
  .contact h2 {
    font-size: 31px;
  }
}

@media (max-width: 620px) {
  .section h2,
  .why h2,
  .contact h2 {
    font-size: 28px;
  }
}
```

---

## 5. Section Kicker

Section 번호와 영문 카테고리를 표시하는 작은 Pill UI.

예:

```text
● 01 · ABOUT
● 02 · CORE COMPETENCIES
● 03 · SELECTED WORK
```

권장 크기:

```css
.kicker {
  font-size: 12px;
}
```

역할:

- Section 위치 표시
- 시각적 리듬 제공
- 주황색 Accent 연결

본문보다 작지만 읽을 수 있어야 하므로 10px 이하로 지나치게 축소하지 않는다.

---

## 6. Hero Typography

### Hero Eyebrow

```text
BACKEND · FULL-STACK · PRODUCT DEVELOPMENT
```

권장:

```css
.eyebrow {
  font-size: 12px;
}
```

### Hero Statement

Hero Main Title 직전에 사용되는 중간 수준의 메시지.

권장:

```css
.heroStatement {
  font-size: 22px;
  font-weight: 500;
  line-height: 1.45;
}
```

### Hero Description

사용자가 실제로 읽어야 하는 설명이므로 충분한 크기를 유지한다.

```css
.heroDescription {
  font-size: 18px;
  line-height: 1.7;
}
```

Mobile에서는 약 16px까지 조정 가능하다.

---

## 7. Body Text

### 주요 본문

Section 설명이나 긴 소개 문장.

```css
.lead {
  font-size: 18px;
  line-height: 1.7;
}
```

예:

- About 설명
- Selected Work 소개
- Why Me 소개

### 카드 본문

```css
.cardDescription,
.projectSummary,
.profileDescription {
  font-size: 16px;
  line-height: 1.65;
}
```

---

## 8. Card Title

Card 내부에서 정보의 핵심이 되는 제목.

권장:

```css
.cardTitle {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
}
```

적용 예:

- Backend Engineering
- Frontend Engineering
- Deployment & Operations
- Project Title
- Profile Name
- Why Me item title

---

## 9. UI Text

Button, Link, Tag, Chip 등 사용자가 직접 클릭하거나 빠르게 인식해야 하는 텍스트.

```css
.button,
.link,
.tag,
.chip {
  font-size: 14px;
}
```

적용 예:

- 프로젝트 보기 →
- About me
- 이력서 보기 →
- 상세 보기 →
- GitHub
- 배포 링크
- PDF
- Supporting Tool Chip

---

## 10. Small Label

작은 라벨, 보조 타이틀, 코드 카테고리 등에 사용한다.

```css
.smallLabel {
  font-size: 12px;
}
```

적용 예:

- BACKEND
- FRONTEND
- DATABASE & AI
- INFRA & TOOLS
- SUPPORTING TOOLS
- EMAIL
- GITHUB

---

## 11. Metadata

페이지의 주요 정보가 아니라 보조 정보를 표시하는 최소 크기.

```css
.meta {
  font-size: 10px;
}
```

적용 예:

- PROFILE / 2026
- ADMIN / SYSTEM
- API STATUS
- BUILD
- Project period
- Project type
- BIRTH / EMAIL / LOCATION / INTERESTS label
- Footer copyright

### 주의

`10px`은 실제 텍스트 최소값으로 사용한다.

일반 본문이나 설명에 10px을 사용하지 않는다.

---

## 12. Header Typography

권장 기준:

| 요소 | 크기 |
|---|---:|
| SONG HYEJIN | 16~18px |
| HOME / WORK / ABOUT | 14px |
| RESEARCH | 12~14px |
| GET IN TOUCH* | 12~14px |

Header는 Desktop에서 반드시 한 줄을 유지한다.

크기를 줄여 한 줄을 맞추기보다 간격과 padding을 조절한다.

---

## 13. Selected Work Typography

### Project Meta

```css
.projectMeta {
  font-size: 10px;
}
```

### Project Title

```css
.projectInfo h3 {
  font-size: 22px;
}
```

### Project Summary

```css
.projectInfo > p:not(.projectMeta) {
  font-size: 16px;
}
```

### Role / Tech

```css
.projectInfo small {
  font-size: 14px;
}
```

### 상세 보기 / External Link

```css
.projectLink,
.projectExternalLink {
  font-size: 14px;
}
```

---

## 14. Technical Skills Typography

### Category

예:

```text
⚙️ BACKEND
🖥️ FRONTEND
🧠 DATABASE & AI
🛠️ INFRA & TOOLS
```

```css
.skillsGrid h3 {
  font-size: 16px;
}
```

### Skill Item

```css
.skillsGrid li {
  font-size: 14px;
}
```

### Supporting Tools

```css
.toolsLabel {
  font-size: 12px;
}

.tools li {
  font-size: 14px;
}
```

---

## 15. Why Me Typography

### Main Title

Section Title 기준 사용.

- Desktop: 35px
- Tablet: 31px
- Mobile: 28px

### Item Title

```css
.whyGrid h3 {
  font-size: 20px;
}
```

### Item Description

```css
.whyGrid p {
  font-size: 16px;
}
```

---

## 16. Contact Typography

### Main Title

Section Title 기준을 기본으로 사용하되, CTA 성격을 강조하고 싶을 경우 Desktop에서 약간 크게 조정할 수 있다.

기본:

- Desktop: 35px
- Tablet: 31px
- Mobile: 28px

### Email

```css
.contactEmail {
  font-size: 18px;
}
```

### Body

```css
.contactDescription {
  font-size: 16px;
}
```

### CTA Link

```css
.contactLink {
  font-size: 14px;
}
```

---

## 17. Footer Typography

| 요소 | 권장 크기 |
|---|---:|
| SONG HYEJIN | 14px |
| Backend Developer | 12px |
| Copyright | 10px |
| THANK YOU | 40~48px |

`THANK YOU`는 정보 전달보다 장식적 역할이 크므로 예외적으로 큰 크기를 사용할 수 있다.

---

## 18. Responsive Typography 원칙

### Desktop

```text
Hero Title        50px
Section Title     35px
Card Title        22px
Main Body         18px
Card Body         16px
UI                14px
Label             12px
Meta              10px
```

### Tablet

```text
Hero Title        44px
Section Title     31px
Card Title        22px
Main Body         17~18px
Card Body         16px
UI                14px
Label             12px
Meta              10px
```

### Mobile

```text
Hero Title        36px
Section Title     28px
Card Title        20~22px
Main Body         16px
Card Body         14~16px
UI                14px
Label             12px
Meta              10px
```

---

## 19. 폰트를 줄여 레이아웃을 맞추지 않는다

반응형에서 다음 방식은 사용하지 않는다.

```css
font-size: 6px;
font-size: 7px;
font-size: 8px;
```

화면이 좁으면 다음 순서로 해결한다.

1. Grid → Column 전환
2. `gap` 조절
3. `padding` 조절
4. 자연스러운 text wrapping
5. Title만 반응형 축소

본문과 UI 텍스트를 지나치게 줄여 공간을 확보하지 않는다.

---

## 20. Font Weight 기준

폰트 크기만으로 위계를 만들지 않는다.

| 역할 | 권장 Weight |
|---|---:|
| Meta | 400~600 |
| Body | 400~500 |
| Button / UI | 600~700 |
| Card Title | 700 |
| Section Title | 800 |
| Hero Title | 800~900 |

---

## 21. Line Height 기준

| 역할 | 권장 Line Height |
|---|---:|
| Hero Title | 1.05~1.15 |
| Section Title | 1.15~1.25 |
| Card Title | 1.15~1.3 |
| Body | 1.6~1.75 |
| Meta / Label | 1.3~1.5 |

본문은 크기만 키우고 line-height를 그대로 두면 답답해질 수 있으므로 함께 조정한다.

---

## 22. Typography 적용 판단 순서

새로운 UI를 만들 때 아래 순서로 결정한다.

```text
이 텍스트는 주요 페이지 제목인가?
→ Hero 50/44/36px

Section 제목인가?
→ 35/31/28px

Card에서 가장 중요한 제목인가?
→ 20~22px

사용자가 읽어야 하는 본문인가?
→ 18px

Card 내부 설명인가?
→ 16px

버튼·링크·태그인가?
→ 14px

작은 Label인가?
→ 12px

Meta / 상태 정보인가?
→ 10px
```

---

## 23. 금지 사항

다음과 같은 임의 크기 추가를 최소화한다.

```text
9px
11px
13px
15px
17px
19px
21px
23px
27px
29px
33px
```

특별한 디자인 이유가 없다면 가장 가까운 기존 Typography Token을 사용한다.

또한 각 페이지마다 새로운 크기 체계를 만들지 않는다.

Home에서 확정한 이 기준을 이후 Work / About / Research 사용자 화면에도 동일하게 확장한다.

---

## 24. QA 체크리스트

### Desktop

- [ ] Hero가 첫 시선의 시작점으로 보이는가
- [ ] Section title이 본문보다 확실히 큰가
- [ ] Card title과 Card body가 구분되는가
- [ ] Project summary를 확대 없이 읽을 수 있는가
- [ ] Skills 항목이 명확하게 보이는가
- [ ] Footer 작은 정보도 읽을 수 있는가

### Tablet

- [ ] Hero 44px이 과도하게 줄바꿈되지 않는가
- [ ] Section 31px이 일관되게 적용되는가
- [ ] Body를 불필요하게 축소하지 않았는가

### Mobile

- [ ] Hero 36px이 화면 밖으로 넘치지 않는가
- [ ] Section 28px이 자연스럽게 줄바꿈되는가
- [ ] Main Body 최소 16px을 유지하는가
- [ ] UI text 14px을 유지하는가
- [ ] Label 12px / Meta 10px 아래로 내려가지 않는가
- [ ] horizontal scroll이 발생하지 않는가

---

## 25. 최종 기준 요약

```text
Meta           10px
Label          12px
UI             14px
Card Body      16px
Main Body      18px
Card/Subheader 22px

Hero
Desktop        50px
Tablet         44px
Mobile         36px

Section
Desktop        35px
Tablet         31px
Mobile         28px
```

이 Typography Scale을 포트폴리오 사용자 사이트의 기본 디자인 시스템으로 사용한다.
