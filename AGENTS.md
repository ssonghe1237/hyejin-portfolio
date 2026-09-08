AGENTS.md
1. Project
Project: Song Hye Jin Portfolio

Purpose: 사용자 포트폴리오와 관리자 콘텐츠 관리 기능을 제공하는 운영형 웹 애플리케이션

Frontend: React, TypeScript, Vite, React Router, CSS Modules, Tiptap

Backend: Java 17, Spring Boot, Spring MVC, Spring Data JPA, Spring Security

Database: PostgreSQL

Runtime: Docker, Docker Compose

Production: AWS Lightsail, Host Nginx, Cloudflare DNS, Let's Encrypt

Default font: Pretendard

배포가 완료된 운영 프로젝트이므로 광범위한 리팩터링보다 검증 가능한 작은 변경을 우선한다.

이 문서는 저장소 전체에 적용된다. 하위 디렉터리에 별도 AGENTS.md가 있다면 해당 디렉터리에서는 더 구체적인 하위 규칙을 함께 적용한다.

2. Instruction Priority
작업 지침은 다음 우선순위로 해석한다.

현재 사용자 요청

저장소 루트의 AGENTS.md

작업 영역의 현재 규칙 문서

현재 아키텍처·디자인·운영 문서

docs/archive의 과거 기록

docs/archive는 설계 및 작업 이력을 보존하는 자료다. 현재 구현 지침이나 Source of Truth로 사용하지 않는다.

지침이 충돌하거나 요청 범위가 모호하면 임의로 넓히지 말고 사용자에게 확인한다.

3. Source of Truth
기존 Repository 코드와 현재 API 계약을 가장 우선한다.

Entity와 실제 PostgreSQL Schema가 다르면 차이를 보고하고 임의로 Schema를 맞추지 않는다.

운영 환경은 실제 Compose, Nginx 및 외부 환경변수 구성과 대조한다.

Frontend 공통 규칙은 다음 문서를 참고한다.

docs/frontend/CODEX_FRONTEND_RULES.md

docs/frontend/FRONTEND_DESIGN_GUIDE.md

docs/frontend/portfolio-typography-guide.md

현행 DB 구조는 docs/db/ERD.md를 참고하되, 코드 변경 시 Entity 및 실제 Schema와 함께 검증한다.

운영 및 배포 작업은 docs/operations/DEPLOYMENT.md를 참고한다.

README는 공개 프로젝트 소개이며 내부 작업 규칙을 대신하지 않는다.

참조 문서가 실제 코드와 다르면 코드와 검증된 운영 상태를 기준으로 차이를 보고하고 문서 갱신을 별도 범위로 제안한다.

4. Working Principles
요청을 시작하기 전에 git status --short --branch와 관련 Diff를 확인한다.

사용자의 기존 변경사항을 보존한다.

요청과 무관한 파일을 수정하지 않는다.

가장 작은 파일 집합으로 문제를 해결한다.

확인되지 않은 API, 필드, 경로, 데이터 또는 환경변수를 추측해서 추가하지 않는다.

관련 코드와 타입 관계가 확인되면 반복적으로 저장소 전체를 스캔하지 않는다.

자동으로 다음 단계나 별도 개선 작업까지 진행하지 않는다.

작업 범위를 확대해야 하면 이유와 영향을 먼저 설명하고 사용자에게 확인한다.

큰 작업은 단계별로 나누고 각 단계가 검증 가능한 상태가 되도록 한다.

Context가 커지면 현재 범위를 완료하고 변경사항·검증 결과·남은 작업을 보고한다.

5. Must Preserve
명시적 변경 요청이 없다면 다음 항목을 유지한다.

Pretendard 및 기존 Font Import·Family 설정

MainLayout과 React Router Outlet 구조

Header와 Footer의 현재 책임

기존 API URL, Request·Response 계약과 TypeScript 타입

Loading 및 Error 처리

프로젝트 공개·정렬 정책

프로젝트 이미지 URL과 Fallback 정책

프로젝트 상세 Route와 외부 링크 동작

관리자 Session 인증 흐름

CSRF Token 발급 및 변경 요청 검증

PostgreSQL 데이터 영속성

uploads Host Bind Mount 구조

기존 파일 Header, Naming Convention과 CSS Module 방식

TypeScript Type Safety

6. Prohibited Actions
명시적 요청과 안전 검증 없이 다음 작업을 하지 않는다.

Backend Controller, Service, Repository, Entity, DTO 또는 DB Schema 변경

기존 API 계약 변경

실제 API 데이터를 Mock 또는 Hardcoded 데이터로 대체

실제 이미지를 CSS Mock Image나 임의의 Placeholder로 교체

TypeScript에서 any 사용

href="#" 추가

