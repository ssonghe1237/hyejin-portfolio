# About 페이지 Entity 구조 이해 가이드

- 프로젝트: 포트폴리오 사이트
- 작성자: Song
- 작성일: 2026-08-04
- 대상 브랜치: `topic/about-content-management`

---

## 1. 핵심 개념

```text
AboutEntity
= About 페이지 전체를 대표하는 1개의 문서

AboutSectionEntity
= About 페이지 안에 반복해서 들어가는 여러 개의 콘텐츠 블록
```

두 Entity의 관계는 다음과 같다.

```text
AboutEntity 1개
    │
    ├── AboutSectionEntity 1 : Career
    ├── AboutSectionEntity 2 : Skills
    ├── AboutSectionEntity 3 : How I Work
    └── AboutSectionEntity 4 : Beyond Work
```

즉, About 페이지는 하나지만 페이지 안에 들어가는 세부 섹션은 여러 개다.

---

## 2. 실제 About 페이지 구성

현재 Entity 구조를 실제 사용자 화면에 대입하면 다음과 같다.

```text
┌──────────────────────────────────────────────────────────────┐
│ ABOUT                                                        │
│                                                              │
│ 문제를 구조화하고 끝까지 구현하는 개발자                     │
│                                                              │
│ 기획과 디자인 경험을 바탕으로 사용자와 운영 환경을 함께       │
│ 고려하는 백엔드 개발자 송혜진입니다.                          │
│                                                              │
│ [ Get in touch → ]                                           │
└──────────────────────────────────────────────────────────────┘
             ↑
             AboutEntity
             heading
             summary
             ctaLabel
             ctaUrl


┌──────────────────────────────────────────────────────────────┐
│ 01. Career                                                   │
│                                                              │
│ 마케팅과 디자인 실무를 경험한 뒤 Java/Spring 기반의           │
│ 백엔드 개발자로 전환했습니다.                                │
│                                                              │
│ · 마케팅·기획 실무                                           │
│ · 프랜차이즈 제안서 및 디자인 업무                           │
│ · Java/Spring 웹 개발 교육                                   │
└──────────────────────────────────────────────────────────────┘
             ↑
             AboutSectionEntity
             title = "Career"
             contentHtml = "<p>...</p><ul>...</ul>"
             displayOrder = 1


┌──────────────────────────────────────────────────────────────┐
│ 02. Skills                                                   │
│                                                              │
│ Backend                                                      │
│ Java · Spring Boot · JPA · PostgreSQL                        │
│                                                              │
│ Frontend                                                     │
│ React · TypeScript                                           │
└──────────────────────────────────────────────────────────────┘
             ↑
             AboutSectionEntity
             title = "Skills"
             contentHtml = "<h3>Backend</h3><p>...</p>"
             displayOrder = 2


┌──────────────────────────────────────────────────────────────┐
│ 03. How I Work                                               │
│                                                              │
│ 기능 구현만 끝내는 것이 아니라 데이터 생명주기, 예외 처리,    │
│ 운영 환경까지 고려해 구조를 설계합니다.                      │
└──────────────────────────────────────────────────────────────┘
             ↑
             AboutSectionEntity
             title = "How I Work"
             contentHtml = "<p>...</p>"
             displayOrder = 3


┌──────────────────────────────────────────────────────────────┐
│ 04. Beyond Work                                              │
│                                                              │
│ 개발 외에도 브랜딩, 디자인, 콘텐츠 구조화에 관심이 있습니다. │
└──────────────────────────────────────────────────────────────┘
             ↑
             AboutSectionEntity
             title = "Beyond Work"
             contentHtml = "<p>...</p>"
             displayOrder = 4
```

---

## 3. AboutEntity가 담당하는 화면 영역

`AboutEntity`는 About 페이지 전체와 상단 소개 영역을 담당한다.

