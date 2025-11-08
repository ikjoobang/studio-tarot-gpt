# 🔮 AI 타로 상담 서비스

GPT-3.5를 활용한 전문 타로 리딩 웹 서비스입니다.

---

## ✨ 주요 기능

### 🎴 다양한 리딩 방식
- **원 카드**: 핵심 메시지 확인
- **쓰리 카드**: 과거-현재-미래 통찰 (추천)
- **파이브 카드**: 상세한 분석

### 🤖 AI 기반 해석
- GPT-3.5-turbo 모델 사용 (비용 효율적)
- 깊이 있고 실용적인 조언
- 카드 상징과 심리학적 통찰 결합

### 🌙 2025 트렌드 UI/UX
- 다크모드 기본 지원
- 모바일 최적화 (360×780pt)
- SF Pro 폰트 적용
- 글라스모피즘 디자인
- 부드러운 애니메이션

### ✨ 추가 기능
- 오늘의 운세
- 카드 공유하기
- 반응형 디자인
- 직관적인 UX

---

## 📦 포함 파일

```
tarot-gpt-service/
├── server.js              # Node.js 백엔드 서버
├── package.json           # 의존성 관리
├── .env.example           # 환경 변수 템플릿
├── README.md              # 이 파일
├── DEPLOYMENT.md          # 배포 가이드
├── public/
│   ├── index.html         # 메인 HTML
│   ├── styles.css         # 스타일시트
│   └── app.js             # 프론트엔드 로직
├── cards/                 # 타로 카드 이미지 (78장)
│   ├── m00.jpg ~ m21.jpg  # 메이저 아르카나
│   └── c01.jpg ~ p14.jpg  # 마이너 아르카나
└── assets/
    └── tarot.json         # 카드 데이터
```

---

## 🚀 빠른 시작 (로컬 테스트)

### 1. 필수 요구사항
- Node.js 18.0 이상
- OpenAI API 키 (GPT-3.5-turbo)

### 2. 설치

```bash
# 의존성 설치
npm install
```

### 3. 환경 설정

```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 수정 (메모장으로 열기)
notepad .env
```

`.env` 파일에 OpenAI API 키 입력:
```
OPENAI_API_KEY=sk-your-api-key-here
PORT=3000
NODE_ENV=production
SERVICE_EMAIL=ikjoobang@gmail.com
```

### 4. 서버 실행

```bash
npm start
```

### 5. 브라우저에서 열기
```
http://localhost:3000
```

---

## 🌐 배포 방법

### 옵션 1: Netlify (추천 - 가장 쉬움)

#### 준비사항
- GitHub 계정 (ikjoobang@gmail.com)
- Netlify 계정 (ikjoobang@gmail.com)

#### 단계
1. **GitHub에 업로드**
   - https://github.com 로그인
   - "New repository" 클릭
   - 이름: `tarot-gpt-service`
   - Public 선택
   - 생성 후 이 폴더를 업로드

2. **Netlify 연결**
   - https://netlify.com 로그인
   - "Add new site" → "Import an existing project"
   - GitHub 연결
   - `tarot-gpt-service` 저장소 선택

3. **빌드 설정**
   - Build command: `npm install`
   - Publish directory: `public`
   - Functions directory: (비워둠)

4. **환경 변수 설정**
   - Site settings → Environment variables
   - `OPENAI_API_KEY` 추가
   - 값: 당신의 OpenAI API 키

5. **배포**
   - "Deploy site" 클릭
   - 자동으로 빌드 & 배포됨

⚠️ **중요**: Netlify는 정적 사이트 호스팅이므로, 백엔드 서버는 별도로 배포해야 합니다.

### 옵션 2: Vercel (쉬움)

#### 단계
1. **GitHub 업로드** (위와 동일)

2. **Vercel 연결**
   - https://vercel.com 로그인
   - "Add New" → "Project"
   - GitHub 저장소 선택

3. **환경 변수 설정**
   - `OPENAI_API_KEY` 추가

4. **배포**
   - 자동 빌드 & 배포

### 옵션 3: Railway (서버 + DB 지원)

#### 단계
1. **GitHub 업로드** (위와 동일)

2. **Railway 프로젝트 생성**
   - https://railway.app 로그인
   - "New Project"
   - "Deploy from GitHub repo"
   - 저장소 선택

3. **환경 변수 설정**
   - Variables 탭
   - `OPENAI_API_KEY` 추가
   - `PORT` = 3000

4. **배포**
   - 자동으로 배포됨
   - 도메인 생성됨

---

## 📝 자세한 배포 가이드

각 플랫폼별 상세 가이드는 `DEPLOYMENT.md`를 참고하세요.

**프로그래밍 경험이 없으시다면:**
- **Netlify + Railway 조합을 추천합니다**
- Netlify: 프론트엔드 (HTML, CSS, JS)
- Railway: 백엔드 서버 (Node.js)

---

## 💰 비용 예상

### OpenAI API (GPT-3.5-turbo)
- 입력: $0.50 / 1M 토큰
- 출력: $1.50 / 1M 토큰
- 1회 리딩당 약 $0.001-0.003 (매우 저렴)
- 1000회 리딩 ≈ $1-3

### 호스팅
- **Netlify**: 무료 (월 100GB 대역폭)
- **Vercel**: 무료 (취미 프로젝트)
- **Railway**: $5/월 (500시간 실행)

**예상 월 비용: $5-10 (사용량에 따라)**

---

## 🎨 커스터마이징

### 색상 변경
`public/styles.css`의 CSS 변수 수정:
```css
:root {
  --accent-primary: #6366f1;  /* 메인 색상 */
  --accent-secondary: #8b5cf6;
  --accent-tertiary: #ec4899;
}
```

### 프롬프트 수정
`server.js`의 systemPrompt 수정:
```javascript
const systemPrompt = `당신은 30년 경력의 전문 타로 리더입니다.
// 여기에 원하는 스타일로 수정
`;
```

### 카드 이미지 교체
`cards/` 폴더의 이미지를 교체하세요.
- 이름 형식 유지 필요: `m00.jpg`, `c01.jpg` 등

---

## 🐛 문제 해결

### 서버가 시작되지 않을 때
1. Node.js 버전 확인: `node --version` (18 이상)
2. `.env` 파일 확인
3. API 키가 올바른지 확인

### 리딩이 작동하지 않을 때
1. 브라우저 콘솔 확인 (F12)
2. OpenAI API 키 확인
3. API 할당량 확인 (https://platform.openai.com)

### 카드 이미지가 안 보일 때
1. `cards/` 폴더에 이미지가 있는지 확인
2. 파일명이 올바른지 확인

---

## 📞 지원

**개발자**: ikjoobang@gmail.com

**이슈 리포트**:
1. 어떤 문제가 발생했는지
2. 브라우저 콘솔 오류 메시지 (F12)
3. 재현 방법

---

## 📄 라이선스

MIT License - 자유롭게 사용 및 수정 가능

---

## 🙏 감사의 말

- OpenAI for GPT-3.5-turbo
- Rider-Waite Tarot Deck (Public Domain)
- Tarot JSON Dataset (MIT License)

---

## 🎉 즐거운 서비스 운영 되세요!

이 서비스는 사용자에게 깊이 있는 통찰과 따뜻한 조언을 제공하도록 설계되었습니다.

**첫 배포를 축하합니다! 🚀**
