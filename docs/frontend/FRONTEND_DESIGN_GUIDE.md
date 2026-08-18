# Portfolio Frontend Design Guide

> 상태: v5 공통 가이드  
> 기준: Madia Designer 공개 UX/UI 콘텐츠 + 사용자 정리 수치 + 프로젝트 공통 UX/UI 원칙  
> 목적: 포트폴리오 전체에 공통으로 적용되는 UI / UX 품질 기준과 디자인 시스템의 기본 원칙을 정의한다.  
> 적용 범위: 모든 사용자 디자인 시안 브랜치 및 이후 관리자 UI 개선 작업

---

# 00. 문서 목적과 역할

이 문서는 포트폴리오 Frontend 디자인 작업의 공통 UI / UX 기준을 정의한다.

본 문서는 특정 디자인 시안의 색상, 폰트, 장식 방식 또는 레이아웃 스타일을 고정하기 위한 문서가 아니다.

디자인 관련 문서의 역할은 다음과 같이 구분한다.

> **RULES:** 무엇을 수정할 수 있고, 무엇을 수정하면 안 되는가.  
> **GUIDE:** 어떤 품질과 일관성을 지켜야 하는가.  
> **REFERENCE:** 이번 시안은 어떤 모습과 방향을 참고하는가.

문서 우선순위는 다음과 같다.

```text
CODEX_FRONTEND_RULES.md
        ↓
FRONTEND_DESIGN_GUIDE.md
        ↓
FRONTEND_DESIGN_REFERENCE_XX.md
```

즉 다음 우선순위를 따른다.

```text
RULES > GUIDE > REFERENCE
```

본 문서에서 정의하는 것은 디자인의 **역할, 원칙, 품질 기준, 공통 수치 체계**다.

다음과 같은 시안별 실제 표현은 Reference 문서에서 정의한다.

```text
실제 Font Family
실제 Color Hex
실제 Border Radius
실제 Shadow
실제 Grid 형태
실제 Hero 구성
실제 Animation 스타일
선택한 Typography Scale의 구체적 적용값
페이지별 특수 Layout
```

---

# 01. 기준 출처 및 적용 방식

본 v3는 Madia Designer의 공개 UX/UI 콘텐츠를 사용자가 직접 검토하여 정리한 다음 수치를 공통 설계 기준으로 반영한다.

```text
Button Height
Typography Type Scale Ratio
Icon + Text Alignment
8pt Spacing System
Mobile Touch Target
```

이번 v3에서는 다음을 명확히 구분한다.

```text
GUIDE
→ 공통으로 사용할 수 있는 수치 체계와 허용 범위

REFERENCE
→ 현재 시안에서 실제로 선택한 값과 Visual Direction
```

예:

```text
GUIDE
Typography Ratio 후보:
1.200 / 1.250 / 1.333

REFERENCE_01
Typography Ratio:
1.250 사용
```

따라서 GUIDE가 모든 페이지를 동일한 숫자로 강제하는 것이 아니라,  
프로젝트 전체에서 사용할 **일관된 설계 범위와 판단 기준**을 제공한다.

---

# 02. UX/UI 핵심 원칙

## 2.1 사용자 목표가 시각적 장식보다 우선한다

화면을 구성할 때 가장 먼저 판단할 것은 다음이다.

```text
사용자는 이 화면에서 무엇을 확인해야 하는가?
사용자는 무엇을 가장 먼저 이해해야 하는가?
사용자가 다음에 할 수 있는 행동은 무엇인가?
```

디자인 판단 순서는 다음을 기본으로 한다.

```text
사용자 목적
    ↓
정보 구조
    ↓
정보 우선순위
    ↓
시각적 위계
    ↓
Interaction
    ↓
Decoration / Motion
```

장식 요소를 먼저 만들고 콘텐츠를 그 안에 끼워 맞추지 않는다.

---

## 2.2 기본기를 장식보다 우선한다

다음 항목이 해결되지 않은 상태에서 효과, 장식, Animation을 추가하지 않는다.

- 정렬
- 간격
- 가독성
- 대비
- 시각적 위계
- 정보 그룹 구분
- 클릭 가능 여부의 명확성
- Responsive
- 접근성

---

## 2.3 모든 요소를 강조하지 않는다

한 화면에는 명확한 강약이 있어야 한다.

```text
Primary
Secondary
Tertiary
Supporting
```

가장 중요한 정보만 가장 강하게 표현한다.

---

## 2.4 디자인 요소는 목적을 가져야 한다

다음 요소는 단순 장식이 아니라 역할을 가져야 한다.

- Color
- Icon
- Image
- Shadow
- Border
- Radius
- Motion
- Hover
- Background Graphic

---

# 03. Information Architecture & Visual Hierarchy

## 3.1 Visual Style 적용 전에 정보 구조를 먼저 정한다

디자인 작업은 다음 순서로 수행한다.

```text
01. Information Architecture
        ↓
02. Priority
        ↓
03. Reading Order
        ↓
04. Grouping
        ↓
05. Visual Contrast
        ↓
06. Decoration
```

Visual Contrast를 먼저 만든 뒤 정보를 끼워 맞추지 않는다.

---

## 3.2 정보 우선순위

각 페이지의 정보는 다음 단계로 구분한다.

### Primary

페이지에서 가장 먼저 이해해야 하는 정보.

### Secondary

