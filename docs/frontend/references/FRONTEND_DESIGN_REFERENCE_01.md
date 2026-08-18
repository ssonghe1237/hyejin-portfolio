# FRONTEND_DESIGN_REFERENCE_01

> 시안명: Orange Editorial Developer  
> 적용 대상: 사용자 Portfolio UI 시안 01  
> 목적: `CODEX_FRONTEND_RULES.md`와 `FRONTEND_DESIGN_GUIDE.md`를 기반으로, 시안 01의 실제 Visual Direction과 구현 기준을 정의한다.  
> 우선순위: `RULES > GUIDE > REFERENCE`

---

# 00. Document Role

이 문서는 시안 01의 실제 디자인 방향을 정의한다.

본 문서는 공통 규칙을 다시 정의하는 문서가 아니다.

```text
CODEX_FRONTEND_RULES.md
→ 수정 가능 범위 / 기능 보호 / 작업 절차

FRONTEND_DESIGN_GUIDE.md
→ 공통 UX/UI 품질 기준

FRONTEND_DESIGN_REFERENCE_01.md
→ 시안 01의 실제 Visual Direction
```

충돌이 발생하면 다음 순서를 따른다.

```text
RULES
>
GUIDE
>
REFERENCE MUST
>
REFERENCE SHOULD
>
REFERENCE FLEX
```

---

# 01. Concept

## [MUST] CONCEPT-01

시안 01의 Concept은 다음을 기준으로 한다.

```text
Orange Editorial Developer
```

## [MUST] CONCEPT-02

전체 Visual Identity는 다음 세 축을 사용한다.

```text
White
Near Black
Orange Accent
```

## [MUST] CONCEPT-03

디자인 핵심은 다음과 같다.

```text
Bold Typography
Large Whitespace
Editorial Layout
Project Storytelling
Minimal Surface
Clear Information Hierarchy
```

## [MUST] CONCEPT-04

Reference Site를 그대로 복제하지 않는다.

현재 Portfolio의 기능, Route, 콘텐츠 구조, 데이터 구조를 우선한다.

## [MUST NOT] CONCEPT-X01

당근 서비스 UI를 그대로 복제하지 않는다.

## [MUST NOT] CONCEPT-X02

한봄 Agency의 기능 구조를 복제하지 않는다.

## [MUST NOT] CONCEPT-X03

소이정의 문의 Form 기능을 추가하지 않는다.

## [MUST NOT] CONCEPT-X04

Reference에 존재한다는 이유로 현재 Portfolio에 없는 기능을 추가하지 않는다.

---

# 02. Reference Sources

## 당근

https://about.daangn.com/

### 참고할 요소

```text
Orange Accent
현대적이고 친근한 Typography 분위기
명확한 큰 메시지
높은 가독성
```

### 참고하지 않을 요소

```text
서비스 앱 UI 자체
과도한 Rounded UI
Character / Brand Asset
모든 영역의 Orange 사용
```

---

## 한봄

https://hanbom.com/

https://hanbom.com/detail?idx=115

### 참고할 요소

```text
Editorial Layout
Large Typography
Works 중심 정보 구조
Project Storytelling
큰 Visual과 Text의 교차
Section Rhythm
```

### 참고하지 않을 요소

```text
Agency 서비스 구조
과도한 Image 중심 구성
현재 Portfolio 데이터와 맞지 않는 별도 Project Field
```

---

## 소이정

https://www.soijeong.com/project-inquiry

### 참고할 요소

```text
Large Intro Typography
Numbered Section
Strong Section Rhythm
Editorial Information Grouping
```

### 참고하지 않을 요소

```text
문의 Form 기능
Purple Color
Brand Character
현재 Portfolio에 없는 Form / Inquiry 기능
```

---

# 03. Rule Level

본 문서의 모든 디자인 규칙은 다음 네 단계로 구분한다.

## MUST

시안 01의 정체성 또는 구조를 만드는 필수 규칙.

