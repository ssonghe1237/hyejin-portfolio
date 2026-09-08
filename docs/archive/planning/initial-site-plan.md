# 포트폴리오 사이트 페이지 구조 및 빠른 배포 계획

> 사용자 페이지와 관리자 페이지의 구성, 콘텐츠 관리 범위, 구현 우선순위를 정의한 문서  
> 목표: **빠른 제작 → 빠른 배포 → 배포 후 단계적 고도화**

---

## 1. 프로젝트 방향

이 사이트는 단순한 정적 포트폴리오가 아니라, 프로젝트·기술 연구 기록·About 콘텐츠를 관리자 화면에서 직접 관리할 수 있는 콘텐츠형 포트폴리오를 목표로 한다.

빠른 배포가 우선이므로 모든 기능을 CMS로 확장하지 않고, 현재 필요한 범위만 구현한다.

### 핵심 원칙

- 기존 프로젝트 관리 기능을 최대한 재사용한다.
- Home, Work, About, Get in touch를 우선 완성한다.
- Projects, Research, About은 관리자에서 관리할 수 있도록 한다.
- Get in touch와 이력서 PDF는 초기에는 정적 파일로 관리한다.
- Markdown 대신 WYSIWYG 편집기를 사용한다.
- React + TypeScript + Vite 구조와의 호환성을 위해 Summernote보다 Tiptap을 우선 사용한다.
- 이미지 업로드, 검색, 댓글, 자동 저장 등은 배포 이후로 미룬다.

---

## 2. 전체 사이트 구조

```text
Home
├── Work
│   ├── Selected Work
│   ├── Research
│   └── More Work
├── About
└── Get in touch

Admin
├── Projects
├── Research
└── About
```

### 전역 내비게이션

```text
Home
Work
About
Get in touch
```

Research는 전역 메뉴로 분리하지 않고 Work 페이지 내부 섹션으로 구성한다. 게시물이 충분히 쌓인 이후 별도 목록 페이지를 추가한다.

---

# 3. 사용자 페이지

## 3.1 Home

Home은 방문자가 짧은 시간 안에 개발자 정체성, 대표 프로젝트, 핵심 역량, 성장 배경, 연락 방법을 파악할 수 있도록 구성한다.

### 페이지 구성

```text
01 Hero
02 Selected Work
03 Core Capabilities
04 Background Summary
05 Contact CTA
```

### Hero

개발자 포지셔닝과 핵심 메시지를 보여준다.

```text
기획과 디자인 경험을 바탕으로
사용자 화면부터 백엔드와 운영 구조까지 연결하는 웹 개발자
```

주요 CTA:

```text
View my work
Get in touch
```

### Selected Work

대표 프로젝트 3개를 노출한다.

```text
displayOrder 1~3
→ Home 및 Work의 Selected Work

displayOrder 4 이후
→ Work의 More Work
```

초기 배포에서는 별도의 `featured` 컬럼을 추가하지 않는다.

### Core Capabilities

기술명만 나열하지 않고 실제로 맡을 수 있는 업무를 중심으로 표현한다.

```text
Backend Engineering
- Spring Boot, JPA, PostgreSQL 기반 API와 데이터 구조 설계

Product Development
- 기획과 디자인 경험을 활용한 사용자 중심 웹 기능 구현

Deployment & Operations
- Docker 기반 배포와 파일·데이터 생명주기를 고려한 운영 구조
```

### Background Summary

About 페이지로 연결되는 짧은 성장 배경을 제공한다.

### Contact CTA

Get in touch 페이지로 연결한다.

---

## 3.2 Work

Work는 프로젝트와 기술 연구 기록을 함께 보여주는 핵심 페이지다.

```text
Work Hero
├── Selected Work
├── Research
└── More Work
```

### Work Hero

Work가 단순 직장 경력이 아니라 프로젝트와 기술 연구 기록을 의미한다는 점을 명확히 한다.

```text
Projects, technical research, and experiments

직접 설계하고 구현한 프로젝트와
기술 문제를 분석하고 정리한 기록
```

### Selected Work

대표 프로젝트 3개를 큰 카드 또는 세로형 섹션으로 노출한다.

표시 정보:

```text
프로젝트명
한 줄 문제 정의
팀 또는 개인 프로젝트 표시
담당 역할
핵심 기술
대표 이미지
상세보기
```

팀/개인 여부는 분류 기준이 아니라 보조 정보로만 사용한다.