```java
private Long aboutId;
private String heading;
private String summary;
private String ctaLabel;
private String ctaUrl;
private boolean published;
private List<AboutSectionEntity> sections;
private LocalDateTime createdAt;
private LocalDateTime updatedAt;
```

### 필드와 실제 화면의 연결

| Entity 필드 | 실제 화면 또는 역할 |
|---|---|
| `aboutId` | 관리자 내부 식별값 |
| `heading` | About 페이지 메인 제목 |
| `summary` | 제목 아래 자기소개 문장 |
| `ctaLabel` | CTA 버튼 문구 |
| `ctaUrl` | CTA 버튼 이동 주소 |
| `published` | 사용자 About 페이지 공개 여부 |
| `sections` | 화면에 반복해서 표시되는 콘텐츠 섹션 |
| `createdAt` | About 데이터 최초 생성 시각 |
| `updatedAt` | About 데이터 마지막 수정 시각 |

### 저장 데이터 예시

```text
aboutId     = 1
heading     = "문제를 구조화하고 끝까지 구현하는 개발자"
summary     = "기획과 디자인 경험을 바탕으로 사용자와 운영 환경을 함께 고려하는 백엔드 개발자 송혜진입니다."
ctaLabel    = "Get in touch"
ctaUrl      = "/contact"
published   = true
```

사용자 화면에서는 다음처럼 출력된다.

```text
문제를 구조화하고 끝까지 구현하는 개발자

기획과 디자인 경험을 바탕으로 사용자와 운영 환경을
함께 고려하는 백엔드 개발자 송혜진입니다.

[ Get in touch ]
```

---

## 4. AboutSectionEntity가 담당하는 화면 영역

`AboutSectionEntity`는 About 페이지 내부의 콘텐츠 블록 하나를 담당한다.

```java
private Long sectionId;
private AboutEntity about;
private String title;
private String contentHtml;
private Integer displayOrder;
```

### 필드와 실제 화면의 연결

| Entity 필드 | 실제 화면 또는 역할 |
|---|---|
| `sectionId` | 섹션 내부 식별값 |
| `about` | 해당 섹션이 속한 About 페이지 |
| `title` | `Career`, `Skills`, `How I Work` 등의 섹션 제목 |
| `contentHtml` | Tiptap으로 작성한 섹션 본문 |
| `displayOrder` | 사용자 화면에 표시되는 순서 |

### Career 섹션 데이터 예시

```text
sectionId   = 1
aboutId     = 1
title       = "Career"
contentHtml = "<p>마케팅과 디자인 실무를 경험한 뒤...</p>
               <ul>
                 <li>마케팅·기획 실무</li>
                 <li>프랜차이즈 디자인</li>
                 <li>Java/Spring 개발 교육</li>
               </ul>"
displayOrder = 1
```

사용자 화면에서는 다음처럼 렌더링된다.

```text
Career

마케팅과 디자인 실무를 경험한 뒤 Java/Spring 기반의
백엔드 개발자로 전환했습니다.

• 마케팅·기획 실무
• 프랜차이즈 디자인
• Java/Spring 개발 교육
```

---

## 5. 실제 DB 관계

### about_profiles

| about_id | heading | summary | cta_label | cta_url | is_published |
|---:|---|---|---|---|---|
| 1 | 문제를 구조화하고 끝까지 구현하는 개발자 | 기획과 디자인 경험을 바탕으로… | Get in touch | /contact | true |

### about_sections

| section_id | about_id | title | display_order |
|---:|---:|---|---:|
| 1 | 1 | Career | 1 |
| 2 | 1 | Skills | 2 |
| 3 | 1 | How I Work | 3 |
| 4 | 1 | Beyond Work | 4 |

### 관계 구조

```text
about_profiles
┌──────────────┐
│ about_id = 1 │
└──────┬───────┘
       │ 1:N
       ├────────────────────────────┐
       ▼                            ▼
about_sections                 about_sections
Career                         Skills
about_id = 1                   about_id = 1
display_order = 1              display_order = 2
```