Codex가 임의 변경하지 않는다.

## SHOULD

기본적으로 적용한다.

실제 콘텐츠, 접근성, 반응형 구조 때문에 예외가 필요할 경우 이유를 명확히 설명한다.

## MUST NOT

시안 01에서 금지한다.

## FLEX

GUIDE와 MUST 규칙을 지키는 범위 안에서 구현자가 화면 검증을 통해 조정할 수 있다.

---

# 04. Visual Identity

## [MUST]

```text
Background
White

Primary Text
Near Black

Accent
Orange

Visual Style
Editorial
Minimal
Project-centric
Bold Typography
Large Whitespace
```

## [MUST NOT]

```text
Gradient 남용
Glassmorphism
Heavy Shadow
Random Accent Color
과도한 Rounded Card
과도한 Decoration
```

---

# 05. Color

## [MUST] COLOR-01

기본 Background는 White 계열을 사용한다.

## [MUST] COLOR-02

Primary Text는 Near Black을 사용한다.

## [MUST] COLOR-03

시안 01의 핵심 Accent는 Orange 하나만 사용한다.

## [MUST] COLOR-04

공통 Color는 Semantic Token으로 관리한다.

## [MUST] COLOR-05

Text Contrast는 `FRONTEND_DESIGN_GUIDE.md`의 접근성 기준을 충족한다.

---

## [SHOULD] 기본 Token 후보

```css
--color-background: #ffffff;

--color-text-primary: #151515;
--color-text-secondary: #4b4b4b;
--color-text-muted: #767676;

--color-surface-muted: #f7f7f5;
--color-surface-accent: #fff3eb;

--color-border: #e9e9e9;
--color-border-strong: #d8d8d8;

--color-accent: #ff6f0f;
--color-accent-hover: #e85f00;

--color-black: #151515;
--color-white: #ffffff;
```

`#FF6F0F`는 시안 01의 Orange 후보값이며 특정 브랜드의 공식 색상값으로 문서화하지 않는다.

---

## [SHOULD] Orange 사용 영역

```text
Eyebrow 일부
Active Navigation
Primary CTA
Arrow
Section Number
Selected State
Focus
Project Highlight
MY ROLE 등 핵심 강조
```

Orange가 없는 Section도 허용한다.

---

## [MUST NOT]

```text
모든 Heading Orange
모든 Border Orange
모든 Card Orange
긴 Body Text Orange
페이지별 새로운 Accent Color
Gradient를 핵심 디자인 언어로 사용
```

---

# 06. Typography

## [MUST] TYPE-01

Primary Font는 `Pretendard Variable`을 기본 구현 후보로 한다.

Fallback:

```text
Pretendard
-apple-system
BlinkMacSystemFont
system-ui
sans-serif
```

## [MUST] TYPE-02

기본 Typography Scale은 `Major Third 1.250`을 사용한다.

## [MUST] TYPE-03

Display Typography와 Body Typography 역할을 구분한다.

## [MUST] TYPE-04

동일한 Semantic Role은 Page가 달라도 동일한 Typography 체계를 사용한다.

## [MUST] TYPE-05

Desktop Font Size를 Mobile에 그대로 유지하지 않는다.

---

## [SHOULD] Font Weight

```text
400
Body

500
Supporting / Navigation

600
Button / Small Heading

700
Section Heading

800
Hero / Display
```

900은 기본값으로 사용하지 않는다.

---

## [SHOULD] Desktop Scale

```text
Hero Display
64px ~ 112px

Page Title
48px ~ 80px

Section Title
36px ~ 56px

H3
28px ~ 32px

Body Large
20px

Body
16px

Small
14px

Caption
12px ~ 13px

Eyebrow
13px
Weight 700
Letter-spacing 약 0.08em
```

---

## [SHOULD] Mobile Scale