### Research

Research는 단순 메모장이 아니라 공개 가능한 기술 학습 기록과 프로젝트 문제 해결 기록을 관리한다.

예시 주제:

```text
JPA 트랜잭션 커밋 이후 파일을 삭제해야 하는 이유
임시 이미지와 DB 이미지의 생명주기 설계
Spring Scheduler를 이용한 고아 파일 정리
쿠키와 세션의 저장 위치 및 인증 흐름
JVM 메모리 구조와 GC
Docker 볼륨이 필요한 이유
```

Research 카드 정보:

```text
카테고리
제목
한 줄 요약
작성일
태그
Read article
```

초기 라우팅:

```text
/work
→ Research 카드 일부 노출

/research/{slug}
→ Research 상세
```

### More Work

Selected Work에 포함되지 않은 나머지 프로젝트를 작은 카드로 보여준다.

```text
프로젝트명
연도
한 줄 설명
핵심 기술
상세보기
```

---

## 3.3 Project Detail

프로젝트 상세는 기능 나열보다 문제 해결 과정이 드러나도록 구성한다.

```text
01 프로젝트 개요
02 문제 정의
03 담당 범위
04 핵심 기능
05 시스템 또는 데이터 구조
06 기술적 의사결정
07 문제 상황과 해결 과정
08 테스트 및 검증
09 결과 및 개선점
10 관련 링크
```

좋지 않은 예:

```text
이미지 업로드 기능 구현
```

권장 예:

```text
업로드 시점과 DB 저장 시점이 분리되면서 발생하는 임시 파일 누적 문제를 해결하기 위해
프론트 임시 파일 추적, DB 참조 검사, AFTER_COMMIT 삭제,
고아 파일 Scheduler를 결합한 이미지 생명주기 관리 구조를 설계
```

---

## 3.4 Research Detail

Research 상세는 블로그처럼 읽을 수 있지만 기술 문서의 구조를 유지한다.

```text
Back to Work

카테고리 · 작성일 · 읽는 시간
제목
요약

본문
- 제목
- 문단
- 목록
- 인용
- 코드 블록
- 링크

태그
관련 프로젝트
참고 링크
```

### 초기 지원 범위

```text
허용
- 제목 2, 제목 3
- 본문
- 굵게, 기울임, 취소선
- 글머리 목록, 번호 목록
- 인용
- 코드 블록
- 링크

제외
- 이미지 업로드
- 동영상
- iframe
- 파일 첨부
- HTML 직접 편집
```

---

## 3.5 About

About은 관리자에서 직접 수정할 수 있도록 구성한다.

### 사용자 페이지 구성

```text
01 Profile Summary
02 My Background
03 Current Focus
04 Skills
05 Education
06 Certifications
```

### Profile Summary

```text
Based in
Seoul, Korea

Currently
Java · Spring 기반 웹 개발 및 포트폴리오 프로젝트 진행

Focus
Backend, Full-stack, Product Development
```

### My Background

마케팅, 기획, 디자인 경험에서 개발로 확장된 흐름을 설명한다.

```text
요구사항 이해
정보 구조 설계
사용자 관점 UI 검토
업무 일정 및 이해관계자 커뮤니케이션
백엔드 구조와 데이터 흐름 구현
```

### Current Focus

```text
Spring Boot와 JPA 기반 백엔드 구조 심화
React와 TypeScript를 활용한 관리자 기능 구현
Docker 기반 배포 환경 준비
프로젝트 문제 해결 과정을 기술 문서로 정리
```

### Skills

```text
Languages
- Java
- JavaScript
- TypeScript
- SQL
- Python

Frontend
- React
- Vite
- HTML
- CSS

Backend
- Spring Boot
- Spring MVC
- JPA
- MyBatis

Database
- PostgreSQL
- Oracle

Tools & Delivery
- Git
- GitHub
- Docker
- IntelliJ IDEA
- Visual Studio Code
```

### Education

개발 교육 과정과 학습 이력을 관리한다.

### Certifications

```text
자격증명
발급 기관
취득 연도
인증 링크 또는 인증 번호
```

---

## 3.6 Get in touch

초기 버전에서는 메시지 전송 폼을 구현하지 않는다.

```text
이메일
GitHub
LinkedIn
지역
Résumé PDF
```

주요 버튼:

```text
Send an email
View GitHub
View résumé
```

이력서 PDF는 Vite 정적 파일로 관리한다.

