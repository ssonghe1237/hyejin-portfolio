# Codex Frontend 작업 규칙

## 01. 문서 목적

이 문서는 포트폴리오 프로젝트의 Frontend UI 개선 작업에서  
Codex가 반드시 따라야 하는 공통 작업 규칙을 정의한다.

본 문서는 디자인 시안과 관계없이 모든 Frontend 디자인 브랜치에서 동일하게 적용한다.

Frontend 디자인 작업의 목적은 기존에 구현 및 검증된 기능을 유지하면서  
사용자 화면과 관리자 화면의 UI/UX를 개선하는 것이다.

본 프로젝트의 Frontend 디자인 문서는 다음 세 가지 역할로 분리한다.

> **RULES:** 무엇을 수정할 수 있고, 무엇을 수정하면 안 되는가.  
> **GUIDE:** 어떤 품질과 일관성을 지켜야 하는가.  
> **REFERENCE:** 이번 시안은 어떤 모습과 방향을 참고하는가.

---

# 02. Frontend 디자인 문서 체계

Frontend UI 디자인 작업은 다음 3종의 문서를 기준으로 수행한다.

```text
docs/
└── frontend/
    │
    ├── CODEX_FRONTEND_RULES.md
    │   └── 개발 작업 절대 규칙
    │
    ├── FRONTEND_DESIGN_GUIDE.md
    │   └── 포트폴리오 전체 공통 디자인 / UX 원칙
    │
    └── references/
        ├── FRONTEND_DESIGN_REFERENCE_01.md
        ├── FRONTEND_DESIGN_REFERENCE_02.md
        └── ...
```

## 2.1 RULES

파일:

```text
docs/frontend/CODEX_FRONTEND_RULES.md
```

역할:

> 무엇을 수정할 수 있고 무엇을 수정하면 안 되는가.

본 문서는 Frontend 작업의 최상위 규칙이다.

주요 역할:

- Frontend 수정 가능 범위 정의
- Backend 수정 금지
- API / Mapper / Type 보호
- UTF-8 및 한글 보존
- 기존 기능 보존
- Codex 작업 방식 정의
- Build 및 검증 기준 정의

모든 디자인 브랜치에서 동일하게 적용한다.

---

## 2.2 GUIDE

파일:

```text
docs/frontend/FRONTEND_DESIGN_GUIDE.md
```

역할:

> 어떤 품질과 일관성을 지켜야 하는가.

포트폴리오 전체에 공통으로 적용되는 UI / UX 원칙과  
기본 디자인 시스템 및 통합 가이드를 정의한다.

주요 역할:

- Layout 원칙
- Typography 체계
- Color 사용 원칙
- Spacing 체계
- Component 공통 규칙
- Responsive 원칙
- 접근성
- Interaction
- 사용자 페이지 정보 구조
- 사용자 UI / 관리자 UI 공통 품질 기준

모든 디자인 브랜치에서 동일하게 적용한다.

---

## 2.3 REFERENCE

파일 위치:

```text
docs/frontend/references/
```

파일 예시:

```text
FRONTEND_DESIGN_REFERENCE_01.md
FRONTEND_DESIGN_REFERENCE_02.md
FRONTEND_DESIGN_REFERENCE_03.md
```

역할:

> 이번 시안은 어떤 디자인을 참고할 것인가.

Reference 문서는 디자인 시안마다 별도로 작성한다.

주요 역할:

- Design Concept
- Visual Direction
- Reference Site
- 참고할 UI 요소
- 참고하지 않을 요소
- Layout 참고 방향
- Typography 참고 방향
- Color 참고 방향
- Interaction 참고 방향
- 페이지별 시안 구현 방향

Reference는 디자인을 그대로 복제하기 위한 문서가 아니다.

Reference Site에서 필요한 디자인 원칙과 표현 방식을 분석하여  
현재 포트폴리오의 기능과 정보 구조에 맞게 재해석하기 위한 기준으로 사용한다.

---

# 03. 디자인 문서 우선순위

Frontend 작업 중 문서 간 내용이 충돌할 경우 다음 우선순위를 따른다.

```text
1. CODEX_FRONTEND_RULES.md
2. FRONTEND_DESIGN_GUIDE.md
3. FRONTEND_DESIGN_REFERENCE_XX.md
```

즉 다음 우선순위를 절대 기준으로 사용한다.

```text
RULES > GUIDE > REFERENCE
```

REFERENCE의 구현 방향이 RULES 또는 GUIDE를 위반할 경우  
REFERENCE를 우선하지 않는다.

예를 들어 Reference 구현을 위해 API, Mapper 또는 Backend를 변경하는 것이 편하더라도  
RULES에서 금지하고 있다면 변경하지 않는다.

