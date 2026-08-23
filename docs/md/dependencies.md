# Backend Dependencies 정리

> 프로젝트: Hyejin Portfolio Backend  
> 위치: `backend/pom.xml`  
> 목적: Spring Boot 백엔드 프로젝트에서 사용하는 Maven 의존성의 역할을 정리한다.  
> 기준: React + Spring Boot + PostgreSQL 기반 개인 포트폴리오 CMS 프로젝트

---

## 01. 이 문서의 목적

이 문서는 `backend/pom.xml`에 포함된 주요 의존성의 역할을 정리하기 위한 문서이다.

`pom.xml`에는 프로젝트 실행과 빌드에 필요한 라이브러리들이 선언되어 있으며, Maven은 이 파일을 기준으로 필요한 의존성을 다운로드하고 프로젝트를 빌드한다.

이번 포트폴리오 프로젝트는 다음 구조를 목표로 한다.

```txt
React Frontend
↓
Spring Boot REST API
↓
Spring Data JPA
↓
PostgreSQL
```

따라서 백엔드의 핵심 의존성은 다음 목적을 가진다.

```txt
1. REST API 서버 구현
2. Entity 기반 DB 연동
3. PostgreSQL 연결
4. 요청값 검증
5. 반복 코드 감소
6. 개발 편의성 향상
7. 테스트 및 빌드 지원
```

---

## 02. pom.xml 기본 구조

`pom.xml`은 대략 아래 구조로 구성된다.

```xml
<project>
    <modelVersion>...</modelVersion>

    <parent>
        ...
    </parent>

    <groupId>...</groupId>
    <artifactId>...</artifactId>
    <version>...</version>
    <name>...</name>

    <properties>
        ...
    </properties>

    <dependencies>
        ...
    </dependencies>

    <build>
        ...
    </build>
</project>
```

주요 확인 위치는 다음과 같다.

| 구역 | 역할 |
|---|---|
| `<parent>` | Spring Boot 기본 설정 상속 |
| `<groupId>` | 프로젝트 조직/패키지 식별자 |
| `<artifactId>` | Maven 프로젝트 식별자 |
| `<properties>` | Java 버전 등 공통 속성 |
| `<dependencies>` | 프로젝트에서 사용할 라이브러리 선언 |
| `<build>` | Maven 빌드/실행 플러그인 설정 |

---

## 03. 프로젝트 기본 정보

### 03-1. groupId

```xml
<groupId>com.hyejin</groupId>
```

`groupId`는 프로젝트의 조직 또는 패키지 식별자 역할을 한다. Java package 구조와 맞추는 경우가 많다.

현재 프로젝트의 기본 패키지는 다음과 같다.

```txt
com.hyejin.portfolio
```

### 03-2. artifactId

```xml
<artifactId>portfolio</artifactId>
```

`artifactId`는 Maven에서 이 프로젝트를 식별하는 이름이다. 빌드 결과물의 이름에도 영향을 준다.

예를 들어 Maven으로 빌드하면 다음과 같은 jar 파일명이 생성될 수 있다.

```txt
portfolio-0.0.1-SNAPSHOT.jar
```

### 03-3. version

```xml
<version>0.0.1-SNAPSHOT</version>
```

`version`은 현재 프로젝트의 버전을 의미한다. `SNAPSHOT`은 아직 정식 배포 버전이 아니라 개발 중인 버전이라는 의미이다.

### 03-4. name

```xml
<name>backend</name>
```

`name`은 프로젝트 표시 이름이다. 현재 백엔드 프로젝트 이름은 `backend`이다.

Spring Boot 애플리케이션 진입점 파일도 프로젝트명 기준으로 생성되어 현재는 다음 파일이 생성되어 있다.

```txt
BackendApplication.java
```

---

## 04. Java 버전 설정

### 04-1. java.version

```xml
<properties>
    <java.version>17</java.version>
</properties>
```