```text
frontend/public/files/song-hyejin-resume.pdf
```

접근 URL:

```text
/files/song-hyejin-resume.pdf
```

---

# 4. 관리자 페이지

## 4.1 Projects

기존 프로젝트 관리 기능을 유지한다.

```text
Admin Projects
├── 목록
├── 등록
├── 상세
├── 수정
└── 삭제
```

관리 대상:

```text
프로젝트 기본 정보
대표 이미지
Hero 이미지
상세 섹션
기술 스택
관련 링크
공개 여부
노출 순서
```

---

## 4.2 Research

```text
Admin Research
├── 목록
├── 등록
├── 수정
└── 삭제
```

최소 관리 필드:

```text
제목
slug
요약
카테고리
태그
본문 HTML
공개 여부
노출 순서
작성일
수정일
공개일
```

초기 제외 기능:

```text
이미지 업로드
댓글
검색
조회수
좋아요
자동 저장
버전 관리
다중 작성자
SEO 전용 입력
페이지네이션
```

---

## 4.3 About

```text
Admin About
├── 기본 프로필 수정
├── 소개 수정
├── 경력 전환 배경 수정
├── 현재 집중 분야 수정
├── 기술 항목 관리
├── 교육 항목 관리
└── 자격증 항목 관리
```

About 전체를 하나의 HTML로 저장하지 않는다.

페이지 레이아웃은 프론트 코드로 고정하고, 각 영역의 데이터만 관리자에서 수정한다.

이유:

- 관리자 입력으로 레이아웃이 깨지는 것을 방지
- 기술, 교육, 자격증을 카드 UI로 출력 가능
- 항목별 정렬과 공개 여부 관리 가능
- 일부 데이터를 Home에서 재사용 가능
- 모바일 반응형 구조 유지 가능

---

# 5. 콘텐츠 편집기 결정

## Markdown 제외 이유

```text
미리보기 전환 필요
링크와 목록 문법 기억 필요
제목 문법 기억 필요
작성 결과를 즉시 확인하기 어려움
```

따라서 Research와 About의 긴 본문은 WYSIWYG 편집기로 작성한다.

## Summernote 검토

Summernote는 빠르게 사용할 수 있지만 현재 React + TypeScript + Vite 구조에서는 우선 적용하지 않는다.

장점:

```text
사용법이 직관적
기본 툴바 제공
HTML 출력 가능
빠른 초기 적용 가능
```

위험:

```text
jQuery 의존
React 외부에서 DOM 직접 조작
useEffect 초기화 및 destroy 관리 필요
React state와 편집기 HTML 동기화 문제
라우팅 전환 시 중복 초기화 위험
TypeScript 타입 보강 필요
```

## Tiptap 권장

```text
React 공식 연동 패키지 제공
TypeScript 호환성이 좋음
필요한 기능만 제한 가능
About과 Research에서 공통 컴포넌트 재사용 가능
React 상태와 편집기 상태 동기화가 명확함
```

설치 예정:

```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit
```

공통 컴포넌트:

```text
frontend/src/components/admin/editor/RichTextEditor.tsx
```

사용 위치:

```text
AdminResearchForm
AdminAboutPage
```

초기 툴바:

```text
본문
제목 2
제목 3
굵게
기울임
취소선
인용
글머리 목록
번호 목록
코드 블록
링크
실행 취소
다시 실행
```

---

# 6. 콘텐츠 저장 형식 및 보안

초기 버전에서는 Tiptap의 결과를 HTML 문자열로 저장한다.

```text
research_posts.content_html
about_pages.introduction_html
about_pages.background_html
about_pages.current_focus_html
about_entries.description_html
```

PostgreSQL 타입:

```sql
TEXT
```

### 저장 흐름

```text
관리자 에디터 입력
→ React 요청
→ Spring Boot에서 허용 태그 기준 HTML 정제
→ DB 저장
→ 사용자 조회
→ 프론트에서 추가 Sanitization
→ 사용자 화면 렌더링
```

허용 태그 예시:

```text
p, br, h2, h3, strong, em, s,
blockquote, ul, ol, li, pre, code, a
```

제거 대상:

```text
script, iframe, style, object, embed,
form, input, onclick, onerror, javascript:
```

---

# 7. 데이터 구조 초안

## Research

```text
research_posts
- research_id
- title
- slug
- summary
- content_html
- category
- tags
- published
- display_order
- created_at
- updated_at
- published_at
```

## About 기본 정보