Codex가 문서 간 충돌을 발견한 경우 임의로 판단하여 규칙을 변경하지 않고  
충돌 위치와 내용을 사용자에게 보고한다.

---

# 04. 디자인 시안 브랜치 운영

Frontend 디자인 시안은 동일한 기능 상태를 기준으로 별도 브랜치에서 구현한다.

목적은 IntelliJ / VS Code에서 브랜치를 변경하면서  
동일한 기능에 서로 다른 디자인을 직접 비교하기 위함이다.

디자인 브랜치는 서로의 디자인 결과를 기반으로 생성하지 않는다.

잘못된 구조:

```text
현재 동일점
    ↓
디자인 시안 1
    ↓
디자인 시안 2
```

권장 구조:

```text
                 ┌── 디자인 시안 1
현재 동일점 ─────┤
                 └── 디자인 시안 2
```

각 디자인 브랜치는 반드시 동일한 기준 브랜치 또는 동일한 기준 Commit에서 생성한다.

## 4.1 Branch / Reference 1:1 대응

디자인 브랜치와 Reference 문서는 1:1로 대응하여 관리한다.

| 디자인 시안 | Branch | Reference |
|---|---|---|
| 시안 01 | `topic/user-ui-concept-01` | `FRONTEND_DESIGN_REFERENCE_01.md` |
| 시안 02 | `topic/user-ui-concept-02` | `FRONTEND_DESIGN_REFERENCE_02.md` |
| 시안 03 | `topic/user-ui-concept-03` | `FRONTEND_DESIGN_REFERENCE_03.md` |

예:

```text
topic/user-ui-concept-01
→ docs/frontend/references/FRONTEND_DESIGN_REFERENCE_01.md
```

```text
topic/user-ui-concept-02
→ docs/frontend/references/FRONTEND_DESIGN_REFERENCE_02.md
```

각 디자인 브랜치는 자신에게 대응하는 Reference 문서를 기준으로 작업한다.

시안 선택 전에는 여러 디자인 브랜치를 동시에 기준 브랜치에 Merge하지 않는다.

최종 디자인을 선택한 후  
선택된 디자인 브랜치만 PR 및 Merge 대상으로 사용한다.

---

# 05. Codex 디자인 작업 시작 순서

Codex는 디자인 작업을 시작하기 전에 반드시 다음 순서를 따른다.

```text
01. CODEX_FRONTEND_RULES.md 확인
        ↓
02. FRONTEND_DESIGN_GUIDE.md 확인
        ↓
03. 현재 브랜치와 대응하는 FRONTEND_DESIGN_REFERENCE_XX.md 확인
        ↓
04. 현재 Frontend 코드 구조 분석
        ↓
05. 수정 대상 / 작업 계획 보고
        ↓
06. 사용자 승인
        ↓
07. UI 구현
        ↓
08. npm run build
        ↓
09. 변경 결과 보고
```

세 문서를 읽지 않은 상태에서 UI 코드를 바로 수정하지 않는다.

현재 브랜치와 대응하는 Reference 문서가 불명확하거나 존재하지 않는 경우  
임의로 다른 Reference 문서를 선택하지 않고 사용자에게 먼저 확인한다.

---

# 06. 최우선 개발 원칙

## 6.1 Backend 수정 절대 금지

다음 디렉터리의 모든 파일은 수정하지 않는다.

```text
backend/**
```

다음을 포함한 Backend 요소는 어떠한 이유로도 변경하지 않는다.

- Controller
- Service
- Repository
- Entity
- DTO
- Configuration
- API Endpoint
- Validation
- Database 관련 코드
- 업로드 및 파일 처리 로직
- application.yml
- application-local.yml

Frontend UI 구현 과정에서 Backend 구조가 불편하더라도 임의로 수정하지 않는다.

Backend 변경이 필요하다고 판단되는 경우 코드를 수정하지 말고  
필요한 이유와 변경 제안만 사용자에게 보고한다.

---

# 07. Frontend 수정 범위

## 7.1 수정 가능

UI/UX 디자인 및 화면 구조 개선을 위해 다음 영역을 수정할 수 있다.

```text
frontend/src/components/**
frontend/src/pages/**
frontend/src/styles/**
frontend/src/assets/**
frontend/**/*.module.css
```

`frontend/src/assets/**`는 현재 디렉터리가 존재하지 않더라도  
디자인 작업에 필요한 이미지, 아이콘, 정적 리소스를 관리하기 위해 신규 생성할 수 있다.

단, 디자인 작업은 기존 기능 로직을 유지하는 범위에서 수행한다.