또는 JDK 21을 사용하는 경우 다음처럼 되어 있을 수 있다.

```xml
<properties>
    <java.version>21</java.version>
</properties>
```

`java.version`은 Spring Boot 프로젝트를 컴파일하고 실행할 Java 버전을 지정한다.

주의할 점은 이 값과 IntelliJ의 Project SDK가 맞아야 한다는 것이다. 예를 들어 `pom.xml`의 Java 버전이 17이면 IntelliJ Project SDK도 JDK 17 이상으로 설정되어 있어야 한다.

현재 IntelliJ에 다음 경고가 뜬다면 JDK 설정이 필요하다.

```txt
Project JDK is not defined
```

이 경우 IntelliJ에서 다음 경로로 설정한다.

```txt
File
→ Project Structure
→ Project
→ SDK 선택
```

---

## 05. Spring Web

### 05-1. 의존성

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### 05-2. 역할

`Spring Web`은 REST API 서버를 만들기 위한 핵심 의존성이다.

이 의존성을 통해 다음 기능을 사용할 수 있다.

```txt
@RestController
@RequestMapping
@GetMapping
@PostMapping
@PutMapping
@DeleteMapping
@RequestBody
@PathVariable
@RequestParam
```

### 05-3. 이번 프로젝트에서의 사용 목적

이번 포트폴리오 프로젝트는 React 프론트엔드와 Spring Boot 백엔드를 분리해서 개발한다.

따라서 프론트엔드는 백엔드 API를 호출하고, 백엔드는 JSON 데이터를 반환하는 구조가 된다.

예상 API 예시는 다음과 같다.

```txt
GET /api/projects
GET /api/projects/{slug}
POST /api/admin/projects
PUT /api/admin/projects/{id}
DELETE /api/admin/projects/{id}
```

이런 REST API를 만들기 위해 `spring-boot-starter-web`이 필요하다.

---

## 06. Spring Data JPA

### 06-1. 의존성

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

### 06-2. 역할

`Spring Data JPA`는 Entity 기반으로 DB 테이블을 매핑하고, Repository 인터페이스를 통해 CRUD를 쉽게 처리하기 위한 의존성이다.

이 의존성을 사용하면 다음 기능을 사용할 수 있다.

```txt
@Entity
@Id
@GeneratedValue
@Column
@ManyToOne
@OneToMany
JpaRepository
@Transactional
```

### 06-3. 이번 프로젝트에서의 사용 목적

이번 포트폴리오 사이트는 파이널 프로젝트처럼 Entity 중심 구조로 개발한다.

주요 Entity는 다음과 같이 설계한다.

```txt
ProjectEntity
ProjectTechEntity
ProjectImageEntity
ProjectSectionEntity
AdminUserEntity
```

각 Entity는 DB 테이블과 매핑되며, Repository를 통해 데이터를 조회/저장/수정/삭제한다.

예상 Repository 예시는 다음과 같다.

```java
public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {
    Optional<ProjectEntity> findBySlugAndIsPublishedTrue(String slug);
}
```

### 06-4. 주의사항

`Spring Data JPA`를 추가하면 Spring Boot는 애플리케이션 실행 시 DB 연결 정보를 찾으려고 한다.

따라서 `application.properties` 또는 `application.yml`에 datasource 설정이 없으면 다음과 같은 오류가 발생할 수 있다.

```txt
Failed to configure a DataSource
```

이 오류는 프로젝트 생성 실패가 아니라 DB 연결 설정이 아직 없다는 뜻이다.

---

## 07. PostgreSQL Driver

### 07-1. 의존성

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 07-2. 역할

`PostgreSQL Driver`는 Spring Boot 애플리케이션이 PostgreSQL DB에 접속할 수 있도록 해주는 JDBC 드라이버이다.