Primary 내용을 보완하며 다음 탐색을 유도하는 정보.

### Tertiary

세부 설명, 메타 정보, 보조 기능.

### Supporting

상태, 추가 링크, 보조 설명.

---

## 3.3 Reading Order

사용자가 어떤 순서로 정보를 읽어야 하는지 먼저 결정한다.

시각적 위치는 Reading Order를 방해하지 않아야 한다.

---

## 3.4 Grouping

서로 관련된 정보는 가까운 간격과 공통 정렬축으로 묶는다.

서로 다른 정보 그룹은 더 큰 여백으로 분리한다.

---

## 3.5 Visual Contrast

정보 위계는 Font Size 하나만으로 만들지 않는다.

다음을 조합한다.

- Size
- Weight
- Color
- Position
- Spacing
- Width
- Surface
- Image Scale

---

## 3.6 강 / 중 / 약 계층

```text
Strong
→ 핵심 제목 / 핵심 CTA / 가장 중요한 정보

Medium
→ 일반 본문 / Subheading / 주요 보조 정보

Weak
→ Metadata / Supporting Information
```

Weak는 읽기 어려운 수준으로 흐리게 만들지 않는다.

---

# 04. Portfolio Information Priority

포트폴리오 방문자가 짧은 시간 안에 다음 정보를 이해할 수 있어야 한다.

```text
01. 누구인가
02. 어떤 개발자인가
03. 무엇을 만들었는가
04. 프로젝트에서 어떤 역할을 했는가
05. 어떤 기술을 사용하는가
06. 어떤 방식으로 문제를 해결했는가
07. 어떻게 연락할 수 있는가
```

---


# 04-1. 현재 사용자 UI 분석 기반 공통 기준

현재 구현된 사용자 화면과 실제 Frontend CSS 구조를 분석한 결과를 공통 기준에 반영한다.

## 유지할 현재 UI 장점

```text
과도하지 않은 Color 사용
넉넉한 Whitespace
단순하고 명확한 Header
페이지별 명확한 제목
Divider를 활용한 정보 구분
Research List의 비-Card 구조
Contact의 단순한 정보 구조
Project의 기술 / 역할 정보 노출
과도하지 않은 Footer
개발 프로젝트 중심의 명확한 Portfolio 목적
```

## 이후 디자인에서 피할 주요 Anti-pattern

```text
Everything is a Card
Nested Page Container
페이지별 임의 Breakpoint
페이지별 임의 Typography Scale
Mobile에서 Desktop Fixed Size 유지
작은 Visual Control을 그대로 작은 Touch Target으로 사용
Component 내부 Hardcoded Color 남용
Loading / Empty / Error UI의 페이지별 중복
장문 콘텐츠를 일반 Layout 폭과 동일하게 사용
Home과 Work에서 동일 Project Card 밀도를 그대로 사용
```

위 문제는 Frontend Layout / CSS / Presentation 계층에서 해결한다.

Backend, API Contract, Mapper, Type, Route, 기존 데이터 처리 로직을 디자인 작업을 이유로 변경하지 않는다.

---

# 05. Semantic Design System

GUIDE에서는 의미 기반 역할과 공통 수치 체계를 정의한다.

실제 시안 적용값은 Reference에서 선택한다.

## 5.1 Color Role

```text
Background
Surface
Surface Elevated
Text Primary
Text Secondary
Text Muted
Border
Accent
Accent Strong
Success
Warning
Error
```

---

## 5.2 Typography Role

```text
Display
Heading 1
Heading 2
Heading 3
Body Large
Body
Small
Caption
Eyebrow
Code
```

---

## 5.3 Spacing Role

```text
Micro
Atomic
Molecule
Organism
Section
```

실제 수치 기준은 `07. Spacing System`을 따른다.

---

# 06. Layout System

## 6.1 정렬 축을 일관되게 유지한다

같은 페이지 안에서 이유 없이 많은 좌우 정렬 기준을 만들지 않는다.

---

## 6.2 콘텐츠 폭을 역할에 따라 제한한다

Desktop 화면이 넓다고 해서 텍스트를 브라우저 전체 폭으로 늘리지 않는다.

특히 다음은 읽기 가능한 최대 폭을 고려한다.

- 설명 문단
- Research 본문
- Project Detail 본문
- About 장문 Section

---

## 6.3 레이아웃은 콘텐츠 관계를 설명해야 한다

Grid와 Column은 다음 관계를 구분하는 역할을 가져야 한다.

- 주요 콘텐츠 / 보조 콘텐츠
- 대표 프로젝트 / 일반 프로젝트
- 제목 / 상세 설명
- 이미지 / 메타 정보
- 탐색 / 본문

---


## 6.4 Container는 역할에 따라 구분한다

공통 Container는 다음 세 역할을 기준으로 한다.

```text
Wide Container
→ 대형 Project Visual / Wide Grid / Media Section

Standard Container
→ Home / Work / About / Contact / Research List 등 일반 Page

Reading Container
→ Research Detail / Project 장문 / About Long-form
```

기본 관계:

```text
Wide > Standard > Reading
```

정확한 `max-width` 값은 각 `FRONTEND_DESIGN_REFERENCE_XX.md`에서 확정한다.

---

## 6.5 Nested Page Container를 기본값으로 사용하지 않는다

공통 Main Layout 안에서 Page Component가 다시 전체 Page 폭을 줄이는 구조를 만들지 않는다.

