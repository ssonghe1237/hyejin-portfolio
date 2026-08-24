# Backend Domain Package Structure Guide

> 프로젝트: Hyejin Portfolio Backend  
> 기준 구조: 도메인 기준 패키지 구조  
> 대상 도메인: `domain/project`  
> 목적: 포트폴리오 프로젝트의 백엔드 패키지 구조, 각 파일 역할, 전체 흐름, 주의사항을 정리한다.

---

## 01. 패키지 구조 확정 방향

이번 포트폴리오 사이트의 백엔드는 **도메인 기준 패키지 구조**로 확정한다.

즉, `controller`, `service`, `repository`, `entity`, `dto`를 프로젝트 전체 기준으로 먼저 나누는 방식이 아니라, 기능 단위인 `project`, `admin`, `file` 같은 도메인을 먼저 나누고 그 안에서 계층을 분리한다.

---

## 02. 도메인 기준 구조를 선택하는 이유

백엔드 패키지 구조는 크게 두 가지 방식으로 나눌 수 있다.

### 02-1. 계층 기준 구조

```txt
controller
service
repository
entity
dto
```

이 방식은 작은 예제 프로젝트에서는 단순해 보인다.  
하지만 기능이 늘어나면 프로젝트 관련 파일, 관리자 관련 파일, 파일 업로드 관련 파일이 여러 패키지에 흩어진다.

예를 들어 프로젝트 기능을 수정하려면 다음 위치를 계속 왔다 갔다 해야 한다.

```txt
controller/ProjectController.java
service/ProjectService.java
repository/ProjectRepository.java
entity/ProjectEntity.java
dto/ProjectResponseDto.java
```

작은 규모에서는 괜찮지만, 기능이 늘어나면 유지보수가 불편해진다.

---

### 02-2. 도메인 기준 구조

```txt
domain/project
domain/admin
domain/file
global
```

이 방식은 기능 단위로 패키지를 나눈다.  
프로젝트 관련 코드는 모두 `domain/project` 아래에 모이고, 관리자 관련 코드는 `domain/admin`, 파일 업로드 관련 코드는 `domain/file` 아래에 모인다.

이번 프로젝트는 다음 기능이 분리되어 있다.

```txt
프로젝트 조회/상세/등록/수정
관리자 로그인/인증
이미지/PDF 파일 관리
공통 예외/응답/설정
```

따라서 도메인 기준 구조가 더 적합하다.

---

## 03. 전체 백엔드 패키지 구조

최종적으로 백엔드는 아래 구조를 목표로 한다.

```txt
backend/src/main/java/com/hyejin/portfolio
├── BackendApplication.java
│
├── domain
│   ├── project
│   │   ├── controller
│   │   ├── service
│   │   ├── repository
│   │   ├── entity
│   │   └── dto
│   │
│   ├── admin
│   │   ├── controller
│   │   ├── service
│   │   ├── repository
│   │   ├── entity
│   │   └── dto
│   │
│   └── file
│       ├── controller
│       ├── service
│       └── dto
│
└── global
    ├── config
    ├── exception
    ├── response
    └── health
```

---

## 04. 최우선 구현 도메인: project

현재 가장 먼저 구현할 도메인은 `project`이다.

이유는 포트폴리오 사이트의 핵심 데이터가 프로젝트이기 때문이다.

Work 메인 페이지, 프로젝트 상세 페이지, 관리자 프로젝트 관리 페이지는 모두 `Project` 데이터를 기준으로 동작한다.

---

## 05. project 도메인 패키지 구조

확정 구조는 다음과 같다.