Spring Boot와 JPA가 DB에 접근하려면 DB 종류에 맞는 JDBC 드라이버가 필요하다. 이번 프로젝트의 DB는 PostgreSQL이므로 `postgresql` 의존성이 필요하다.

### 07-3. scope가 runtime인 이유

```xml
<scope>runtime</scope>
```

`runtime`은 컴파일 시점보다 애플리케이션 실행 시점에 필요한 의존성이라는 의미이다.

PostgreSQL 드라이버는 Java 코드에서 직접 import해서 사용하는 라이브러리라기보다, 애플리케이션이 실행되며 DB에 접속할 때 필요한 드라이버이다.

### 07-4. 주의사항

이 의존성만 있다고 DB 연결이 되는 것은 아니다.

아래와 같은 datasource 설정이 필요하다.

```yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/portfolio_db
    username: postgres
    password: 비밀번호
    driver-class-name: org.postgresql.Driver
```

그리고 PostgreSQL에 `portfolio_db` 데이터베이스가 실제로 생성되어 있어야 한다.

---

## 08. Lombok

### 08-1. 의존성

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

### 08-2. 역할

`Lombok`은 반복되는 Java 코드를 줄이기 위한 의존성이다.

주로 다음 어노테이션을 사용한다.

```txt
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RequiredArgsConstructor
```

### 08-3. 이번 프로젝트에서의 사용 목적

이번 프로젝트에서는 다음 계층에서 Lombok을 사용할 예정이다.

```txt
Entity
DTO
Service
Controller
```

예를 들어 Entity에서는 다음처럼 사용할 수 있다.

```java
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ProjectEntity {
    ...
}
```

Service에서는 생성자 주입을 위해 다음 어노테이션을 사용할 수 있다.

```java
@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
}
```

### 08-4. optional이 true인 이유

```xml
<optional>true</optional>
```

Lombok은 컴파일 시점에 getter, builder, 생성자 등의 코드를 만들어주는 도구 성격이 강하다. 즉, 실제 런타임 배포물에 반드시 포함될 필요가 없다.

### 08-5. IntelliJ 설정 주의

IntelliJ에서 Lombok이 정상 동작하지 않으면 다음 설정을 확인해야 한다.

```txt
Settings
→ Build, Execution, Deployment
→ Compiler
→ Annotation Processors
→ Enable annotation processing 체크
```

또한 IntelliJ에서 Lombok Plugin이 필요한 경우도 있다.

---

## 09. Spring Validation

### 09-1. 의존성

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### 09-2. 역할

`Spring Validation`은 요청 DTO의 입력값을 검증하기 위한 의존성이다.

주로 다음 어노테이션을 사용한다.

```txt
@NotBlank
@NotNull
@Size
@Email
@Positive
@Pattern
```

### 09-3. 이번 프로젝트에서의 사용 목적

관리자 페이지에서 프로젝트를 등록하거나 수정할 때 입력값 검증이 필요하다.

예를 들어 다음 값들은 검증 대상이 된다.

```txt
프로젝트명은 비어 있으면 안 됨
slug는 비어 있으면 안 됨
summary는 비어 있으면 안 됨
projectType은 null이면 안 됨
sectionType은 null이면 안 됨
공개 여부는 null이면 안 됨
```

예상 RequestDto 예시는 다음과 같다.

```java
@Getter
public class ProjectCreateRequestDto {

    @NotBlank
    private String title;

    @NotBlank
    private String slug;

    @NotBlank
    private String summary;

    @NotNull
    private ProjectType projectType;

    @NotNull
    private SectionType sectionType;
}
```

Controller에서는 다음처럼 사용할 수 있다.

```java
@PostMapping("/api/admin/projects")
public void createProject(@Valid @RequestBody ProjectCreateRequestDto requestDto) {
    ...
}
```

---

## 10. Spring Boot DevTools

### 10-1. 의존성

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

### 10-2. 역할

`Spring Boot DevTools`는 개발 편의 기능을 제공하는 의존성이다.