```text
Hero Display
44px ~ 64px

Page Title
40px ~ 52px

Section Title
32px ~ 40px

H3
24px ~ 28px

Body Large
18px

Body
16px

Small
14px

Caption
12px
```

---

## [FLEX]

다음은 콘텐츠 길이와 줄바꿈에 따라 `clamp()` 값을 조정할 수 있다.

```text
Hero Display
Page Title
Section Heading
Text Max-width
Line Break
```

단 다음 관계를 깨뜨리지 않는다.

```text
Hero
>
Section
>
Content
```

---

## [MUST NOT]

```text
Page마다 별도 Typography Scale 생성
Hero마다 다른 Font Family 사용
Body Text 과도한 축소
읽기 어려운 Metadata
Font Weight만으로 모든 위계 표현
```

---

# 07. Container

## [MUST] LAYOUT-01

Container는 세 역할로 구분한다.

```text
Wide
Standard
Reading
```

## [MUST] LAYOUT-02

기본 관계는 다음과 같다.

```text
Wide > Standard > Reading
```

## [MUST] LAYOUT-03

MainLayout 내부에서 Page가 다시 전체 Page Container를 만들지 않는다.

## [MUST] LAYOUT-04

장문 콘텐츠는 Reading Container 사용을 우선 검토한다.

## [MUST] LAYOUT-05

Image / Grid와 Reading Text가 반드시 같은 Width를 사용할 필요는 없다.

---

## [SHOULD] 초기값

```text
Wide
1440px

Standard
1200px

Reading
760px
```

실제 Browser 검증 후 소폭 조정 가능하다.

---

## [FLEX]

다음 범위는 실제 콘텐츠 검증 후 조정할 수 있다.

```text
Wide max-width
Standard max-width
Reading max-width
Section별 Text max-width
```

단 Container 역할 자체는 유지한다.

---

# 08. Breakpoint

## [MUST] RESP-01

Page마다 `720 / 760 / 768`처럼 유사한 Breakpoint를 새로 만들지 않는다.

## [MUST] RESP-02

공통 Breakpoint 역할을 사용한다.

## [MUST] RESP-03

Mobile은 Desktop의 단순 축소판으로 만들지 않는다.

---

## [SHOULD]

```text
Mobile
< 768px

Tablet
768px ~ 1023px

Desktop
1024px ~ 1439px

Wide
1440px+
```

---

## [FLEX]

특정 Component가 실제로 무너지는 명확한 이유가 있는 경우 예외 Breakpoint를 추가할 수 있다.

추가 시 다음을 작업 보고에 명시한다.

```text
추가 Breakpoint
추가 이유
적용 Component
```

---

# 09. Spacing

## [MUST] SPACE-01

8px Grid를 기본 Rhythm으로 사용한다.

## [MUST] SPACE-02

4px은 Micro Adjustment에 사용한다.

## [MUST] SPACE-03

다음 관계를 유지한다.

```text
Section
>
Organism
>
Molecule
>
Atomic
```

## [MUST] SPACE-04

같은 관계에는 같은 간격을 사용한다.

---

## [SHOULD]

```text
Atomic
4px ~ 8px

Molecule
12px ~ 16px

Organism
24px ~ 32px

Section
56px ~ 96px
```

Responsive Section Gap:

```text
Desktop
96px

Tablet
72px

Mobile
56px
```

Hero 등 특별한 Section은 120px ~ 144px까지 허용한다.

---

## [MUST NOT]

```text
Page마다 이유 없는 Margin 값 생성
Border / Background만으로 Grouping 해결
Mobile에서 모든 간격 단순 절반 축소
```

---

# 10. Header

## [MUST] Desktop

```text
SONG HYEJIN                       Navigation
```

## [MUST] Mobile

```text
SONG HYEJIN                       MENU
```

Mobile에서는 Full-screen Menu를 사용한다.

Bottom Navigation은 사용하지 않는다.

---

## [SHOULD]

