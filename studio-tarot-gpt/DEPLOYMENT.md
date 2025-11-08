# 🚀 배포 가이드 - 완전 초보자용

프로그래밍 경험이 없어도 따라할 수 있는 단계별 가이드입니다.

---

## 📋 목차

1. [GitHub 업로드](#1-github-업로드)
2. [Netlify 배포 (프론트엔드)](#2-netlify-배포)
3. [Railway 배포 (백엔드)](#3-railway-배포)
4. [Vercel 배포 (대안)](#4-vercel-배포-대안)
5. [도메인 연결](#5-도메인-연결)
6. [문제 해결](#6-문제-해결)

---

## 1. GitHub 업로드

### 1-1. GitHub 계정 준비
1. https://github.com 접속
2. 로그인: `ikjoobang@gmail.com`
3. 비밀번호 입력

### 1-2. 새 저장소 만들기
1. 우측 상단 "+" 클릭 → "New repository"
2. 정보 입력:
   - Repository name: `tarot-gpt-service`
   - Description: `AI 타로 상담 서비스`
   - Public 선택
   - ✅ Add a README file (체크 해제)
3. "Create repository" 클릭

### 1-3. 파일 업로드
1. 생성된 저장소 페이지에서 "uploading an existing file" 클릭
2. `tarot-gpt-service.zip` 파일을 드래그 & 드롭
3. 또는 폴더 안의 모든 파일 선택해서 드래그
4. 하단에 커밋 메시지 입력: "Initial commit"
5. "Commit changes" 클릭

✅ **완료**: 파일이 GitHub에 업로드되었습니다!

---

## 2. Netlify 배포

### 2-1. Netlify 계정 준비
1. https://netlify.com 접속
2. "Sign up" 클릭
3. "Sign up with GitHub" 선택
4. GitHub 계정으로 로그인 (`ikjoobang@gmail.com`)

### 2-2. 새 사이트 생성
1. 대시보드에서 "Add new site" 클릭
2. "Import an existing project" 선택
3. "GitHub" 클릭
4. GitHub 연결 허용
5. `tarot-gpt-service` 저장소 선택

### 2-3. 빌드 설정
1. 다음 정보 입력:
   ```
   Build command: (비워둠)
   Publish directory: public
   ```
2. "Deploy site" 클릭

### 2-4. 환경 변수 설정
1. 배포 완료 후 "Site settings" 클릭
2. 왼쪽 메뉴에서 "Environment variables" 클릭
3. "Add a variable" 클릭
4. 다음 정보 입력:
   ```
   Key: OPENAI_API_KEY
   Value: (당신의 OpenAI API 키)
   ```
5. "Create variable" 클릭

### 2-5. 도메인 확인
1. "Site overview"로 돌아가기
2. 상단에 생성된 URL 확인 (예: `amazing-site-abc123.netlify.app`)
3. 클릭해서 사이트 확인

⚠️ **주의**: Netlify는 프론트엔드만 호스팅합니다. API 서버는 Railway에서 별도 배포해야 합니다.

---

## 3. Railway 배포

### 3-1. Railway 계정 준비
1. https://railway.app 접속
2. "Start a New Project" 클릭
3. "Login with GitHub" 선택
4. GitHub 계정으로 로그인

### 3-2. 프로젝트 생성
1. "Deploy from GitHub repo" 클릭
2. "Configure GitHub App" 클릭
3. `tarot-gpt-service` 저장소 선택
4. 저장소가 목록에 나타나면 클릭

### 3-3. 환경 변수 설정
1. 배포 시작되면 프로젝트 클릭
2. "Variables" 탭 클릭
3. "New Variable" 클릭
4. 다음 변수들 추가:
   ```
   OPENAI_API_KEY = (당신의 API 키)
   PORT = 3000
   NODE_ENV = production
   SERVICE_EMAIL = ikjoobang@gmail.com
   ```

### 3-4. 도메인 확인
1. "Settings" 탭 클릭
2. "Domains" 섹션에서 생성된 URL 확인
3. 예: `tarot-gpt-service.up.railway.app`

### 3-5. API URL 연결
1. Railway 도메인 복사
2. `public/app.js` 파일에서 API URL 수정:
   ```javascript
   // 파일 상단에 추가
   const API_BASE = 'https://your-railway-domain.up.railway.app';
   
   // API 함수들 수정
   async getCards() {
     const response = await fetch(`${API_BASE}/api/cards`);
     // ...
   }
   ```

3. 수정 후 GitHub에 다시 업로드
4. Netlify가 자동으로 재배포됨

✅ **완료**: 프론트엔드(Netlify) + 백엔드(Railway) 연결 완료!

---

## 4. Vercel 배포 (대안)

Netlify + Railway 대신 Vercel만으로 모두 배포하는 방법입니다.

### 4-1. Vercel 계정 준비
1. https://vercel.com 접속
2. "Sign Up" 클릭
3. "Continue with GitHub" 선택
4. GitHub 계정으로 로그인

### 4-2. 프로젝트 생성
1. "Add New..." → "Project" 클릭
2. GitHub 저장소 연결 허용
3. `tarot-gpt-service` 선택
4. "Import" 클릭

### 4-3. 설정
1. Framework Preset: "Other" 선택
2. Build Command: (비워둠)
3. Output Directory: `public`
4. Install Command: `npm install`

### 4-4. 환경 변수
1. "Environment Variables" 섹션 펼치기
2. 추가:
   ```
   OPENAI_API_KEY = (당신의 API 키)
   ```
3. "Deploy" 클릭

### 4-5. 도메인 확인
1. 배포 완료 후 생성된 URL 클릭
2. 예: `tarot-gpt-service.vercel.app`

⚠️ **주의**: Vercel도 서버리스 함수로 백엔드를 구성해야 합니다. 초보자에게는 Railway가 더 쉽습니다.

---

## 5. 도메인 연결

### 5-1. 커스텀 도메인 구매 (선택사항)
1. https://www.namecheap.com 또는 https://www.godaddy.com
2. 원하는 도메인 검색 (예: `mytarot.com`)
3. 구매 ($10-15/년)

### 5-2. Netlify에 도메인 연결
1. Netlify 대시보드 → "Domain settings"
2. "Add custom domain" 클릭
3. 구매한 도메인 입력
4. DNS 설정 안내에 따라 진행
5. 자동으로 SSL 인증서 발급됨 (무료)

---

## 6. 문제 해결

### 문제: "Cannot GET /api/cards" 오류
**원인**: 백엔드 서버가 실행되지 않음
**해결**:
1. Railway 프로젝트 확인
2. Logs 탭에서 오류 확인
3. 환경 변수가 올바른지 확인

### 문제: "CORS" 오류
**원인**: 프론트엔드와 백엔드 도메인 불일치
**해결**:
1. `server.js`의 CORS 설정 확인:
   ```javascript
   app.use(cors({
     origin: 'https://your-netlify-domain.netlify.app'
   }));
   ```

### 문제: "OpenAI API key invalid"
**원인**: API 키가 잘못됨
**해결**:
1. https://platform.openai.com/api-keys 에서 키 확인
2. Railway/Vercel 환경 변수 다시 설정
3. 프로젝트 재배포

### 문제: 카드 이미지가 안 보임
**원인**: 이미지 경로 오류
**해결**:
1. GitHub 저장소에 `cards/` 폴더가 있는지 확인
2. 이미지 파일이 78장 모두 있는지 확인
3. 파일명이 `m00.jpg`, `c01.jpg` 형식인지 확인

---

## 📞 추가 지원이 필요하신가요?

**이메일**: ikjoobang@gmail.com

**메시지에 포함할 내용**:
1. 어떤 단계에서 막혔는지
2. 오류 메시지 스크린샷
3. 사용 중인 플랫폼 (Netlify/Railway/Vercel)

---

## 🎉 배포 완료!

축하합니다! 이제 전 세계 어디서나 당신의 AI 타로 서비스에 접속할 수 있습니다.

**다음 단계**:
1. 친구들에게 공유하기
2. SNS에 홍보하기
3. 사용자 피드백 받기
4. 서비스 개선하기

**행운을 빕니다! 🔮✨**