```text
잘못된 예

MainLayout
└── max-width + horizontal padding
    └── Page
        └── width: calc(100% - ...)
```

특정 Section만 다른 폭이 필요하면 `Wide`, `Standard`, `Reading` 역할을 명시적으로 적용한다.

---

## 6.6 Breakpoint는 공통 역할로 관리한다

현재 Frontend에는 다음처럼 유사한 Breakpoint가 페이지별로 분산되어 있다.

```text
900 / 768 / 760 / 720 / 640 / 420
```

새 디자인에서는 각 Page가 비슷한 Breakpoint를 임의로 추가하지 않는다.

공통 역할:

```text
Mobile
Tablet
Desktop
Wide
```

실제 px 값은 디자인 Reference에서 확정한다.

Breakpoint는 Device 이름만으로 정하지 않고 실제 Layout이 무너지는 지점을 기준으로 선택한다.

확인 항목:

```text
Navigation이 한 줄을 유지하는가
Grid Column 수가 적절한가
Typography 줄바꿈이 자연스러운가
Card 내부 정보가 과도하게 압축되지 않는가
Touch Target을 확보할 수 있는가
Reading Width가 적절한가
```

---

# 07. Spacing System

## 7.1 기본 Grid는 8px을 사용한다

전체 UI의 주요 Spacing Rhythm은 `8px Grid`를 기준으로 한다.

기본 공식:

```text
N × 8px
```

예:

```text
8
16
24
32
40
48
56
64
80
...
```

---

## 7.2 4px은 소형 Component의 보완 단위로 사용한다

다음처럼 미세한 정렬과 내부 간격이 필요한 경우 4px Sub-grid를 사용할 수 있다.

```text
4
8
12
16
20
24
...
```

4px 단위는 전체 Layout의 기본 Rhythm을 대체하지 않는다.

---

## 7.3 Spacing의 핵심 역할은 Grouping이다

```text
가까운 요소
→ 같은 정보 그룹

더 큰 간격
→ 서로 다른 정보 그룹
```

---

## 7.4 내부 Padding 기준

### Chip / Tag

```text
4px ~ 8px
```

### Button / Input

```text
Horizontal:
12px ~ 16px

Vertical:
8px ~ 12px
```

단, Button의 최종 Height 기준을 우선한다.

### Card / Modal

```text
16px
24px
32px
```

콘텐츠 밀도와 시안 특성에 따라 Reference에서 선택한다.

---

## 7.5 외부 요소 간 Gap 기준

### Atomic — 강하게 연관된 요소

```text
4px ~ 8px
```

예:

```text
Icon ↔ Label
Title ↔ Supporting Label
Input ↔ Help Text
```

### Molecule — Card 내부의 관련 요소

```text
12px ~ 16px
```

### Organism — 독립된 Component 간

```text
24px ~ 32px
```

### Section — Section / Module 간

```text
48px
64px
80px
```

---

## 7.6 Section 간격과 요소 간격

기본 관계:

```text
Section
>
Organism
>
Molecule
>
Atomic
```

---

## 7.7 Spacing을 판단하기 어렵다면 넓게 시작한다

충분한 여백에서 시작한 뒤 콘텐츠 관계가 유지되는 범위까지 좁힌다.

---

# 08. Typography System

## 8.1 Typography는 정보 구조를 보여주는 도구다

Typography만 보아도 다음을 구분할 수 있어야 한다.

- 페이지 제목
- Section 제목
- 카드 제목
- 설명
- 메타 정보
- 보조 정보

---

## 8.2 가독성을 미적 축소보다 우선한다

더 많은 정보를 넣기 위해 Font Size를 과도하게 줄이지 않는다.

작게 만드는 것이 곧 세련된 디자인을 의미하지 않는다.

---

## 8.3 Type Scale은 목적에 따라 선택한다

프로젝트에서 사용할 수 있는 기본 Scale Ratio는 다음 세 가지다.

### Minor Third — 1.200

적합한 영역:

```text
Mobile
정보 밀도가 높은 UI
Dashboard
Admin
```

기준 예:

```text
Caption     12px
Body        14px
Body Large  16px ~ 17px
H3          20px
H2          24px
H1          28px ~ 29px
```

---

### Major Third — 1.250

적합한 영역:

```text
일반 Web Service
Portfolio 기본 Content
일반 사용자 화면
```

기준 예:

```text
Caption     12px
Small       13px ~ 14px
Body        16px
H3          20px
H2          25px
H1          31px ~ 32px
Display     39px ~ 40px
```

---

### Perfect Fourth — 1.333

적합한 영역:

```text
Landing Page
Marketing
Hero
강한 Typography 대비가 필요한 영역
```

기준 예:

```text
16px
→ 21px
→ 28px
→ 37px
→ 50px
```

---

## 8.4 Scale을 페이지마다 무작위로 섞지 않는다

한 디자인 시안에서 기본 Type Scale을 먼저 선택한다.

예:

```text
REFERENCE_01
Base Scale = Major Third 1.250
```

특수 Hero 영역에서 더 큰 대비가 필요할 경우 예외를 둘 수 있으나  
기본 Body / Heading 체계는 일관성을 유지한다.

---

## 8.5 Display와 Body를 분리한다

Display Typography는 Visual Identity를 강하게 표현할 수 있다.