```text
Desktop Header Height
72px

Mobile Header Height
64px

Background
White

Bottom Border
Subtle Neutral
```

Active Navigation:

```text
Black Text
+
Orange Dot 또는 Underline
```

Dot과 Underline을 동시에 사용하지 않는다.

---

## [MUST NOT]

```text
Mobile Bottom Navigation 추가
기존 Mobile Horizontal Scroll Navigation 유지
Route 구조 변경
```

---

# 11. Button / Link

## [MUST] BUTTON-01

Action은 Button을 사용한다.

## [MUST] BUTTON-02

Navigation은 Link를 사용한다.

## [MUST] BUTTON-03

Visual Size와 Touch Target을 분리한다.

## [MUST] BUTTON-04

Primary / Secondary / Tertiary Action을 구분한다.

---

## [SHOULD] Primary

```text
Background
Orange

Text
Near Black

Height
44px Desktop
48px Mobile

Padding
0 20px

Radius
12px

Weight
700
```

---

## [SHOULD] Secondary

```text
Background
Near Black

Text
White
```

---

## [SHOULD] Tertiary

```text
Text Link
+
Orange Arrow
```

Hover:

```text
Arrow translateX 약 4px
```

---

## [MUST NOT]

```text
모든 CTA를 Primary Button으로 사용
작은 Icon을 그대로 Touch Area로 사용
Button과 Link의 Semantic 역할 변경
```

---

# 12. Card / Surface

## [MUST] CARD-01

Card는 독립적인 정보 단위를 표현할 때 사용한다.

## [MUST] CARD-02

Project Detail Section의 기본 Presentation을 Card로 두지 않는다.

## [MUST] CARD-03

Whitespace와 Divider로 해결 가능한 Grouping은 Card 없이 먼저 해결한다.

---

## [SHOULD]

```text
일반 Card Radius
16px 이하

Shadow
없음 또는 매우 약함

Border
필요한 경우에만 사용
```

---

## [MUST NOT]

```text
Border + Radius + Shadow 습관적 동시 사용
Project Detail 모든 Section Box 처리
Nested Card
Everything-is-a-card
```

---

# 13. Image

## [SHOULD]

```text
Home Selected Work
16:9

Work Selected
16:9

More Work
4:3

Project Detail Hero
16:9

Project Section Image
원본 비율 우선

About Portrait
사용 시 4:5 후보
```

## [MUST]

이미지가 없어도 Layout이 무너지지 않아야 한다.

이미지 업로드 데이터 구조는 변경하지 않는다.

---

# 14. Motion

## [MUST] MOTION-01

Motion은 정보 전달과 Interaction Feedback을 위해 사용한다.

## [MUST] MOTION-02

`prefers-reduced-motion`을 고려한다.

---

## [SHOULD]

```text
Transition
160ms ~ 220ms

Arrow
translateX 0 → 4px

Image
scale 1 → 1.02

Card
최대 translateY -2px 수준
```

---

## [MUST NOT]

```text
Scroll Jacking
과도한 Parallax
장시간 자동 Animation
콘텐츠보다 강한 Motion
과도한 Scroll Animation
```

---

# 15. Home

## [MUST]

Home의 정보 흐름은 다음을 기준으로 한다.

```text
Who I am
→ Selected Work Preview
→ Core Competencies
→ Background
→ Contact CTA
```

## [MUST]

Selected Work는 Work Page보다 압축된 정보 밀도를 사용한다.

---

## [SHOULD] Hero

```text
BACKEND DEVELOPER
→ Orange Eyebrow

사용자 화면부터
백엔드와 운영 구조까지
연결하는 웹 개발자

Java · Spring Boot · React ...
```

CTA:

```text
View my work
→ Primary

Get in touch
→ Text Link
```

---

## [SHOULD] Selected Work

```text
01 / SELECTED WORK

Large Visual
Project Number
Title
1~2줄 Summary
Role / Tech 최소 정보
Arrow
```

---

## [MUST NOT]

