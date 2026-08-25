# ============================================================
# Frontend Dockerfile
#
# React + Vite 프로젝트를 Production Build한 뒤
# Nginx를 이용해 정적 파일을 서비스한다.
#
# 구조:
#   1단계(build)   : Node.js → npm run build
#   2단계(runtime) : Nginx → dist 제공
# ============================================================


# ------------------------------------------------------------
# 1단계: React Build
# ------------------------------------------------------------

# Node.js를 이용해 React/Vite 프로젝트를 빌드한다.
FROM node:22-alpine AS build


WORKDIR /app


# package 정보를 먼저 복사한다.
#
# package.json이 변경되지 않았다면
# npm ci 결과를 Docker cache에서 재사용할 수 있다.
COPY package.json package-lock.json ./


# package-lock.json 기준으로
# 정확히 동일한 dependency 설치
RUN npm ci


# Frontend source 전체 복사
COPY . .


# Vite Production Build
# : 결과내 dist 폴더는 RUN npm run build 시 vite가 자동 생성
# 결과: /app/dist
RUN npm run build



# ------------------------------------------------------------
# 2단계: Nginx Runtime
# ------------------------------------------------------------

# 실제 React 운영에는 Node.js가 필요하지 않다.
#
# React는 빌드가 끝나면 HTML/CSS/JS 정적 파일이기 때문이다.
FROM nginx:alpine


# 기본 Nginx 설정 대신
# 우리가 작성한 설정을 사용한다.
COPY nginx.conf /etc/nginx/conf.d/default.conf


# React Production Build 결과를
# Nginx 정적 파일 디렉터리에 복사
COPY --from=build /app/dist /usr/share/nginx/html


# Nginx HTTP Port
EXPOSE 80


# foreground로 Nginx 실행
#
# Docker Container에서는 메인 프로세스가 종료되면
# Container도 종료되므로 daemon off가 필요하다.
CMD ["nginx", "-g", "daemon off;"]