Body Typography는 장시간 읽기 편한 가독성을 우선한다.

---

## 8.6 줄바꿈도 디자인 요소로 본다

다음을 함께 고려한다.

- Max Width
- Line Break
- Word Break
- Responsive Font Size

---

# 09. Icon System

## 9.1 Icon과 Text는 하나의 Component로 정렬한다

Icon과 Text를 각각 별도로 배치하지 않고 하나의 정보 또는 Action 단위로 본다.

---

## 9.2 Text Size별 Icon Size 기준

```text
12px Text
→ 16px Icon

14px ~ 16px Text
→ 20px Icon

16px ~ 18px Text
→ 24px Icon

20px ~ 24px Text
→ 28px ~ 32px Icon
```

---

## 9.3 Icon + Text Gap 기준

### Small

```text
12px ~ 14px Text
→ 4px Gap
```

### Medium

```text
16px Text / 기본 Button
→ 6px ~ 8px Gap
```

### Large

```text
18px 이상 Text / Card / Header
→ 12px Gap
```

---

## 9.4 Icon Size와 Touch Target은 다르다

예:

```text
24px Icon
≠
24px Touch Target
```

작은 Icon을 사용하더라도 실제 Interactive Area는 별도로 확보한다.

---

# 10. Color System

## 10.1 컬러는 계층을 가진다

```text
Strong
Medium
Weak
Accent
```

---

## 10.2 Accent는 제한적으로 사용한다

Accent는 다음과 같이 중요도를 표현하는 곳에 우선 사용한다.

- 주요 CTA
- Active State
- 중요한 Status
- 핵심 Highlight

---

## 10.3 약하게 보이는 것과 읽기 어려운 것은 다르다

Secondary / Muted Text를 표현하기 위해 명도를 낮출 수 있다.

정보 위계를 위해 읽기 어려운 수준까지 Contrast를 낮추지 않는다.

---

## 10.4 Text Contrast

Web 접근성 품질 기준:

```text
일반 텍스트
→ 최소 4.5:1

Large Text
→ 최소 3:1
```

---

# 11. Button System

## 11.1 Button은 Action을 실행할 때 사용한다

다른 페이지 또는 외부 Resource로 이동하는 경우 Link를 우선한다.

---

## 11.2 Button Height Scale

### XSmall / Inline

```text
28px ~ 32px
```

용도 예:

```text
보조 Inline Action
Dense UI
Secondary Utility
```

모바일 Primary Touch Action으로 사용하지 않는다.

---

### Small

```text
36px
```

용도 예:

```text
보조 Action
Dense Desktop UI
```

---

### Medium — Default

```text
40px ~ 44px
```

용도 예:

```text
Desktop 기본 Button
일반 Form Action
일반 사용자 Action
```

---

### Large

```text
48px ~ 52px
```

용도 예:

```text
Mobile Primary Action
중요 CTA
큰 Form Submit
```

---

### XLarge

```text
56px
```

용도 예:

```text
Full-width Bottom Button
강한 Primary CTA
```

---

## 11.3 Visual Height와 Touch Target을 구분한다

Button 자체가 작더라도 모바일 Touch Target은 별도로 확보한다.

프로젝트 Mobile 기준:

```text
iOS 기준
44 × 44px 이상

Android 기준
48 × 48px 이상
```

모바일 웹에서 Platform별 UI를 분리하지 않는 경우  
Reference에서 Target Size 정책을 하나로 통일하여 적용한다.

---

## 11.4 Action Priority

```text
Primary
Secondary
Tertiary
```

모든 Action을 같은 시각 강도로 표현하지 않는다.

---

# 12. Form System

## 12.1 Form Field 구조

```text
Label
Input / Select / Textarea
Help Text
Validation Message
```

Label, 입력 영역, 설명, Validation은 하나의 Field Group으로 인식되어야 한다.

---

## 12.2 Input / Select Height Scale

### Small

```text
36px
```

적합한 영역:

```text
밀도 높은 Admin UI
Table 내부 Control
보조 Filter
```

일반 사용자 Mobile Form의 기본 높이로 사용하지 않는다.

### Medium — Standard

```text
40px ~ 44px
```

적합한 영역:

```text
Desktop 기본 Form
일반 Input
일반 Select
```

### Large

```text
48px ~ 52px
```

적합한 영역:

```text
Mobile Form
독립 Search Field
중요 입력 Action
```

Input / Select 높이는 Typography, Padding, Touch Target을 함께 고려하여 선택한다.

---

## 12.3 Textarea

기본 최소 높이:

```text
96px ~ 120px
```

최소 3~4줄 정도의 입력 영역을 확보하는 것을 기본으로 한다.

Textarea는 모든 경우에 고정 높이로 제한하지 않는다.

콘텐츠 성격에 따라 다음 중 하나를 선택한다.

```text
Auto Grow
Vertical Resize
내부 Scroll
```

긴 콘텐츠 입력에서 Textarea가 화면 전체 Layout을 불필요하게 무너뜨리지 않도록 한다.

---

## 12.4 Input Padding

기본 참고 범위:

```text
Horizontal
12px ~ 16px

Vertical
8px ~ 12px
```

최종 Height와 Typography 조합을 우선한다.

---

## 12.5 필수 Interactive State

Form Control은 최소 다음 상태를 구분할 수 있어야 한다.

```text
Default
Hover
Focus / Focus-visible
Disabled
Error
```