```text
Work와 동일한 ProjectCard를 그대로 반복
Home에 Project Detail 수준 정보 노출
대표 프로젝트 때문에 Competency / Background가 지나치게 아래로 밀림
```

---

# 16. Work

## [MUST]

다음 세 Group의 중요도 차이를 유지한다.

```text
01 Selected Work
02 Research
03 More Work
```

위계:

```text
Selected Work
>
Research
>
More Work
```

---

## [SHOULD] Selected Work

```text
Large Visual
1 Column
Project Name
Period / Type
Role
Orange Arrow
```

---

## [SHOULD] Research

Editorial List를 우선한다.

예:

```text
2026.08     JPA 연관관계와 영속성 컨텍스트 정리        →
2026.07     Spring Security 인증 흐름                  →
```

Card보다 Border / Whitespace 중심으로 표현한다.

---

## [SHOULD] More Work

```text
Desktop
2 Column

Mobile
1 Column
```

---

## [MUST NOT]

```text
세 Section을 같은 Card Grid로 처리
Research Native Scrollbar를 핵심 디자인 요소로 사용
```

---

# 17. Project Detail

## [MUST] PROJECT-01

기존 Project 데이터 구조를 그대로 사용한다.

## [MUST] PROJECT-02

Section 제목 문자열에 따라 새로운 비즈니스 로직을 만들지 않는다.

## [MUST] PROJECT-03

Section DTO를 디자인 목적으로 변경하지 않는다.

## [MUST] PROJECT-04

전체 Project Detail은 Editorial Case Study 구조를 사용한다.

---

## [SHOULD] 기본 흐름

```text
Project Hero
Project Meta
Hero Visual

Section Number
Section Title
Text
Optional Image

Section Number
Section Title
Text
Optional Image

...

Links
```

---

## [SHOULD] Meta

Desktop:

```text
PERIOD
TYPE
ROLE
TEAM
```

4 Column 후보.

Mobile:

```text
2 Column
```

---

## [SHOULD] Detail Section

```text
Section Number
Section Title

Reading Width Text

Optional Standard / Wide Image
```

Card Background는 기본값으로 사용하지 않는다.

---

## [MUST NOT]

```text
"담당 역할" 문자열을 검사해 특별 Component 생성
"문제 해결" 제목 때문에 API / Type 변경
모든 Section 동일 Rounded Card 처리
이미지 없는 경우 Layout 깨짐
Backend / Mapper / DTO 변경
```

---

# 18. Research

## [MUST] Research List

현재의 좋은 정보 구조를 유지한다.

```text
Meta
Title
Summary
Arrow
```

Card Grid로 변경하지 않는다.

---

## [SHOULD] List Style

```text
Category / Date
Title
Summary
Arrow

Divider
Whitespace
```

Hover는 다음 중 하나를 우선 검토한다.

```text
Subtle Surface Accent
Orange Arrow
Text Emphasis
```

과도하게 모두 사용하지 않는다.

---

## [MUST] Research Detail

Reading Experience가 Visual Decoration보다 우선한다.

---

## [SHOULD]

```text
Reading Container
약 760px

Body
16px ~ 17px

Line Height
약 1.8
```

Code Block:

```text
Near Black Background
Light Text
Radius 약 8px
```

---

# 19. About

## [MUST]

Large Intro + Numbered Section 구조를 사용한다.

예:

```text
ABOUT

문제의 원인을
끝까지 추적하는
백엔드 개발자.

01
Backend Engineering

02
Deployment & Operations

03
How I Work

04
Career
```

번호는 Presentation 요소다.

---

## [MUST NOT]

```text
번호 표시를 위해 DB 데이터 변경
관리자 콘텐츠 Title 앞에 강제로 번호 문자열 저장
고정 3 Column 때문에 데이터 개수와 맞지 않는 빈 Grid 유지
```

필요하면 CSS Counter 또는 Render Index를 사용한다.