새 Package 또는 Dependency 설치

HomePage 등에 Header·Footer 중복 구현

요청과 무관한 Cleanup 또는 Refactoring

운영 .env의 실제 값 읽기·출력·Commit

SSH 개인키, PEM, 인증서 Private Key 읽기·출력·Commit

DB Dump, 운영 Backup 또는 uploads를 Git에 추가

사용자 요청 없이 Branch 전환, Commit, Push, Merge 또는 History Rewrite

검증 실패 상태를 완료로 보고

운영 데이터 삭제 또는 초기화

자동으로 다음 구현 단계 진행

7. Frontend Rules
React와 TypeScript의 기존 Component 책임을 유지한다.

API Response Type을 확인하고 임의의 Optional Field를 만들지 않는다.

Component State와 Server State의 역할을 구분한다.

관리자 변경 요청에는 기존 apiFetch 및 CSRF 처리 흐름을 유지한다.

CSS 변경은 가능한 경우 해당 CSS Module에 한정한다.

DOM이나 콘텐츠 구조가 바뀌어야 할 때만 TSX를 수정한다.

반응형 구간과 기존 Breakpoint를 먼저 확인한다.

Desktop 수정 후 Tablet과 Mobile Overflow를 함께 확인한다.

실제 Project·About·Contact·Research API 데이터를 유지한다.

Rich Text는 기존 Tiptap 입력 구조와 사용자 출력 방식을 유지한다.

외부 링크에는 기존 새 창·보안 속성 정책을 유지한다.

접근 가능한 Label, Button 및 Link 의미를 훼손하지 않는다.

8. Backend Rules
기존 Domain Package 구조와 Layer 책임을 유지한다.

Controller는 HTTP 요청·응답, Service는 Business Logic, Repository는 Persistence 책임을 유지한다.

Entity를 API Response로 직접 노출하지 않는다.

Transaction 경계와 파일 작업 시점을 함께 검토한다.

JPA 연관관계, Cascade 및 Orphan Removal을 DB의 ON DELETE 동작과 혼동하지 않는다.

ddl-auto: update에 의존한 광범위한 Schema 변경을 하지 않는다.

인증 오류는 인증 실패와 계정 상태를 구분해서 진단한다.

관리자 비밀번호는 평문으로 저장하거나 로그에 출력하지 않는다.

초기 관리자 환경변수는 계정 Bootstrap 용도로만 사용한다.

존재하는 관리자 계정의 비밀번호나 활성 상태를 시작 시 임의로 변경하지 않는다.

API 오류를 공통 응답 정책과 현재 HTTP Status 기준에 맞춰 처리한다.

9. Authentication and Security
관리자 인증은 HttpSession 기반이다.

Spring Security의 관리자 Endpoint 보호를 유지한다.

Frontend 인증 요청의 Cookie 전달 설정을 유지한다.

상태 변경 요청은 CSRF Token을 포함해야 한다.

인증되지 않은 관리자 요청은 현재 401 Unauthorized 정책을 유지한다.

관리자 권한 저장값 ADMIN과 Spring Security 권한 ROLE_ADMIN의 차이를 유지한다.

Bootstrap 비밀번호를 코드, README, Test Fixture 또는 운영 로그에 추가하지 않는다.

Secret을 예시로 작성할 때는 실제 값이 아닌 Placeholder만 사용한다.

10. Database Rules
PostgreSQL 데이터는 Docker Named Volume에 저장한다.

PK Sequence 및 Identity 상태를 고려한다.

운영 데이터 복원 전 현재 DB를 먼저 Backup한다.

Migration Dump와 Disaster Recovery Backup의 목적을 구분한다.

Schema 문서 작성 시 Entity만으로 물리 제약조건을 추측하지 않는다.

정확한 Physical Schema는 pg_dump --schema-only 결과와 대조한다.

DB 변경 시 PK, FK, UNIQUE, CHECK, INDEX, NULL, DEFAULT와 삭제 정책을 확인한다.

운영 관리자 계정을 유지해야 하는 Data Migration에서는 admin_users 처리 방식을 명시한다.

데이터 삭제, Table 초기화 또는 Volume 삭제는 별도 사용자 승인 없이는 수행하지 않는다.

11. Upload and File Lifecycle Rules
운영 Upload Root는 Source Tree 외부의 Host Bind Mount다.

Project Image, Profile Image, Skill Logo 및 Resume의 기존 저장 경로 규칙을 유지한다.

파일 확장자, URL Prefix 및 저장 경로 검증을 우회하지 않는다.

업로드 파일명 충돌 방지를 위한 UUID 정책을 유지한다.

DB 반영 전 업로드된 임시 파일과 DB 참조 파일을 구분한다.