필요한 경우 다음 상태를 추가할 수 있다.

```text
Success
Read-only
Required
Optional
```

Mobile처럼 Hover가 존재하지 않는 환경에서도 Default / Focus / Disabled / Error 상태는 명확해야 한다.

---

## 12.6 State Color는 Semantic Token으로 정의한다

특정 Hex Color를 GUIDE에 고정하지 않는다.

다음 Semantic Role을 사용한다.

```text
Border Default
Border Hover
Border Focus
Surface Disabled
Text Disabled
Border Error
Text Error
Focus Ring
```

예:

```css
--color-border-default: TBD;
--color-border-hover: TBD;
--color-focus-ring: TBD;
--color-surface-disabled: TBD;
--color-error: TBD;
```

실제 색상값은 각 Reference에서 정의한다.

---

## 12.7 Focus State

Focus 상태는 단순히 Border Color만 약하게 변경해서는 안 된다.

Keyboard 사용자가 현재 위치를 명확하게 인지할 수 있어야 한다.

다음과 같은 방식을 사용할 수 있다.

```text
2px 수준의 Focus Ring / Outline
명확한 Border Contrast
필요한 경우 보조 Shadow
```

기본 Browser Focus를 이유 없이 제거하지 않는다.

---

## 12.8 Error State

Error는 Color만으로 전달하지 않는다.

다음을 함께 제공한다.

```text
Error Border / Icon 등 시각적 신호
+
해당 Field와 가까운 Validation Message
```

Error Message는 어떤 입력이 잘못되었고 가능한 경우 어떻게 수정할 수 있는지 이해할 수 있어야 한다.

---

## 12.9 Disabled State

Disabled 상태는 동작 불가임을 명확하게 표현한다.

단순히 Opacity만 극단적으로 낮춰 읽을 수 없게 만들지 않는다.

---

# 13. Card & List System

## 13.1 Card는 모든 콘텐츠의 기본값이 아니다

다음과 같은 경우 사용을 검토한다.

- 반복 콘텐츠 그룹
- 서로 독립적인 정보 단위
- 이미지 + 텍스트 선택 단위
- 비교 가능한 콘텐츠

---

## 13.2 Card / List를 디자인하기 전에 정보 순서를 정한다

기본 판단 구조:

```text
01. Primary Identifier
02. Primary Context
03. Secondary Information
04. Supporting Metadata
05. Action
```

예:

```text
Project Title
→ Summary
→ Tech / Role
→ Date / Type
→ Detail Action
```

---

## 13.3 정보 위계 문제를 Decoration으로 해결하지 않는다

정보 위계가 잘못된 Card를 다음 요소만 변경하여 해결하지 않는다.

- Border
- Color
- Shadow
- Radius

먼저 다음을 검토한다.

- 정보 순서
- Grouping
- 중복 정보
- 중요도가 낮은 정보의 위치
- Action 위치

---

## 13.4 Card Padding

```text
16px
24px
32px
```

시안의 정보 밀도에 따라 선택한다.

---

## 13.5 Card 내부 Gap

```text
Atomic
4px ~ 8px

Molecule
12px ~ 16px
```

---

# 14. Image & Media

## 14.1 이미지는 콘텐츠 우선순위에 따라 크기를 결정한다

이미지가 핵심인 프로젝트는 Visual 영역을 강조할 수 있다.

텍스트 설명이 핵심인 영역에서는 이미지가 내용을 압도하지 않도록 한다.

---

## 14.2 원본 비율을 이유 없이 왜곡하지 않는다

같은 역할의 Thumbnail / Hero Image는 일관된 Ratio 정책을 검토한다.

---

## 14.3 이미지가 없어도 Layout이 무너지지 않아야 한다

Optional / Empty 상태를 고려한다.

---

# 15. Interaction & Motion

## 15.1 Motion은 목적이 있어야 한다

허용 목적 예:

- 상태 변화 전달
- 클릭 가능성 안내
- 콘텐츠 관계 설명
- 화면 전환의 맥락 유지
- 주요 Visual 강조

---

## 15.2 Hover만으로 정보를 전달하지 않는다

Touch Device에서는 Hover가 없으므로 핵심 정보나 기능을 Hover에만 의존하지 않는다.

---

# 16. Responsive & Mobile UI

## 16.1 Responsive는 Desktop의 단순 축소가 아니다

다음 요소를 재구성할 수 있다.

- Grid Column
- 콘텐츠 순서
- Section Gap
- Typography Scale
- Image Ratio
- Card Layout
- Navigation
- CTA 배치

---

## 16.2 Mobile에서는 Reading을 별도로 검토한다

- Font가 지나치게 작아지지 않는가
- Line Length가 지나치게 길지 않은가
- 장문이 읽기 어려워지지 않는가
- 제목 줄바꿈이 의미를 해치지 않는가

---

## 16.3 Mobile에서는 Touch를 별도로 검토한다

프로젝트 Touch Target 기준:

```text
iOS 참고
최소 44 × 44px

Android 참고
최소 48 × 48px
```

Visual Icon 크기와 실제 Touch Area를 구분한다.

본 프로젝트는 Web이므로 Platform Native 값을 그대로 강제하기보다
Mobile Web에서 충분한 Touch Area를 확보하기 위한 권장 범위로 사용한다.

---

## 16.4 Mobile에서는 Information Density를 다시 조정한다