---

## 7.2 제한적 수정

다음 파일은 UI 구조상 수정이 필요할 수 있으나 자유롭게 변경하지 않는다.

```text
frontend/src/App.tsx
frontend/src/main.tsx
```

### App.tsx

다음 목적으로만 수정할 수 있다.

- 공통 Layout 적용
- 공통 UI 구조 연결
- 기존 페이지 Component 배치 변경

다음은 금지한다.

- 기존 Route path 변경
- 기존 Route 삭제
- 기존 Route의 목적 변경
- 신규 기능 개발 목적의 Route 변경
- 기존 페이지 연결 구조의 기능적 변경

### main.tsx

일반적인 페이지 디자인 작업에서는 수정하지 않는다.

전역 Style 또는 사용자 승인된 UI Library / CSS Framework를 연결하기 위해  
반드시 필요한 경우에만 사용자 승인 후 수정한다.

---

## 7.3 원칙적 수정 금지

다음 영역은 Backend API Contract 또는 데이터 변환 로직과 직접 연결되어 있으므로  
디자인 작업을 이유로 임의 수정하지 않는다.

```text
frontend/src/api/**
frontend/src/mappers/**
frontend/src/types/**
```

### api

다음을 변경하지 않는다.

- API Endpoint
- HTTP Method
- Request 구조
- Response 처리
- Fetch 로직
- Error 처리 방식의 임의 리팩터링

### types

다음을 변경하지 않는다.

- Request Type
- Response Type
- 기존 Interface
- Backend Contract와 연결된 Type

### mappers

Backend 응답 데이터를 Frontend 표현 데이터로 변환하는 기존 Mapper 로직을 변경하지 않는다.

UI에서 데이터를 사용하기 불편하더라도  
디자인 작업을 이유로 Mapper를 임의 수정하지 않는다.

해당 영역의 수정이 반드시 필요하다고 판단되는 경우  
코드를 수정하지 말고 사용자에게 먼저 다음 내용을 보고한다.

1. 수정이 필요한 파일
2. 수정이 필요한 이유
3. UI 작업에 미치는 영향
4. 기존 기능에 미칠 수 있는 영향
5. 제안하는 최소 수정 범위

사용자의 명시적 승인 후에만 수정할 수 있다.

---

## 7.4 Frontend 환경 설정 파일

다음 파일은 원칙적으로 수정하지 않는다.

```text
frontend/package.json
frontend/package-lock.json
frontend/vite.config.ts
frontend/tsconfig.json
frontend/tsconfig.app.json
frontend/tsconfig.node.json
frontend/eslint.config.js
frontend/index.html
```

Dependency 추가, Build 설정 변경 또는 UI Library / CSS Framework 설치가 필요한 경우  
먼저 사용자에게 변경 이유와 영향을 보고하고 승인을 받은 후 수정한다.

---

## 7.5 자동 생성 및 외부 Dependency 영역

다음 디렉터리는 직접 수정하지 않는다.

```text
frontend/node_modules/**
frontend/dist/**
```

`node_modules`는 Package Manager가 관리한다.

`dist`는 Build 결과물이므로 Source Code처럼 직접 수정하지 않는다.

---

# 08. 기존 기능 보존

Frontend 디자인 작업은 기능 개발 작업이 아니다.

따라서 이미 정상 동작하는 기능을 변경하지 않는다.

다음을 반드시 유지한다.

- 기존 사용자 Route
- 기존 관리자 Route
- API 호출
- CRUD 동작
- 공개 / 비공개 처리
- 이미지 업로드 및 삭제
- PDF 업로드 및 삭제
- Tiptap Editor 동작
- 외부 링크
- 페이지 이동
- 조건부 렌더링
- Loading / Error 처리

UI 작업 중 기존 기능상의 문제를 발견하더라도 임의 수정하지 않는다.

문제를 발견한 경우 다음 내용을 사용자에게 보고한다.

1. 문제 위치
2. 재현 방법
3. 예상 원인
4. UI 작업과의 관련 여부

---

# 09. UTF-8 및 한글 보존 규칙

## 9.1 모든 파일은 UTF-8을 유지한다

Frontend 작업 중 모든 소스 파일과 문서는 UTF-8 인코딩을 유지한다.

다음 인코딩으로 변환하지 않는다.

- CP949
- EUC-KR
- ANSI
- 기타 비 UTF-8 인코딩

---

## 9.2 한글 절대 보존

기존 파일에 작성되어 있는 모든 한글을 임의 변경하거나 삭제하지 않는다.

보존 대상에는 다음이 포함된다.