모든 섹션의 `about_id`는 같은 About 페이지를 가리킨다.

---

## 6. 관리자 About 화면 구성안

관리자 About 화면은 다음과 같은 구조로 만든다.

```text
┌─ About 기본 정보 ──────────────────────────────┐
│ 메인 제목                                      │
│ [ 문제를 구조화하고 끝까지 구현하는 개발자 ]   │
│                                                │
│ 소개 요약                                      │
│ [ 기획과 디자인 경험을 바탕으로...          ] │
│                                                │
│ CTA 문구      [ Get in touch ]                 │
│ CTA 주소      [ /contact ]                     │
│                                                │
│ ☑ 사용자 화면에 공개                           │
└────────────────────────────────────────────────┘


┌─ About 섹션 01 ────────────────────────────────┐
│ 섹션 제목     [ Career ]                       │
│ 표시 순서     [ 1 ]                            │
│                                                │
│ 본문                                           │
│ ┌────────────────────────────────────────────┐ │
│ │ Tiptap RichTextEditor                     │ │
│ │ 마케팅과 디자인 실무를 경험한 뒤...       │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ [ 섹션 삭제 ]                                  │
└────────────────────────────────────────────────┘


┌─ About 섹션 02 ────────────────────────────────┐
│ 섹션 제목     [ Skills ]                       │
│ 표시 순서     [ 2 ]                            │
│                                                │
│ 본문                                           │
│ ┌────────────────────────────────────────────┐ │
│ │ Backend                                   │ │
│ │ Java · Spring Boot · JPA                  │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ [ 섹션 삭제 ]                                  │
└────────────────────────────────────────────────┘

[ + 섹션 추가 ]

                         [ About 저장 ]
```

저장 버튼을 한 번 누르면 다음 작업이 함께 처리된다.

```text
About 기본 정보 수정
기존 섹션 수정
새 섹션 추가
제거한 섹션 삭제
displayOrder에 따른 순서 변경
```

---

## 7. 섹션 순서 변경 방식

기존 데이터:

```text
Career       displayOrder = 1
Skills       displayOrder = 2
How I Work   displayOrder = 3
```

사용자 화면:

```text
Career
Skills
How I Work
```

관리자가 순서를 다음처럼 수정한다고 가정한다.

```text
How I Work   displayOrder = 1
Career       displayOrder = 2
Skills       displayOrder = 3
```

사용자 화면은 자동으로 다음 순서로 바뀐다.

```text
How I Work
Career
Skills
```

Entity의 다음 설정이 순서를 담당한다.

```java
@OrderBy("displayOrder ASC, sectionId ASC")
private final List<AboutSectionEntity> sections;
```

`displayOrder`가 같으면 `sectionId`가 작은 섹션부터 표시된다.

---

## 8. 섹션 삭제 방식

기존 섹션:

```text
Career
Skills
How I Work
Beyond Work
```

관리자 화면에서 `Beyond Work`를 제거한 후 저장하면 Service가 새로운 목록으로 전체 교체한다.

```java
about.replaceSections(newSections);
```

내부 처리:

```java
this.sections.clear();
newSections.forEach(this::addSection);
```

연관관계 설정:

```java
@OneToMany(
    mappedBy = "about",
    cascade = CascadeType.ALL,
    orphanRemoval = true
)
```

따라서 기존 관계에서 빠진 섹션은 DB에서도 삭제된다.

```text
관리자 폼에서 섹션 제거
→ AboutEntity.sections에서 제거
→ JPA orphanRemoval
→ about_sections 행 삭제
```

---

## 9. 현재 구조로 만들 수 있는 About 페이지

현재 모델은 다음과 같은 자유로운 페이지 구성을 지원한다.

```text
About
├── 메인 소개
├── CTA
├── Career
├── Skills
├── How I Work
├── Development Philosophy
├── Experience
├── Beyond Work
└── 원하는 신규 섹션
```