DB Transaction 실패 시 파일과 데이터의 불일치 가능성을 확인한다.

삭제는 DB 참조 여부와 Transaction 완료 시점을 고려한다.

Orphan Cleanup Scheduler가 참조 중인 파일을 삭제하지 않도록 대상 범위를 확인한다.

Container 재생성 후에도 uploads가 유지되는지 Bind Mount를 확인한다.

파일 권한 변경은 Backend Container 실행 사용자와 읽기·쓰기 요구사항을 확인한 뒤 수행한다.

12. Docker and Deployment Safety
Compose 명령은 대상 Compose 파일과 환경파일을 명확히 확인한 후 실행한다.

Production에서는 실행 전에 docker compose config --quiet로 구성을 검증한다.

Backend와 PostgreSQL 포트를 외부에 직접 공개하지 않는다.

Frontend의 Loopback Binding과 Host Nginx 단일 진입점 구조를 유지한다.

Nginx 변경 후 sudo nginx -t를 먼저 실행한다.

HTTPS 변경 후 인증서 상태와 Redirect를 확인한다.

배포 전 PostgreSQL과 uploads Backup 여부를 확인한다.

Named Volume을 삭제하는 다음 명령을 실행하지 않는다.

docker compose down -v
Volume, Upload Path, Compose Project Name 또는 PostgreSQL Version 변경은 데이터 이전 계획 없이 진행하지 않는다.

Container를 재생성할 때 DB와 uploads의 영속성을 먼저 확인한다.

운영 장애 진단은 DNS → HTTPS → Host Nginx → Frontend → Backend → DB → uploads 순서로 범위를 좁힌다.

13. Documentation Rules
현재 적용 문서와 과거 기록을 구분한다.

현재 문서는 목적에 따라 architecture, db, development, frontend, operations에 둔다.

초기 계획과 완료된 과정 문서는 docs/archive에 보존한다.

docs/archive의 내용은 현재 동작을 증명하는 자료로 사용하지 않는다.

파일을 이동할 때 README, AGENTS 및 다른 문서의 상대경로를 함께 검색한다.

문서에 실제 Password, Token, IP, Private Key 또는 .env 값을 기록하지 않는다.

README에는 채용 담당자가 이해할 프로젝트 목적, 핵심 기능, 기술적 의사결정과 검증 결과를 우선한다.

운영 상세 명령과 복구 절차는 docs/operations에 둔다.

ERD는 논리 관계와 실제 DB 제약조건을 구분해서 설명한다.

문서만 변경했다면 Code Build는 필수가 아니지만 Markdown Link, Mermaid, Encoding 및 git diff --check를 검증한다.

14. Validation
변경 영역에 맞는 최소 검증을 수행한다.

Frontend
cd frontend
npm run build
npm run lint
Lint Script가 없거나 기존 오류가 있으면 새 오류와 분리하여 보고한다.

변경한 화면의 Desktop, Tablet 및 Mobile Overflow를 확인한다.

Backend
cd backend
./mvnw test
Backend 구조 또는 설정 변경 시 필요한 경우 ./mvnw clean verify를 사용한다.

Test 실패 원인을 기존 실패와 신규 실패로 구분한다.

Docker Compose
docker compose config --quiet
docker compose ps
Documentation
git diff --check
git status --short
이동된 문서의 이전 경로 참조를 rg로 검색한다.

README와 문서의 상대경로가 실제 파일을 가리키는지 확인한다.

Mermaid Block의 Fence와 문법을 확인한다.

15. Git and Checkpoint Rules
Git Commit은 검증된 Checkpoint로 취급한다.

작업 전에 현재 Branch, Status 및 관련 Diff를 확인한다.

새 작업은 최신 기준 Branch에서 목적이 명확한 Topic Branch로 진행한다.

사용자의 Uncommitted Change를 덮어쓰거나 되돌리지 않는다.

하나의 Commit은 하나의 설명 가능한 목적을 갖게 한다.

문서 이동과 대규모 내용 갱신은 가능하면 검토 가능한 단위로 나눈다.

중단된 작업을 보존해야 할 때만 명확한 WIP·Checkpoint Commit을 사용한다.

사용자 요청 없이 Commit, Push, PR 생성 또는 Merge를 수행하지 않는다.

Rebase, Reset, Force Push 등 History 변경 작업은 명시적 승인 없이 수행하지 않는다.

16. Completion Report
작업 완료 시 다음 내용을 보고한다.

변경한 파일

변경 이유

유지한 기존 동작

실행한 검증 명령과 결과

실행하지 못한 검증과 이유

남아 있는 TODO 또는 Risk

Git Status

완료 보고 전에 변경 범위가 사용자 요청을 넘지 않았는지 다시 확인한다.