---

# 20. Contact

## [MUST]

현재 기능을 그대로 유지한다.

```text
Email
GitHub
LinkedIn Optional
Resume Optional
```

---

## [SHOULD]

Editorial Number System:

```text
01 EMAIL
02 GITHUB
03 LINKEDIN
04 RESUME
```

데이터가 없는 Optional 항목은 현재 조건부 렌더링을 유지한다.

---

## [MUST NOT]

```text
Inquiry Form 추가
Contact DB 추가
Email Sending 기능 추가
없는 LinkedIn / Resume 강제 노출
Reference Form 기능 복제
```

---

# 21. Footer

## [SHOULD]

Footer는 단순하게 구성한다.

Desktop:

```text
SONG HYEJIN

Backend Developer                    GitHub
© 2026                               Email
```

Mobile:

```text
Vertical Stack
```

## [MUST NOT]

Footer를 별도의 거대한 Graphic Section으로 만들지 않는다.

---

# 22. Responsive

## [MUST]

Responsive는 각 Page 작업 시 Desktop과 함께 구현한다.

Desktop 완료 후 Mobile을 별도 후처리하지 않는다.

## [MUST]

다음을 Responsive에서 다시 검토한다.

```text
Typography
Grid
Image Ratio
Section Gap
Navigation
CTA
Touch Target
Reading Width
Card Density
```

## [MUST]

Carousel Dot, Arrow, Icon Button 등 작은 Visual Control은 실제 Hit Area를 충분히 확보한다.

예:

```text
Visual Dot
8px ~ 10px

Actual Interactive Area
44px 수준 이상 검토
```

---

# 23. Accessibility

## [MUST]

`FRONTEND_DESIGN_GUIDE.md`의 접근성 기준을 유지한다.

확인 항목:

```text
Text Contrast
Keyboard Navigation
Focus-visible
Semantic HTML
alt
label
aria
Touch Target
Link 인지 가능성
prefers-reduced-motion
```

## [MUST]

Focus는 단순 Color 변화만으로 약하게 처리하지 않는다.

---

# 24. Implementation Boundaries

본 시안은 `CODEX_FRONTEND_RULES.md`를 그대로 따른다.

## [MUST]

```text
backend/** 수정 금지

frontend/src/api/** 수정 금지

frontend/src/mappers/** 수정 금지

frontend/src/types/** 수정 금지

기존 Route 변경 금지

기존 API Contract 변경 금지

기존 기능 동작 변경 금지

기존 한국어 문자열 / 주석 UTF-8 유지

각 작업 단위 완료 후 npm run build 수행
```

## [MUST]

디자인 구현은 Frontend Layout / CSS / Presentation 계층에서 해결한다.

---

# 25. FLEX 범위

다음은 실제 Browser 검증을 통해 조정할 수 있다.

```text
Hero 실제 clamp 값
Section별 Whitespace
Image Crop Position
일부 Grid Gap
Hover Transition 세부값
Text Max-width
Line Break
Card 내부 Padding
Mobile Section Stack 순서
Container 실제 max-width의 소폭 조정
```

단 FLEX 값은 MUST 또는 GUIDE를 깨뜨릴 수 없다.

허용 예:

```text
Hero 96px → 88px
```

금지 예:

```text
Hero를 Section Title보다 작게 변경
```

---

# 26. Codex Decision Order

구현 중 판단이 애매한 경우 다음 순서를 따른다.

```text
01. CODEX_FRONTEND_RULES.md 확인

02. FRONTEND_DESIGN_GUIDE.md 확인

03. FRONTEND_DESIGN_REFERENCE_01.md의 MUST 확인

04. MUST NOT 확인

05. SHOULD 적용

06. 필요한 경우 FLEX 범위에서 조정
```

충돌 우선순위:

```text
RULES
>
GUIDE
>
REFERENCE MUST
>
REFERENCE SHOULD
>
REFERENCE FLEX
```