- JavaScript / TypeScript 주석
- TSX 주석
- CSS 주석
- 파일 Header 주석
- 사용자 화면 한글 문구
- 관리자 화면 한글 문구
- 개발자 설명 주석
- Markdown 문서
- 코드 내부 설명 문자열

UI 디자인 수정과 직접적인 관련이 없는 한글 문구는 수정하지 않는다.

---

## 9.3 한글 주석의 영어 자동 변환 금지

기존 한글 주석을 임의로 영어로 번역하지 않는다.

```text
사용자 프로젝트 목록
↓
User project list
```

기존 프로젝트의 한글 주석 스타일을 유지한다.

---

## 9.4 한글 깨짐 발생 시 작업 중지

파일에서 다음과 같은 인코딩 깨짐이 발견될 경우:

```text
ì‚¬ìš©ìž
占쏙옙占쏙옙
���
```

해당 파일을 임의 저장하거나 대량 수정하지 않는다.

먼저 사용자에게 파일명과 깨진 위치를 보고한다.

---

## 9.5 불필요한 파일 전체 재저장 금지

한두 줄을 수정하기 위해 다음을 발생시키지 않는다.

- 파일 전체 인코딩 변경
- 파일 전체 줄바꿈 변경
- 불필요한 공백 전체 변경
- Formatter에 의한 전체 파일 재작성
- 관련 없는 주석 재정렬

Git Diff에는 실제 작업에 필요한 변경만 남겨야 한다.

---

# 10. 코드 및 주석 작성 규칙

기존 파일의 Header 주석은 삭제하지 않는다.

기존 Header에 Modification History가 있는 경우  
필요할 때 해당 형식을 유지하여 수정 이력을 추가한다.

신규 파일 작성 시 Author는 다음으로 통일한다.

```text
author : Song
```

기존 코드의 주석 스타일과 섹션 구분 방식을 최대한 유지한다.

기능상 의미가 있는 기존 주석은 삭제하지 않는다.

UI 변경 때문에 코드 위치가 이동하더라도  
관련 주석 역시 함께 유지한다.

---

# 11. UI 작업 단위

한 번에 전체 사이트를 수정하지 않는다.

작업 단위는 다음 중 하나로 제한한다.

- 공통 Component 1개
- 공통 Layout 1개
- 사용자 Page 1개
- 관리자 Page 1개
- 명확한 하나의 UI 영역

한 작업이 끝난 후 다음 작업으로 넘어간다.

---

# 12. 디자인 기준

UI를 임의로 디자인하지 않는다.

공통 디자인 및 UX 판단은 다음 문서를 기준으로 한다.

```text
docs/frontend/FRONTEND_DESIGN_GUIDE.md
```

현재 시안의 구체적인 Visual Direction은  
현재 브랜치와 대응하는 Reference 문서를 기준으로 한다.

예:

```text
docs/frontend/references/FRONTEND_DESIGN_REFERENCE_01.md
```

Reference 문서에 정의되지 않은 세부 디자인 판단이 필요한 경우  
GUIDE의 공통 원칙을 우선하여 가장 일관된 방향을 선택한다.

중요한 디자인 방향을 새로 결정해야 할 경우 사용자에게 먼저 보고한다.

---

# 13. 공통 Component 우선 원칙

동일한 UI가 반복되는 경우 페이지마다 각각 구현하지 않는다.

다음과 같은 요소가 반복될 경우 공통 Component 또는 공통 Style 사용을 우선 검토한다.

- Button
- Link
- Section Header
- Card
- Tag
- Badge
- Page Container
- Empty State
- Loading State
- Form Field
- Admin Panel

단, 단 한 번만 사용하는 UI를 과도하게 Component화하지 않는다.

---

# 14. CSS 및 UI Library 규칙

## 14.1 기본 스타일링 방식

현재 프로젝트의 기본 Frontend 디자인 시스템은 다음을 기준으로 한다.

```text
React
+
CSS Module
```

기존 CSS Module 방식을 유지한다.

디자인 시안마다 임의로 새로운 Styling 방식을 도입하지 않는다.

---

## 14.2 UI Library 및 CSS Framework

다음과 같은 UI Library 또는 CSS Framework를 Codex가 임의로 설치하거나 적용하지 않는다.

- Bootstrap
- Tailwind CSS
- Material UI
- Chakra UI
- styled-components
- Emotion
- 기타 UI Framework

단, 특정 디자인 시안 또는 관리자 UI에서  
`FRONTEND_DESIGN_GUIDE.md` 또는 대응하는 Reference 문서에 사용이 명시되어 있고  
사용자가 사전에 승인한 경우에 한해 도입할 수 있다.