주요 목적은 다음과 같다.

```txt
코드 변경 시 빠른 재시작 지원
개발 환경에서 캐시 비활성화
로컬 개발 생산성 향상
```

### 10-3. 이번 프로젝트에서의 사용 목적

이번 프로젝트에서는 로컬 개발 중 코드를 수정하고 서버를 자주 재실행하게 된다. DevTools를 사용하면 개발 중 반복 작업을 줄이는 데 도움이 된다.

### 10-4. scope가 runtime인 이유

```xml
<scope>runtime</scope>
```

DevTools는 컴파일 시점보다 애플리케이션 실행 시점에 필요한 개발 도구이다.

### 10-5. optional이 true인 이유

```xml
<optional>true</optional>
```

DevTools는 운영 배포물에 포함하지 않는 것이 일반적이다. 따라서 개발 환경에서만 사용하는 의존성으로 보는 것이 좋다.

---

## 11. Spring Boot Test

### 11-1. 의존성

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

### 11-2. 역할

`Spring Boot Test`는 테스트 코드 작성을 위한 의존성이다.

주로 다음 테스트에 사용한다.

```txt
단위 테스트
통합 테스트
Service 테스트
Repository 테스트
Controller 테스트
```

### 11-3. scope가 test인 이유

```xml
<scope>test</scope>
```

이 의존성은 실제 애플리케이션 실행 시 사용하는 것이 아니라 테스트 코드 실행 시에만 필요하다.

### 11-4. 이번 프로젝트에서의 사용 목적

포트폴리오 프로젝트에서도 최소한 다음 테스트를 추가하면 백엔드 완성도를 높일 수 있다.

```txt
ProjectService 테스트
ProjectRepository 테스트
ProjectController 테스트
Admin 로그인 검증 테스트
```

신입 포트폴리오에서 테스트 코드가 일부라도 포함되어 있으면 백엔드 구조 이해도를 보여주기 좋다.

---

## 12. Spring Boot Maven Plugin

### 12-1. 플러그인

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

### 12-2. 역할

`Spring Boot Maven Plugin`은 Maven으로 Spring Boot 애플리케이션을 실행하거나 배포 가능한 jar 파일로 빌드하기 위한 플러그인이다.

주요 명령어는 다음과 같다.

```bash
./mvnw spring-boot:run
./mvnw clean package
```

Windows PowerShell에서는 다음처럼 실행할 수 있다.

```powershell
.\mvnw.cmd spring-boot:run
.\mvnw.cmd clean package
```

### 12-3. 이번 프로젝트에서의 사용 목적

나중에 EC2 + Docker 배포를 진행할 때 Spring Boot 애플리케이션을 jar 파일로 빌드해야 한다.

예상 흐름은 다음과 같다.

```txt
Maven package
↓
jar 파일 생성
↓
Docker image build
↓
EC2 컨테이너 실행
```

따라서 `spring-boot-maven-plugin`은 빌드와 배포 단계에서 중요하다.

---

## 13. Lombok 배포 제외 설정

Spring Initializr로 생성한 프로젝트에는 `spring-boot-maven-plugin` 내부에 Lombok 제외 설정이 들어갈 수 있다.

### 13-1. 예시

```xml
<configuration>
    <excludes>
        <exclude>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </exclude>
    </excludes>
</configuration>
```

### 13-2. 역할

Lombok은 컴파일 시점에 getter, builder, 생성자 등의 코드를 만들어주는 도구이다.

런타임 실행에 직접 필요한 라이브러리가 아니므로, 최종 빌드 산출물 jar에 포함하지 않도록 제외할 수 있다.

이 설정이 있어도 정상이며, 지우지 않는다.

---

## 14. 현재 pom.xml에서 확인해야 할 키워드

`pom.xml`에서 아래 키워드를 검색해 의존성이 포함되어 있는지 확인한다.