```txt
domain/project
├── controller
│   └── ProjectController.java
│
├── service
│   └── ProjectService.java
│
├── repository
│   └── ProjectRepository.java
│
├── entity
│   ├── ProjectEntity.java
│   ├── ProjectTechEntity.java
│   ├── ProjectImageEntity.java
│   ├── ProjectSectionEntity.java
│   ├── ProjectType.java
│   └── SectionType.java
│
└── dto
    ├── ProjectListResponseDto.java
    ├── ProjectDetailResponseDto.java
    ├── ProjectCreateRequestDto.java
    └── ProjectUpdateRequestDto.java
```

---

## 06. project 도메인 파일별 역할 정리

| 구분 | 파일/패키지 | 역할 |
|---|---|---|
| controller | `ProjectController.java` | 사용자 화면에서 프로젝트 목록과 상세 정보를 조회하는 공개 API를 담당한다. 예: `GET /api/projects`, `GET /api/projects/{slug}` |
| service | `ProjectService.java` | 프로젝트 조회, 상세 조회, 등록, 수정, 공개/비공개 처리 등 비즈니스 로직을 담당한다. Controller와 Repository 사이의 핵심 계층이다. |
| repository | `ProjectRepository.java` | `ProjectEntity`를 기준으로 PostgreSQL DB에 접근한다. `JpaRepository`를 상속받아 CRUD와 조건 조회 메서드를 제공한다. |
| entity | `ProjectEntity.java` | `projects` 테이블과 매핑되는 핵심 Entity이다. 프로젝트명, slug, 한줄 설명, 기간, 담당 역할, 대표 이미지, 공개 여부 등을 관리한다. |
| entity | `ProjectTechEntity.java` | `project_techs` 테이블과 매핑된다. 하나의 프로젝트에 여러 기술스택을 연결하기 위한 Entity이다. |
| entity | `ProjectImageEntity.java` | `project_images` 테이블과 매핑된다. 프로젝트 상세 페이지에 표시할 여러 이미지를 관리한다. |
| entity | `ProjectSectionEntity.java` | `project_sections` 테이블과 매핑된다. OVERVIEW, MY_ROLE, TROUBLESHOOTING 같은 상세 페이지 섹션을 유연하게 관리한다. |
| entity | `ProjectType.java` | 프로젝트의 성격을 구분하는 Enum이다. 예: `TEAM`, `PERSONAL`, `DESIGN`, `GUIDE`, `EXPERIMENT` |
| entity | `SectionType.java` | Work 메인 페이지에서 어느 섹션에 노출할지 구분하는 Enum이다. 예: `TEAM`, `MORE` |
| dto | `ProjectListResponseDto.java` | Work 메인 카드 목록 응답에 사용하는 DTO이다. 카드에 필요한 최소 정보만 내려준다. |
| dto | `ProjectDetailResponseDto.java` | 프로젝트 상세 페이지 응답에 사용하는 DTO이다. 상세 설명, 기술스택, 이미지, 섹션, 링크 정보를 포함할 수 있다. |
| dto | `ProjectCreateRequestDto.java` | 관리자 페이지에서 프로젝트 등록 요청을 받을 때 사용하는 DTO이다. 입력값 검증 대상이다. |
| dto | `ProjectUpdateRequestDto.java` | 관리자 페이지에서 프로젝트 수정 요청을 받을 때 사용하는 DTO이다. 기존 프로젝트 정보를 갱신하는 데 사용한다. |

---

## 07. 각 계층의 책임

### 07-1. Controller

Controller는 HTTP 요청과 응답을 담당한다.

역할:

```txt
React 프론트엔드 요청 받기
RequestParam / PathVariable / RequestBody 처리
Service 호출
ResponseDto 반환
```

Controller에는 복잡한 비즈니스 로직을 넣지 않는다.

좋은 예:

```txt
Controller
→ 요청값 받기
→ Service 호출
→ 결과 반환
```

피해야 할 예:

```txt
Controller에서 Entity 직접 생성
Controller에서 Repository 직접 호출
Controller에서 복잡한 조건문 처리
```

---

### 07-2. Service

Service는 비즈니스 로직을 담당한다.

역할:

```txt
프로젝트 목록 조회 조건 처리
프로젝트 상세 조회
프로젝트 등록/수정
공개/비공개 상태 변경
DTO와 Entity 변환 흐름 관리
트랜잭션 관리
```

Service에는 `@Transactional`을 사용한다.

조회 전용 메서드는 다음처럼 사용할 수 있다.

```java
@Transactional(readOnly = true)
```

등록/수정/삭제 메서드는 일반 `@Transactional`을 사용한다.

---

### 07-3. Repository

Repository는 DB 접근을 담당한다.

역할:

```txt
ProjectEntity 저장
ProjectEntity 조회
slug 기준 조회
sectionType 기준 목록 조회
공개 프로젝트만 조회
```

예상 메서드:

```java
Optional<ProjectEntity> findBySlugAndPublishedTrue(String slug);

List<ProjectEntity> findBySectionTypeAndPublishedTrueOrderByStartDateDesc(
        SectionType sectionType
);

boolean existsBySlug(String slug);
```

Repository에는 비즈니스 로직을 넣지 않는다.  
DB 조회 목적의 메서드만 둔다.

---

### 07-4. Entity

Entity는 DB 테이블과 직접 매핑되는 객체이다.

역할:

```txt
DB 컬럼과 매핑
도메인 상태 보관
상태 변경 메서드 제공
JPA 관계 매핑
```

Entity는 단순 데이터 주머니가 아니다.  
필요한 경우 `publish()`, `unpublish()`, `updateBasicInfo()` 같은 의미 있는 메서드를 제공한다.

피해야 할 방식:

```txt
모든 필드에 public setter 열기
Controller에서 Entity 직접 반환
Entity에 화면 전용 로직 넣기
```

---

### 07-5. DTO

DTO는 API 요청/응답에 사용하는 객체이다.

역할:

```txt
RequestDto: 프론트엔드 요청값 받기
ResponseDto: 프론트엔드 응답값 내려주기
Entity 내부 구조를 외부에 직접 노출하지 않기
```

Entity를 Controller에서 직접 반환하지 않는다.

나쁜 예:

```java
@GetMapping("/api/projects")
public List<ProjectEntity> getProjects() {
    return projectRepository.findAll();
}
```

좋은 예:

```java
@GetMapping("/api/projects")
public List<ProjectListResponseDto> getProjects() {
    return projectService.getProjects();
}
```

---

## 08. 만들 DB 구조 전체 개요

project 도메인에서 사용할 DB 테이블은 다음과 같다.

```txt
projects
├── project_techs
├── project_images
└── project_sections
```

관리자 기능까지 포함하면 다음 테이블도 추가된다.

```txt
admin_users
```

---

## 09. DB 관계 구조

전체 관계는 다음과 같다.

```txt
projects 1 : N project_techs
projects 1 : N project_images
projects 1 : N project_sections

admin_users는 관리자 인증용 독립 테이블
```

즉, 하나의 프로젝트는 여러 개의 기술스택, 여러 개의 상세 이미지, 여러 개의 상세 섹션을 가질 수 있다.

---

## 10. projects 테이블 역할

`projects`는 포트폴리오 사이트의 중심 테이블이다.

사용 위치:

```txt
Work 메인 Team Project 카드
Work 메인 More stuff 카드
프로젝트 상세 페이지
관리자 프로젝트 목록
관리자 프로젝트 등록/수정
```

예상 컬럼:

```txt
project_id
title
slug
summary
description
project_type
section_type
start_date
end_date
period_text
team_name
role
thumbnail_url
pdf_url
erd_image_url
mermaid_content
github_url
deploy_url
display_order
is_published
created_at
updated_at
```

---

## 11. project_techs 테이블 역할

`project_techs`는 프로젝트 기술스택을 관리한다.

기술스택을 `projects` 테이블의 문자열 하나로 저장하지 않고 별도 테이블로 분리하는 이유는 다음과 같다.