Desktop과 동일한 정보량을 한 화면에 넣기 위해 Font, Gap, Image를 무리하게 축소하지 않는다.

---


## 16.6 Responsive에서는 Typography도 재구성한다

Desktop에서 사용한 고정 Font Size를 Mobile에 그대로 유지하지 않는다.

현재 UI처럼 Desktop Hero / Section Heading 값이 페이지별로 크게 다른 경우,
Reference에서 선택한 Type Scale을 기준으로 Mobile Typography를 다시 설계한다.

---

## 16.7 Dynamic Grid는 데이터 개수를 고려한다

고정 Column 수 때문에 실제 데이터 개수와 맞지 않는 빈 영역이 발생하지 않도록 한다.

필요한 경우 다음 방식을 검토한다.

```text
auto-fit
minmax(...)
Breakpoint 기반 Column 변경
데이터 개수 기반 Layout Variant
```

---

## 16.8 작은 Visual Control과 실제 Hit Area를 분리한다

Carousel Dot, Arrow, 작은 Icon Button은 시각적으로 작아도 실제 Interactive Area는 충분히 확보한다.

예:

```text
Visual Dot
8px ~ 10px

Actual Button Area
44px 수준 이상 검토
```


## 16.5 최소 검증 화면 후보

최종 Breakpoint는 기존 코드 분석 후 확정한다.

```text
Mobile
320
375
390
430

Tablet
768

Small Desktop
1024

Desktop
1280+

Wide Desktop
1440+
```

---

# 17. Navigation System

Navigation 수치는 고정 법칙이 아니라 Layout 설계를 위한 공통 참고 범위다.

현재 Portfolio 사용자 화면과 Admin 화면에 필요한 Navigation Pattern만 선택하여 사용한다.

## 17.1 Desktop Top Navigation

기본 참고 높이:

```text
64px ~ 72px
```

다음을 명확히 구분한다.

```text
Default
Hover
Active / Current
Focus-visible
```

현재 위치는 Color 하나에만 의존하지 않고 필요하면 Weight, Indicator, Border 등으로 보조할 수 있다.

---

## 17.2 Desktop Sidebar / LNB

Sidebar가 필요한 Admin UI에서 참고한다.

Expanded:

```text
240px ~ 280px
```

Collapsed / Icon-only:

```text
64px ~ 72px
```

사용자 Portfolio 화면에 Sidebar가 필요하지 않다면 억지로 적용하지 않는다.

---

## 17.3 Mobile Top Navigation

App-like Top Bar가 필요한 경우 참고 높이:

```text
56px
```

대표 Control 예:

```text
Back
Menu
Title
Action
```

Icon의 Visual Size와 Touch Target은 별도로 관리한다.

---

## 17.4 Mobile Bottom Navigation

Bottom Navigation은 모든 Mobile Web에 필수 패턴이 아니다.

명확한 최상위 목적지가 3~5개이고
반복 탐색 빈도가 높은 경우에만 검토한다.

기본 참고 높이:

```text
56px ~ 64px
```

Touch Target:

```text
최소 48 × 48px 수준 확보 권장
```

현재 Portfolio 정보 구조상 Header / Menu만으로 탐색이 충분하다면 Bottom Navigation을 추가하지 않는다.

---

## 17.5 Drawer / Hamburger Menu

Mobile에서 메뉴를 Drawer 형태로 제공할 경우 Background Scrim을 사용해
현재 활성 Layer와 Background를 시각적으로 구분한다.

Scrim의 실제 색상과 투명도는 Reference에서 정의한다.

`50% black` 같은 특정 값은 GUIDE의 절대값으로 고정하지 않는다.

---

# 18. Feedback UI States

Loading / Empty / Error는 장식이 아니라 시스템 상태를 사용자에게 설명하는 UI다.

## 18.1 Loading State

짧고 국소적인 비동기 동작에는 Spinner / Progress Indicator를 사용할 수 있다.

예:

```text
Button Submit
짧은 저장 동작
작은 영역 Refresh
```

`1초 이내`는 참고 휴리스틱으로 사용할 수 있지만 절대 경계값으로 강제하지 않는다.

너무 짧은 작업에서 Loader가 순간적으로 나타났다 사라져 Flicker가 생기지 않도록 한다.

---

## 18.2 Skeleton UI

Skeleton은 콘텐츠 구조가 이미 알려져 있고
초기 로딩 동안 Layout Shift를 줄이는 데 의미가 있을 때 사용한다.

실제 콘텐츠 구조와 가능한 한 유사한 Placeholder를 제공한다.

예:

```text
Project Card
Research List
Image + Text Card
Detail Header
```

Skeleton을 실제 콘텐츠와 무관한 임의의 회색 박스로 만들지 않는다.

Skeleton Color는 Semantic Token으로 관리한다.

```text
Skeleton Base
Skeleton Highlight
```

실제 Hex Color는 Reference에서 정의한다.

Pulse / Shimmer Animation은 과도하지 않게 사용하며
`prefers-reduced-motion`을 고려한다.

---

## 18.3 Empty State

데이터가 없을 때 단순한 빈 화면을 노출하지 않는다.

기본 구성:

```text
Optional Icon / Illustration
+
명확한 Empty Message
+
필요한 경우 다음 행동
```

CTA는 항상 필수가 아니다.

