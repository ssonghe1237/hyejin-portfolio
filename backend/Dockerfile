# ============================================================
# Backend Dockerfile
#
# Spring Boot 애플리케이션을 Docker Image로 만드는 설정
#
# Multi-stage Build 구조
#
# 1. builder
#    - Java 17 JDK 사용
#    - Maven으로 Spring Boot 프로젝트 빌드
#    - app.jar 생성
#
# 2. runtime
#    - Java 17 JRE 사용
#    - builder에서 생성한 app.jar만 가져와 실행
#
# 이렇게 분리하면 최종 운영 Image에는
# Maven, source code 등이 포함되지 않는다.
# ============================================================


# ------------------------------------------------------------
# 1단계: Build Stage
# ------------------------------------------------------------

# Spring Boot 프로젝트가 Java 17 기반이므로
# Java 17 JDK 이미지 사용
#
# JDK : 컴파일 + 실행 기능
#
# 이 단계에서는 실제 Java 코드를 컴파일해야 하기 때문에
# JRE가 아니라 JDK 가 필요하다.
FROM eclipse-temurin:17-jdk-jammy AS builder

# 컨테이너 내부 작업 디렉토리
# ** docker 기본 폴더 이름 지정
# 이후 COPY, RUN 명령은 기본적으로 /app 기준으로 실행된다.
WORKDIR /app

# Maven Wrapper 관련 파일 먼저 복사
#
# 의존성 다운로드 레이어를 최대한 재사용하기 위해
# 전체 소스보다 pom.xml을 먼저 복사한다.
# COPY : 내 컴퓨터에 있는 파일이나 폴더를 Docker 컨테이너 내부의 작업 디렉토리(WORKDIR)로 복사
COPY .mvn .mvn
COPY mvnw pom.xml ./

# Linux 컨테이너에서는 mvnw에 실행 권한이 필요하다
# : Docker 실행 시 mvnw를 함께 실행해라
#
# RUN : Docker 빌드 과정에서 리눅스 명령어 1줄을 실행하라
# chmod: Change Mode의 약자로, 리눅스 환경에서 파일이나 폴더의 읽기, 쓰기, 실행 권한을 변경하는 명렁어
# +x : 실행 권한을 추가하는 옵션
RUN chmod +x mvnw

# Maven 의존성을 먼저 다운로드한다.
# dependency:go-offline => 오프라인 상태에서도 빌드가 가능하도록 미리 전부 받아 저장소에 저장해라
#
# source code가 변경되더라도 pom.xml이 변경되지 않았다면
# Docker cache를 재사용할 수 있다.
RUN ./mvnw dependency:go-offline

# 실제 Spring Boot source code 복사
COPY src src

# Spring Boot 프로젝트 빌드
#
# 테스트는 로컬에서 이미 빌드로 수행하므로
# Docker image 생성 단계에선은 skip 한다.
#
# 이후 생성된 실행 가능한 JAR 중
# *.original 파일을 제외하고 /app/app.jar로 복사한다.
RUN ./mvnw clean package -DskipTests \
    && JAR_FILE="$(find target -maxdepth 1 -type f -name '*.jar' ! -name '*.original' | head -n 1)" \
    && test -n "$JAR_FILE" \
    && cp "$JAR_FILE" /app/app.jar
    # -> 이 단계가 끝나면 /app/app.jar 파일 생성


# ------------------------------------------------------------
# 2단계: Runtime Stage
# ------------------------------------------------------------

# 실제 서버에서는 Java 코드를 다시 컴파일할 필요가 없다.
#
# 따라서 JDK보다 가벼운 JRE만 사용한다.
FROM eclipse-temurin:17-jre-jammy AS runtime

# Spring Boot 실행 위치
WORKDIR /app



# ------------------------------------------------------------
# Upload Directory
# ------------------------------------------------------------

# Spring Boot가 관리하는 업로드 파일 저장 위치
#
# 실제 실행 시 Docker Compose의 bind mount에 의해
# Host의 ./uploads가 /app/uploads에 연결된다.
RUN mkdir -p /app/uploads/projects \
    /app/uploads/resumes \
    /app/uploads/profile \
    /app/uploads/skills


# ------------------------------------------------------------
# Build 결과 가져오기
# ------------------------------------------------------------

# Build Stage에서 만들어진 JAR만 가져온다.
#
# 소스코드, Maven, target 디렉터리 등은
# 최종 이미지에 포함되지 않는다.
COPY --from=builder /app/app.jar /app/app.jar

# Spring Boot가 사용하는 컨테이너 내부 포트
#
# 주의:
# EXPOSE는 Window/서버에 실제 포트를 공개하는 명령이 아님
# "이 컨테이너가 8081을 사용한다"는 메타데이터에 가깝다
EXPOSE 8081

# 컨테이너가 시작될 때 실행할 명령
#
# java : 설치 된 java17의 실행 프로그램을 부르는 명령
# jar : 자바 파일들을 묶어놓은 파일 본
# app.jar : 그 jar 포맷으로 만들어진 '실제 파일의 이름'
ENTRYPOINT ["java", "-jar", "app.jar"]

