---

# 27. Implementation Order

시안 01 구현 순서는 다음을 기본으로 한다.

```text
01 Global Token
   Font
   Color
   Container
   Breakpoint
   Spacing

02 Header / Footer

03 Global Typography
   Eyebrow
   Page Hero
   Section Heading
   Body

04 Button / Text Link

05 Home

06 Work

07 Project Detail

08 Research List

09 Research Detail

10 About

11 Contact

12 Responsive 전체 회귀 검증
```

각 단계가 끝날 때마다 `npm run build`를 수행한다.

Build 실패 상태에서 다음 단계로 넘어가지 않는다.

---

# 28. Verification Checklist

```text
[ ] White / Near Black / Orange 구조가 유지되는가
[ ] Orange가 Accent로만 사용되는가
[ ] Hero > Section > Content 위계가 명확한가
[ ] Pretendard 기반 Typography 체계가 일관적인가
[ ] Page마다 임의 Font Scale을 만들지 않았는가
[ ] Wide / Standard / Reading Container 역할이 구분되는가
[ ] Nested Page Container가 없는가
[ ] 공통 Breakpoint 체계를 우선 사용했는가
[ ] 8px Grid Rhythm이 유지되는가
[ ] Header Desktop / Mobile 구조가 시안 규칙과 맞는가
[ ] Mobile Full-screen Menu가 정상 동작하는가
[ ] Bottom Navigation을 추가하지 않았는가
[ ] Primary / Secondary / Tertiary Action이 구분되는가
[ ] 작은 Icon / Dot의 실제 Hit Area가 충분한가
[ ] Everything-is-a-card가 발생하지 않았는가
[ ] Home Project 정보가 Work보다 압축되어 있는가
[ ] Work의 Selected / Research / More Work 위계가 구분되는가
[ ] Project Detail이 Editorial Case Study 형태인가
[ ] Project Section 제목 기반 비즈니스 로직을 만들지 않았는가
[ ] Research List의 비-Card 구조가 유지되는가
[ ] Research Detail Reading Width가 적절한가
[ ] About 번호가 Presentation으로 처리되는가
[ ] Contact Form이 추가되지 않았는가
[ ] Optional Contact 데이터가 조건부 렌더링되는가
[ ] Hardcoded Component Color가 불필요하게 증가하지 않았는가
[ ] Loading / Empty / Error UI가 일관되는가
[ ] Mobile에서 Desktop 고정 크기를 그대로 사용하지 않았는가
[ ] 320px 폭에서도 Horizontal Overflow가 없는가
[ ] Keyboard Focus를 확인할 수 있는가
[ ] prefers-reduced-motion을 고려했는가
[ ] Backend / API / Mapper / Type이 변경되지 않았는가
[ ] 기존 한국어 문자열과 주석이 유지되는가
[ ] npm run build가 성공하는가
```

---

# 29. Final Reference Summary

```text
Concept
Orange Editorial Developer

Reference
당근 → Color / Typography Mood
한봄 → Work / Project Storytelling
소이정 → Large Type / Numbered Section

Primary Font
Pretendard Variable

Base Type Scale
Major Third 1.250

Color
White
Near Black
Orange Accent

Accent Candidate
#FF6F0F

Container
Wide 1440px
Standard 1200px
Reading 760px
※ 실제 검증 후 소폭 조정 가능

Breakpoint
768 / 1024 / 1440 기준

Spacing
8px Grid
4px Micro Adjustment

Header
Desktop 72px
Mobile 64px + Full-screen Menu

Button
44px Desktop
48px Mobile

Card
Minimal
Border 중심
Shadow 최소
Everything-is-a-card 금지

Project Detail
Flat Editorial Case Study

Research
Editorial List + Reading-focused Detail

About
Large Intro + Numbered Section

Contact
Editorial Contact List
Form 없음

Motion
Subtle Only

Bottom Navigation
사용하지 않음
```