사용자가 실제로 수행할 수 있는 의미 있는 다음 행동이 있을 때 제공한다.

예:

```text
Admin Projects Empty
→ 프로젝트 등록 CTA 가능

Public Research Empty
→ 단순 안내가 더 적절할 수 있음
```

---

## 18.4 Error State

Error는 가능한 한 다음 정보를 제공한다.

```text
무슨 문제가 발생했는가
사용자가 지금 할 수 있는 행동이 있는가
```

Retry가 가능한 오류라면 Retry Action을 제공한다.

예:

```text
Network Error
일시적 API 실패
재시도 가능한 5xx
```

Retry로 해결할 수 없는 오류에 무조건 Retry Button을 제공하지 않는다.

---

## 18.5 State UI도 Information Hierarchy를 따른다

상태 화면에서도 다음 우선순위를 유지한다.

```text
상태 인지
→ 설명
→ 다음 행동
```

State Illustration이 Message나 CTA보다 강하게 보이지 않도록 한다.

---

# 19. Accessibility & Usability

접근성 기준은 디자인 시안과 무관하게 유지한다.

기본 확인 항목:

- Text / Background Contrast
- Keyboard 접근
- Focus 상태
- Semantic HTML
- alt
- label
- aria 속성
- 충분한 Touch Target
- Link 인지 가능성
- Motion Reduction 고려

---

# 20. Dynamic Content Safety

본 포트폴리오는 관리자 화면에서 콘텐츠를 직접 입력하므로 정적 Mockup만 기준으로 디자인하지 않는다.

다음 상태에서도 Layout이 깨지지 않아야 한다.

```text
긴 프로젝트 제목
긴 Summary
긴 Role
많은 Tech Stack
긴 Research 제목
긴 Section 제목
긴 URL
긴 Email
Rich Text 장문
이미지 없음
Optional Link 없음
데이터 없음
```

---


# 20-1. Page Visual Hierarchy & Portfolio UX Anti-pattern

## Page 단위 위계

기본 관계:

```text
Page Hero
>
Primary Section
>
Secondary Section
>
Card / List Content
>
Supporting Information
```

모든 Page가 동일한 Hero 크기를 가질 필요는 없지만,
Page Hero와 첫 번째 Section이 같은 강도로 경쟁하지 않도록 한다.

---

## Home과 Work는 동일한 Project Presentation을 강제하지 않는다

같은 Project 데이터를 사용하더라도 Page 목적이 다르므로 정보 밀도를 다르게 설계할 수 있다.

```text
Home
→ 대표 프로젝트 Preview / 압축된 정보

Work
→ 프로젝트 탐색 / 비교 가능한 정보
```

공통 Component를 사용할 경우 Presentation Variant를 검토할 수 있다.

```text
ProjectCard
├── Featured
├── Standard
└── Compact
```

Variant는 Presentation만 변경하며 데이터 처리 로직은 변경하지 않는다.

---

## Everything-is-a-Card를 피한다

Project Detail의 모든 Section을 동일한 Box로 감싸면 Story와 중요도 차이가 평평해질 수 있다.

콘텐츠 성격에 따라 다음 표현을 선택할 수 있다.

```text
Image Section
Callout
Diagram
Text Story
List
Divider Section
Card
```

---

## Long-form Full-width를 피한다

장문 콘텐츠는 일반 Page Container와 별도로 Reading Container 사용을 검토한다.

적용 후보:

```text
Research Detail
Project Troubleshooting
Project Case Study
About Long-form Section
```

---

## Component Hardcoded Color를 최소화한다

공통 의미를 가진 색상은 Semantic Token을 우선 사용한다.

```text
Text Primary
Text Secondary
Surface Muted
Border Default
Accent
Focus
Error
```

---

## State UI를 페이지마다 새로 만들지 않는다

Loading / Empty / Error / Retry 표현이 반복되는 경우 공통 State Component 또는 공통 Style을 우선 검토한다.

Page별 문구와 Action은 상황에 맞게 달라질 수 있다.

---

# 21. Page Information Architecture

Reference에 따라 Visual Layout은 변경할 수 있지만 핵심 정보 구조는 유지한다.

## 21.1 Home

```text
Developer Positioning
Selected Work
Core Competencies
Research
Contact CTA
```

## 21.2 Work

```text
Selected Work
Research
More Work
```

## 21.3 Project Detail

```text
Project Intro
Project Metadata
Role
Tech Stack
Detail Sections
Images
External Links
```

## 21.4 Research List

목록 판단에 필요한 제목, 요약 또는 날짜가 명확해야 한다.

## 21.5 Research Detail

장문 읽기 경험을 우선한다.

## 21.6 About

```text
Intro
Core Competencies
Long-form Sections
CTA
```

## 21.7 Contact

```text
Intro
Email
GitHub
LinkedIn (Optional)
Resume (Optional)
```

---

# 22. User / Admin UI 역할 분리

## 22.1 User UI

```text
Brand
Story
Content
Visual Hierarchy
Exploration
Portfolio Experience
```

## 22.2 Admin UI

```text
Efficiency
Readability
Input Accuracy
Status Recognition
Form Usability
Management
```

사용자 UI 디자인 완료 후 Admin Design을 별도 구체화한다.

---

# 23. Reference 활용 원칙

Reference는 복제 대상이 아니다.

각 Reference 문서에서는 다음을 구분한다.

