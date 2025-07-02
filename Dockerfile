# --- 빌드 스테이지 (Build Stage) ---
# Vue.js (Vite) 프로젝트를 빌드하기 위한 Node.js 환경을 사용합니다.
# 당신의 package.json에 명시된 Node.js 버전과 일치하는 것을 사용하는 것이 좋습니다.
FROM node:20-alpine AS builder

# 컨테이너 내 작업 디렉토리를 설정합니다.
WORKDIR /app

# package.json과 lock 파일을 먼저 복사하여 의존성 캐싱을 활용합니다.
# 이 파일들이 변경되지 않으면 다음 빌드 시 yarn install/npm install 단계를 건너뛸 수 있습니다.
# 이미지에서 본 것처럼 당신은 yarn.lock을 사용하고 있습니다.
COPY package.json yarn.lock ./

# Node.js 의존성을 설치합니다.
RUN yarn install

# 나머지 모든 소스 코드 (src, public, vite.config.js 등)를 컨테이너로 복사합니다.
COPY . .

# Vue (Vite) 프로젝트를 빌드합니다. 이 명령은 정적 파일(HTML, CSS, JS 등)을 생성합니다.
# package.json의 "scripts" 부분에 "build": "vite build" 와 같은 스크립트가 있을 것입니다.
# Vite는 기본적으로 'dist' 디렉토리에 빌드 결과물을 생성합니다.
# 만약 build 스크립트가 'npm run build' 라면, RUN npm run build 로 변경하세요.
RUN yarn build


# --- 서빙 스테이지 (Serve Stage) ---
# 빌드된 정적 파일을 서빙하기 위한 가벼운 웹 서버(Nginx) 이미지를 사용합니다.
FROM nginx:alpine

# Nginx의 기본 설정 파일을 제거합니다. (우리가 커스텀 설정을 사용할 것이기 때문)
RUN rm /etc/nginx/conf.d/default.conf

# Vue Router의 History Mode 등을 올바르게 처리하기 위한 Nginx 설정 파일을 복사합니다.
# 이 파일은 아래 2번 단계에서 생성해야 합니다.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 스테이지에서 생성된 Vue 프로젝트의 빌드 결과물(정적 파일)을 Nginx의 웹 루트 디렉토리로 복사합니다.
# Vite는 기본적으로 'dist' 폴더에 빌드 결과물을 만듭니다.
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx가 사용할 포트(기본 80)를 외부에 노출합니다.
EXPOSE 80

# 컨테이너가 시작될 때 Nginx 웹 서버를 실행하도록 명령을 설정합니다.
CMD ["nginx", "-g", "daemon off;"]