```txt
java.version
spring-boot-starter-web
spring-boot-starter-data-jpa
postgresql
lombok
spring-boot-starter-validation
spring-boot-devtools
spring-boot-starter-test
spring-boot-maven-plugin
```

---

## 15. 의존성 요약표

| 키워드 | 이름 | 역할 | 필수 여부 |
|---|---|---|---|
| `java.version` | Java 버전 | 프로젝트 컴파일/실행 Java 버전 지정 | 필수 |
| `spring-boot-starter-web` | Spring Web | REST API 개발 | 필수 |
| `spring-boot-starter-data-jpa` | Spring Data JPA | Entity/JPA/Repository 사용 | 필수 |
| `postgresql` | PostgreSQL Driver | PostgreSQL DB 연결 | 필수 |
| `lombok` | Lombok | 반복 코드 감소 | 필수 |
| `spring-boot-starter-validation` | Spring Validation | Request DTO 입력값 검증 | 필수 |
| `spring-boot-devtools` | DevTools | 개발 편의 기능 | 권장 |
| `spring-boot-starter-test` | Spring Boot Test | 테스트 코드 작성 | 권장 |
| `spring-boot-maven-plugin` | Maven Plugin | Spring Boot 실행/빌드 | 필수 |

---

## 16. 현재 단계에서 주의할 점

### 16-1. JPA/PostgreSQL 의존성이 있으면 DB 설정이 필요하다

현재 프로젝트는 실무 흐름에 맞춰 처음부터 JPA와 PostgreSQL을 포함했다.

따라서 DB 설정 없이 백엔드를 실행하면 다음 오류가 발생할 수 있다.

```txt
Failed to configure a DataSource
```

이 오류는 백엔드 프로젝트 생성 실패가 아니라 DB 접속 정보가 아직 없다는 의미이다.

### 16-2. application.yml 설정이 필요하다

다음 단계에서는 `application.properties` 대신 `application.yml`을 사용해 설정을 정리하는 것을 권장한다.

예시:

```yml
server:
  port: 8080

spring:
  application:
    name: portfolio-backend

  datasource:
    url: jdbc:postgresql://localhost:5432/portfolio_db
    username: postgres
    password: 비밀번호
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
```

### 16-3. Spring Security는 아직 추가하지 않는다

관리자 로그인 기능이 필요하기 때문에 나중에 Spring Security가 필요할 수 있다.

하지만 초기 백엔드 실행 확인 단계에서는 추가하지 않는 것이 좋다.

Spring Security를 추가하면 기본 설정으로 모든 요청이 보호되어 `/api/health` 같은 테스트 API도 바로 막힐 수 있기 때문이다.

추가 시점은 다음이 적절하다.

```txt
1. 백엔드 기본 실행 확인
2. DB 연결 확인
3. ProjectEntity/Repository/API 구현
4. 관리자 로그인 구조 설계
5. Spring Security + JWT 추가
```

---

## 17. 실무 기준 메모

공부 단계에서는 `pom.xml`에 각 의존성의 주석을 직접 달아 이해하는 방식이 좋다.

다만 실무에서는 `pom.xml`에 모든 의존성마다 긴 주석을 다는 경우는 많지 않다.

실무에서는 보통 다음 위치에 설명을 정리한다.

```txt
README.md
docs/setup.md
docs/dependencies.md
```

따라서 지금 작성한 주석은 학습용으로 유지하되, 나중에 프로젝트를 정리할 때는 이 문서처럼 별도 문서로 분리하는 것이 좋다.

---

## 18. 다음 작업

이 문서 정리 후 다음 순서로 진행한다.

```txt
1. IntelliJ Project JDK 설정
2. Maven Load 확인
3. PostgreSQL DB 생성
4. application.yml 작성
5. /api/health 테스트 Controller 생성
6. 백엔드 실행 확인
7. backend 초기 커밋
```