```txt
프로젝트마다 기술스택 개수가 다르다.
기술스택 정렬 순서가 필요하다.
Frontend / Backend / Database / Infra 같은 카테고리 분리가 가능하다.
나중에 상세 페이지에서 기술스택을 태그 형태로 보여주기 쉽다.
```

예상 컬럼:

```txt
project_tech_id
project_id
tech_name
tech_category
display_order
```

---

## 12. project_images 테이블 역할

`project_images`는 프로젝트 상세 페이지에 표시할 여러 이미지를 관리한다.

대표 이미지는 `projects.thumbnail_url`에 저장하고, 상세 페이지 이미지 여러 장은 `project_images`에서 관리한다.

예상 컬럼:

```txt
project_image_id
project_id
image_url
caption
display_order
```

---

## 13. project_sections 테이블 역할

`project_sections`는 프로젝트 상세 페이지의 텍스트 섹션을 관리한다.

예상 섹션:

```txt
OVERVIEW
MY_ROLE
KEY_FEATURES
ARCHITECTURE
DATABASE_ERD
WORKFLOW
TROUBLESHOOTING
RESULT
LINKS
```

섹션을 별도 테이블로 분리하는 이유는 다음과 같다.

```txt
프로젝트마다 상세 설명 구성이 달라질 수 있다.
나중에 섹션 추가/삭제가 필요할 수 있다.
DB 컬럼을 계속 늘리지 않아도 된다.
관리자 페이지에서 섹션 단위로 수정하기 좋다.
```

예상 컬럼:

```txt
section_id
project_id
section_type
title
content
display_order
```

---

## 14. admin_users 테이블 역할

`admin_users`는 관리자 로그인과 인증을 위한 테이블이다.

예상 컬럼:

```txt
admin_id
email
password
name
role
created_at
```

주의사항:

```txt
password는 절대 평문으로 저장하지 않는다.
나중에 Spring Security + BCrypt로 암호화한다.
관리자 인증은 JWT 방식으로 확장할 수 있다.
```

---

## 15. 화면과 API 흐름

### 15-1. Work 메인 Team Project 조회

```txt
React WorkPage
↓
GET /api/projects?sectionType=TEAM
↓
ProjectController
↓
ProjectService
↓
ProjectRepository
↓
projects 테이블 조회
↓
ProjectListResponseDto 반환
```

조회 조건:

```txt
section_type = TEAM
is_published = true
```

---

### 15-2. More stuff 조회

```txt
React WorkPage
↓
GET /api/projects?sectionType=MORE
↓
ProjectController
↓
ProjectService
↓
ProjectRepository
↓
projects 테이블 조회
↓
ProjectListResponseDto 반환
```

조회 조건:

```txt
section_type = MORE
is_published = true
```

---

### 15-3. 프로젝트 상세 조회

```txt
React ProjectDetailPage
↓
GET /api/projects/{slug}
↓
ProjectController
↓
ProjectService
↓
ProjectRepository
↓
projects + project_techs + project_images + project_sections 조회
↓
ProjectDetailResponseDto 반환
```

조회 조건:

```txt
slug = 요청 slug
is_published = true
```

---

### 15-4. 관리자 프로젝트 등록

```txt
AdminProjectFormPage
↓
POST /api/admin/projects
↓
AdminProjectController
↓
ProjectService
↓
ProjectEntity 생성
↓
ProjectRepository.save()
↓
projects 테이블 저장
```

---

## 16. 구현 순서

전체 구조는 위와 같이 가져가되, 구현은 작은 단위로 검증하면서 진행한다.

### 16-1. 1차 구현

```txt
ProjectType
SectionType
ProjectEntity
ProjectRepository
```

목표:

```txt
projects 테이블 자동 생성 확인
Repository 메서드명 오류 확인
```

---

### 16-2. 2차 구현