```text
참고할 요소
참고하지 않을 요소
현재 프로젝트에 맞게 변경할 요소
```

현재 Portfolio의 기능과 Information Architecture를 기준으로 재해석한다.

---

# 24. Design Quality Checklist

각 사용자 페이지 디자인 완료 후 최소 다음을 확인한다.

```text
[ ] 페이지 목적이 빠르게 이해되는가
[ ] Primary / Secondary / Supporting 정보가 구분되는가
[ ] Reading Order가 자연스러운가
[ ] 정보 Grouping이 명확한가
[ ] Typography hierarchy가 명확한가
[ ] 선택한 Type Scale이 일관되는가
[ ] Font가 지나치게 작지 않은가
[ ] 8px Grid Rhythm이 유지되는가
[ ] Micro Spacing에만 4px 보완값을 사용하는가
[ ] Section / Organism / Molecule / Atomic 간격이 구분되는가
[ ] Icon Size와 Text Size 조합이 적절한가
[ ] Icon ↔ Text Gap이 일관적인가
[ ] Button Height가 역할에 맞는가
[ ] Mobile Touch Target이 충분한가
[ ] Button과 Link 역할이 올바른가
[ ] Accent가 과도하지 않은가
[ ] Text Contrast가 충분한가
[ ] Card/List 정보 순서가 명확한가
[ ] Decoration으로 정보 구조 문제를 가리고 있지 않은가
[ ] 긴 콘텐츠에서도 Layout이 유지되는가
[ ] Optional / Empty 상태에서 깨지지 않는가
[ ] Mobile에서 정보 우선순위가 유지되는가
[ ] Horizontal Overflow가 발생하지 않는가
[ ] Focus 상태를 확인할 수 있는가
[ ] 불필요한 Motion이 없는가
[ ] 기존 기능이 유지되는가
[ ] npm run build가 성공하는가
```

---

# 25. Design Decision Log

공통 디자인 원칙에 영향을 주는 결정은 본 문서에 누적 기록한다.

```text
Decision ID:
Date:
Topic:
Decision:
Reason:
Affected Pages:
Reference:
```

한 시안에만 해당하는 결정은 해당 Reference 문서에 기록한다.

---

# 26. 이후 보강 항목

User UI 공통 GUIDE는 v5에서 1차 완성 상태로 본다.

이후 다음 값은 `FRONTEND_DESIGN_REFERENCE_XX.md` 또는 Admin UI 단계에서 확정한다.

```text
01. 실제 Wide / Standard / Reading Container Width
02. Mobile / Tablet / Desktop / Wide Breakpoint px 값
03. Font Family 및 기본 Type Scale 선택
04. 실제 Color / Radius / Shadow
05. Header / Mobile Menu 시안
06. Loading / Skeleton 적용 대상 Page
07. Empty / Error State 문구 기준
08. Admin UI 공통 Layout
09. Admin Table / Filter / Pagination
10. Admin Form Grouping 및 Action Area
```

---

# 27. 현재 참고 자료

## Typography

- https://youtu.be/I5PCjKKcC3M
- https://youtu.be/xDpGgZHTcIw
- https://youtu.be/PN2UEPWlry4
- https://youtu.be/psiynSF1Hlc

## Spacing / Numeric UI

- https://youtu.be/7kQueG4itfs
- https://youtu.be/ypN7i85kp7g
- https://youtu.be/QOgsI3EufKs
- https://youtu.be/mNFgkVHf2rI

## Color

- https://youtu.be/8sMNvinRLu0

## Button / Form / Card

- https://youtu.be/MJKb-4dqjVg
- https://youtu.be/ng_XUF1UaDE
- https://youtu.be/suzkaiYaAfg

## Mobile UI

- https://youtu.be/ziytfuGvhhg

## Visual Hierarchy / IA

- https://youtu.be/fGNrtQw4Czg
- https://youtu.be/ETYQ9zaYFNw

## Form / Navigation / Feedback UI

- http://www.youtube.com/watch?v=psiynSF1Hlc
- http://www.youtube.com/watch?v=ETYQ9zaYFNw
- http://www.youtube.com/watch?v=fGNrtQw4Czg


---

# 28. 현재 Frontend 구현 상태 기록

아래 값은 업로드된 현재 Frontend 코드를 분석한 **현행 구현값**이다.

최종 디자인 시안에 자동 승계되는 값이 아니라 Reference 작성 시 유지 / 변경 여부를 판단하기 위한 기준점으로 사용한다.

```text
Global layout max-width
1120px

Global horizontal page padding
24px

현재 주요 Breakpoint
900 / 768 / 760 / 720 / 640 / 420

현재 공통 Radius Token
12 / 16 / 24 / pill

현재 Spacing
8pt 계열 값이 다수 사용되나 페이지별 개별 값도 혼재

현재 Color
Global Semantic Token과 Component Hardcoded Color가 혼재
```

추가 확인된 구현 이슈:

```text
Contact Page의 중첩 Container
About competencyGrid의 Mobile Column 대응 부족
Work Hero Typography의 별도 Mobile Scale 부재
Project Detail의 고정 Hero Height / Padding
Carousel Dot의 실제 Hit Area 부족
상태 UI 표현의 페이지별 불일치
일부 CSS에서 정의되지 않은 --color-text 사용
```

위 이슈는 디자인 시안 구현 시 Frontend 범위에서 정리한다.