새로운 섹션을 추가해도 Entity 컬럼이나 DB 테이블을 변경할 필요가 없다.

```text
새 섹션 제목: What I Value
본문: Tiptap 작성
순서: 5
```

---

## 10. 현재 모델의 장점

### 10.1 섹션 확장이 쉽다

새 섹션을 추가할 때 Entity 컬럼을 추가하지 않아도 된다.

```text
기존 방식
careerHtml
skillsHtml
philosophyHtml
beyondWorkHtml

문제
새 섹션 추가 시 Entity, DTO, DB 컬럼 수정 필요
```

현재 구조:

```text
AboutEntity
└── List<AboutSectionEntity>
```

새 섹션은 행 하나를 추가하는 방식으로 처리한다.

### 10.2 관리자 화면에서 섹션을 자유롭게 관리할 수 있다

```text
추가
수정
삭제
순서 변경
```

을 단일 About 저장 API에서 처리할 수 있다.

### 10.3 Research와 동일한 Rich Text 정책을 사용할 수 있다

```text
RichTextEditor
→ HTML 전송
→ RichTextHtmlSanitizer
→ 정제된 HTML 저장
```

Research와 About가 같은 편집기와 HTML 보안 정책을 공유할 수 있다.

---

## 11. 현재 모델의 한계

현재 `AboutSectionEntity`는 모든 세부 내용을 `contentHtml`에 저장한다.

따라서 자유도는 높지만 구조화 수준은 낮다.

### 적합한 콘텐츠

```text
자기소개 문단
개발 철학
경력 설명
학습 과정
취미와 관심사
텍스트 중심의 기술 설명
```

### 덜 적합한 콘텐츠

```text
회사명 / 근무 기간 / 직책을 분리한 경력 타임라인
기술별 숙련도 수치
기술 태그 필터
아이콘이 포함된 기술 카드
여러 장의 프로필 또는 활동 이미지
```

예를 들어 경력을 다음 데이터로 별도 검색·정렬해야 한다면:

```text
회사명
직책
시작일
종료일
업무 내용
```

`contentHtml` 하나보다는 `AboutCareerEntity` 같은 별도 Entity가 더 적합하다.

그러나 현재 포트폴리오 MVP는 텍스트 중심의 About 페이지이므로 별도 경력 Entity까지 만드는 것은 과설계다.

---

## 12. 프로필 이미지 제외 이유

현재 단계에서는 About 프로필 이미지를 제외한다.

프로젝트 이미지 고아 정리 로직이 프로젝트 이미지 참조를 중심으로 동작하고 있기 때문이다.

About 이미지 업로드를 먼저 추가하면, About 페이지가 정상적으로 참조 중인 이미지라도 프로젝트 DB에서 참조되지 않는다는 이유로 고아 이미지로 잘못 판정될 위험이 있다.

따라서 순서는 다음이 안전하다.

```text
1. About 텍스트 콘텐츠 관리 완성
2. About 이미지 저장 정책 결정
3. 이미지 참조 범위 확장
4. 고아 이미지 정리 로직에 About 참조 포함
5. About 이미지 업로드 연결
```

---

## 13. 최종 구조 요약

```text
AboutEntity
= 페이지 전체 설정과 상단 소개

AboutSectionEntity
= 페이지 아래에 반복해서 붙는 콘텐츠 블록
```

실제 사용자 화면을 한 줄 구조로 표현하면 다음과 같다.

```text
[AboutEntity 상단 소개]
+
[AboutSectionEntity 1]
+
[AboutSectionEntity 2]
+
[AboutSectionEntity 3]
+
[AboutEntity CTA]
```

CTA 데이터는 `AboutEntity`에 저장하지만 화면의 상단 또는 하단 어디에 배치할지는 프론트엔드가 결정한다.

DB에 저장되는 위치와 사용자 화면의 노출 위치가 반드시 같을 필요는 없다.