```txt
ProjectListResponseDto
ProjectDetailResponseDto
ProjectService
ProjectController
```

목표:

```txt
GET /api/projects?sectionType=TEAM
GET /api/projects/{slug}
```

---

### 16-3. 3차 구현

```txt
ProjectTechEntity
ProjectImageEntity
ProjectSectionEntity
```

목표:

```txt
프로젝트 상세 페이지용 기술스택, 이미지, 섹션 구조 확장
```

---

### 16-4. 4차 구현

```txt
ProjectCreateRequestDto
ProjectUpdateRequestDto
AdminProjectController
```

목표:

```txt
관리자 페이지에서 프로젝트 등록/수정 가능
```

---

### 16-5. 5차 구현

```txt
AdminUserEntity
AdminAuthService
AdminAuthController
Spring Security
JWT
```

목표:

```txt
관리자 로그인 및 인증 처리
```

---

## 17. 주요 주의사항

### 17-1. Entity를 Controller에서 직접 반환하지 않는다

Entity는 DB 구조와 강하게 연결되어 있다.  
Controller에서 Entity를 직접 반환하면 내부 구조가 외부 API에 그대로 노출된다.

반드시 ResponseDto로 변환해서 반환한다.

---

### 17-2. Entity 필드명과 Repository 메서드명을 맞춘다

예를 들어 Entity 필드가 다음과 같다면:

```java
private boolean published;
```

Repository 메서드는 다음처럼 작성해야 한다.

```java
findBySlugAndPublishedTrue(String slug)
```

다음처럼 작성하면 안 된다.

```java
findBySlugAndIsPublishedTrue(String slug)
```

`is_published`는 DB 컬럼명이고, Java 필드명은 `published`이기 때문이다.

---

### 17-3. boolean 필드명은 신중하게 정한다

Java Entity에서 다음처럼 작성하면 Lombok/Jackson/JPA 조합에서 혼란이 생길 수 있다.

```java
private Boolean isPublished;
```

권장 방식:

```java
@Column(name = "is_published")
private boolean published;
```

즉, Java 필드명은 `published`, DB 컬럼명은 `is_published`로 가져간다.

---

### 17-4. application-local.yml은 GitHub에 올리지 않는다

`application-local.yml`에는 DB 비밀번호가 들어간다.  
반드시 `.gitignore`에 포함해야 한다.

```gitignore
backend/src/main/resources/application-local.yml
```

---

### 17-5. JPA 관계 매핑은 한 번에 많이 만들지 않는다

처음부터 `ProjectEntity`, `ProjectTechEntity`, `ProjectImageEntity`, `ProjectSectionEntity`의 모든 관계를 한 번에 만들면 오류 원인 추적이 어려워진다.

권장 순서:

```txt
ProjectEntity 단독 생성
↓
projects 테이블 확인
↓
ProjectRepository 확인
↓
관계 Entity 추가
```

---

### 17-6. ddl-auto는 개발과 운영을 분리한다

개발 단계에서는 다음 설정을 사용할 수 있다.

```yml
spring:
  jpa:
    hibernate:
      ddl-auto: update
```

하지만 운영 배포 단계에서는 다음처럼 변경하는 것이 안전하다.

```yml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
```

운영에서 `update`를 계속 사용하면 Entity 변경이 DB 구조에 예상치 않게 반영될 수 있다.

---

## 18. 최종 정리

이번 백엔드 구조는 다음 기준으로 확정한다.

```txt
도메인 기준 패키지 구조
+
Project 중심 DB 설계
+
Entity/Repository/Service/Controller/DTO 계층 분리
+
관리자 확장을 고려한 구조
```

가장 먼저 구현할 대상은 다음이다.

```txt
ProjectType
SectionType
ProjectEntity
ProjectRepository
```

이후 API 계층을 붙이고, 그 다음 관계 Entity와 관리자 기능을 확장한다.