```text
about_pages
- about_id
- headline
- sub_headline
- introduction_html
- background_html
- current_focus_html
- profile_image_url
- published
- created_at
- updated_at
```

About 페이지는 하나만 사용하므로 단일 행 데이터로 관리한다.

## About 반복 항목

```text
about_entries
- entry_id
- about_id
- entry_type
- title
- subtitle
- period
- description_html
- link_url
- display_order
- published
- created_at
- updated_at
```

```text
entry_type
- SKILL
- EDUCATION
- CERTIFICATION
```

---

# 8. 이미지 정책

현재 프로젝트 이미지 저장소와 고아 이미지 Scheduler는 프로젝트 이미지 생명주기를 기준으로 설계되어 있다.

Research 또는 About 이미지가 같은 저장 경로에 업로드되면 `project_images`에 참조되지 않은 파일이 고아 이미지로 오판될 위험이 있다.

### 초기 정책

```text
Research 본문 이미지 업로드 제외
About 본문 이미지 업로드 제외
Base64 이미지 저장 금지
프로필 이미지는 정적 파일 또는 별도 경로 사용
```

### 배포 이후 검토

```text
/uploads/content 전용 경로
content_assets 테이블
Research 및 About 이미지 참조 관리
임시 이미지 정리
본문에서 제거된 이미지 삭제
콘텐츠 고아 이미지 Scheduler
공통 media_assets 구조
```

---

# 9. 빠른 배포 범위

## MVP 포함

```text
Home
Work
Selected Work
Research 카드
More Work
Project Detail
Research Detail
About
Get in touch
이력서 PDF 연결
Admin Projects
Admin Research
Admin About
Tiptap 공통 편집기
HTML Sanitization
```

## 배포 이후

```text
Research 이미지 업로드
About 이미지 업로드
메시지 전송 폼
댓글
검색
태그 필터
페이지네이션
조회수
좋아요
다중 작성자
자동 저장
콘텐츠 버전 관리
이력서 관리자 업로드
Home 관리자 편집
Get in touch 관리자 편집
공통 미디어 자산 관리
```

---

# 10. 구현 순서

## 1단계: 사용자 페이지 구조

```text
브랜치 예시
feature/user-site-pages
```

```text
전역 내비게이션 정리
Home 제작
Work 구조 변경
About 사용자 페이지 제작
Get in touch 제작
이력서 PDF 연결
기존 프로젝트 API 재사용
```

## 2단계: 공통 Rich Text Editor

```text
브랜치 예시
feature/admin-rich-text-editor
```

```text
Tiptap 설치
RichTextEditor 공통 컴포넌트
툴바 구성
HTML 값 연동
기본 에디터 스타일
허용 기능 제한
```

## 3단계: Research

```text
브랜치 예시
feature/admin-research
```

```text
Research Entity
Repository
DTO
Service
Controller
관리자 목록·등록·수정·삭제
사용자 Research 상세
Work 페이지 Research 연동
```

## 4단계: About 관리자

```text
브랜치 예시
feature/admin-about
```

```text
About 기본 정보 Entity
About 반복 항목 Entity
Repository
DTO
Service
Controller
관리자 About 수정
기술·교육·자격증 항목 관리
사용자 About API 연동
```

## 5단계: 배포

```text
브랜치 예시
feature/docker-deployment
```

```text
Dockerfile
docker-compose.yml
운영 환경변수
PostgreSQL 연결
업로드 볼륨
Nginx 라우팅
운영 프로파일
이력서 PDF 제공
이미지 영속성 검증
Scheduler 운영 검증
```

---

# 11. 최종 결정 요약

| 항목 | 결정 |
|---|---|
| Home | 신규 제작 |
| Work | Selected Work / Research / More Work |
| Research | 관리자 CRUD 및 사용자 상세 제공 |
| About | 관리자에서 직접 수정 가능 |
| Get in touch | 정적 연락처 및 이력서 PDF 연결 |
| Markdown | 사용하지 않음 |
| Summernote | React 구조와의 부조화로 우선 제외 |
| Tiptap | 공통 WYSIWYG 편집기로 사용 |
| 저장 형식 | Sanitization된 HTML |
| Research/About 이미지 | 1차 배포에서 제외 |
| Home 관리자 기능 | 배포 이후 검토 |
| Contact 관리자 기능 | 배포 이후 검토 |
| 핵심 목표 | 빠른 제작과 빠른 배포 |