UI Library 또는 CSS Framework 도입이 승인된 경우에도 다음 원칙을 유지한다.

- Backend를 수정하지 않는다.
- API Contract를 변경하지 않는다.
- 기존 기능 로직을 변경하지 않는다.
- 기존 Route를 변경하지 않는다.
- 필요한 Dependency만 최소 범위로 추가한다.
- 기존 CSS Module과의 역할을 명확히 구분한다.
- 기존 화면 전체를 이유 없이 Framework 방식으로 재작성하지 않는다.

사용자 포트폴리오 화면은 기본적으로 Custom CSS Module Design System을 우선한다.

관리자 UI는 운영 효율, Form, Table, 상태 표현 및 Responsive 구현을 위해  
Bootstrap 등 UI Library / CSS Framework 도입을 별도 검토할 수 있다.

---

# 15. Responsive 규칙

Desktop UI만 구현한 뒤 작업을 종료하지 않는다.

각 사용자 페이지는 기본 디자인 작업 후  
해당 페이지의 Responsive 동작까지 함께 확인한다.

반응형 기준은 `FRONTEND_DESIGN_GUIDE.md`를 따른다.

다음 항목을 확인한다.

- Layout
- Grid
- Typography
- Navigation
- Image
- Card
- Button
- Long URL
- Long Text
- Touch 영역
- Horizontal Overflow

---

# 16. 접근성 기본 규칙

기존 접근성을 저하시키지 않는다.

다음을 유지하거나 개선한다.

- semantic HTML
- button / a 요소의 올바른 사용
- label과 input 연결
- alt
- aria-label
- aria-labelledby
- keyboard 접근
- focus 상태
- 충분한 클릭 영역

단순 클릭 동작을 위해 `div`를 버튼처럼 사용하지 않는다.

---

# 17. 작업 후 검증

각 작업 완료 후 반드시 다음을 실행한다.

```bash
npm run build
```

Build가 실패한 상태에서는 다음 UI 작업으로 넘어가지 않는다.

가능하면 수정한 페이지를 직접 브라우저에서 확인한다.

---

# 18. 작업 완료 보고

작업 완료 후 다음 내용을 사용자에게 보고한다.

- 수정한 파일
- 신규 생성한 파일
- 주요 UI 변경 사항
- 기능 로직 변경 여부
- Build 결과
- 추가 확인이 필요한 사항

기능 로직을 변경하지 않았다면 명확히 다음과 같이 보고한다.

```text
Backend 변경 없음
API Contract 변경 없음
기존 기능 로직 변경 없음
```

---

# 19. 금지 사항

다음을 하지 않는다.

- Backend 수정
- DB 수정
- API 변경
- Mapper 임의 수정
- Type 임의 수정
- 기존 기능 임의 리팩터링
- Route 변경
- 정상 동작 중인 기능 삭제
- 사용자 승인 없는 Dependency 설치
- 사용자 승인 없는 UI Library / CSS Framework 설치
- GUIDE와 충돌하는 임의 디자인
- 현재 브랜치와 무관한 Reference 적용
- 다른 디자인 시안 브랜치 결과를 무단 반영
- 대규모 자동 Formatter 적용
- UTF-8 인코딩 변경
- 한글 주석 삭제
- 한글 주석 영어 번역
- 작업 범위 밖 파일 수정
- node_modules 직접 수정
- dist 직접 수정

---

# 20. 문제 발생 시 원칙

UI 작업 도중 기능 문제, 구조 문제, 문서 충돌 또는 개선 필요사항을 발견하더라도  
현재 작업 범위를 넘어서는 수정은 하지 않는다.

다음 형식으로 보고한다.

```text
[발견 사항]

파일:
위치:
현상:
예상 원인:
현재 UI 작업 영향:
관련 문서:
수정 필요 여부:
```

사용자 승인 이후 별도 작업으로 처리한다.

---

# 21. 최종 원칙 요약

Frontend 디자인 작업의 판단 순서는 다음과 같다.

```text
RULES
무엇을 수정할 수 있는가
        ↓
GUIDE
어떤 품질과 일관성을 지켜야 하는가
        ↓
REFERENCE
이번 시안은 어떤 모습으로 만들 것인가
        ↓
현재 코드
기존 기능과 구조를 유지하며 구현
```

디자인 시안이 여러 개 존재하더라도  
기능 기준, 작업 규칙, 공통 UI/UX 품질 기준은 동일하게 유지한다.

디자인 브랜치별로 달라지는 것은  
`FRONTEND_DESIGN_REFERENCE_XX.md`에 정의된 Visual Direction과 구체적인 디자인 표현이다.
