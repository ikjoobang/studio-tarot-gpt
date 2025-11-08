# 🔮 시작하기 - AI 타로 상담 서비스

환영합니다! 이 문서는 가장 먼저 읽어야 하는 시작 가이드입니다.

---

## 📦 포함된 내용

이 ZIP 파일에는 완전히 작동하는 AI 타로 웹서비스가 들어있습니다:

### ✨ 핵심 기능
- 🎴 3가지 타로 리딩 방식 (원카드, 쓰리카드, 파이브카드)
- 🤖 GPT-3.5 AI 기반 심층 해석
- 🌙 다크모드 + 라이트모드
- 📱 모바일/PC 반응형 디자인
- ✨ 오늘의 운세
- 💬 공유 기능

### 📂 파일 구조
```
tarot-gpt-service/
├── 📄 START-HERE.md       ← 지금 읽는 파일
├── 📄 README.md           ← 상세 설명서
├── 📄 DEPLOYMENT.md       ← 배포 가이드 (단계별)
├── 📄 package.json        ← 프로젝트 설정
├── 📄 .env.example        ← 환경 변수 템플릿
├── 📄 server.js           ← 백엔드 서버
├── 📁 public/             ← 프론트엔드 파일
│   ├── index.html         ← 메인 페이지
│   ├── styles.css         ← 디자인 (2025 트렌드)
│   └── app.js             ← 앱 로직
├── 📁 cards/              ← 타로 카드 이미지 (78장)
└── 📁 assets/             ← 카드 데이터
```

---

## 🚀 3단계로 시작하기

### 1단계: 필수 준비물 확인

#### ✅ 계정 준비
- **GitHub**: https://github.com (코드 저장용)
  - 계정: `ikjoobang@gmail.com`
- **OpenAI**: https://platform.openai.com (AI 엔진)
  - API 키 필요 (GPT-3.5 사용)
- **배포 플랫폼** (아래 중 택1):
  - Netlify: https://netlify.com (추천 - 쉬움)
  - Vercel: https://vercel.com
  - Railway: https://railway.app

#### 💰 예상 비용
- **OpenAI API**: 1000회 리딩당 약 $1-3 (매우 저렴)
- **호스팅**: 무료 ~ $5/월
- **총 예상**: 월 $5-10

### 2단계: OpenAI API 키 받기

1. https://platform.openai.com 로그인
2. 우측 상단 "API keys" 클릭
3. "Create new secret key" 클릭
4. 이름 입력: `tarot-service`
5. **중요**: 생성된 키를 복사해서 안전하게 보관
   - 형식: `sk-...` (절대 공개하지 마세요!)
6. 결제 정보 등록 필요 (사용한 만큼만 청구)

### 3단계: 배포하기

**가장 쉬운 방법**: Netlify + Railway 조합

#### A. GitHub에 업로드
1. https://github.com 로그인
2. 새 저장소 만들기: `tarot-gpt-service`
3. 이 ZIP 파일의 모든 내용 업로드

#### B. Netlify 배포 (프론트엔드)
1. https://netlify.com 로그인
2. "Import from Git" 클릭
3. GitHub 저장소 선택
4. Publish directory: `public`
5. 배포 완료!

#### C. Railway 배포 (백엔드)
1. https://railway.app 로그인
2. "New Project" → "Deploy from GitHub"
3. 저장소 선택
4. 환경 변수 추가:
   ```
   OPENAI_API_KEY = (복사한 API 키)
   PORT = 3000
   ```
5. 배포 완료!

**자세한 단계별 가이드**: `DEPLOYMENT.md` 파일 참고

---

## 📖 다음에 읽을 문서

### 1. README.md
- 전체 기능 설명
- 로컬 테스트 방법
- 커스터마이징 가이드
- 문제 해결

### 2. DEPLOYMENT.md
- 배포 플랫폼별 상세 가이드
- 스크린샷과 함께 단계별 설명
- 도메인 연결 방법
- 문제 해결

---

## 🎯 체크리스트

배포 전 확인사항:

- [ ] GitHub 계정 준비됨
- [ ] OpenAI API 키 받음
- [ ] 배포 플랫폼 계정 만듦
- [ ] `README.md` 읽음
- [ ] `DEPLOYMENT.md` 준비됨

배포 후 확인사항:

- [ ] 웹사이트가 열림
- [ ] 카드 선택이 작동함
- [ ] AI 리딩이 정상 작동함
- [ ] 모바일에서 테스트함
- [ ] 오늘의 운세 작동함

---

## 🆘 도움이 필요하신가요?

### 자주 묻는 질문

**Q: 프로그래밍을 전혀 모르는데 가능한가요?**
A: 네! `DEPLOYMENT.md`에 클릭만으로 따라할 수 있는 가이드가 있습니다.

**Q: 비용이 얼마나 드나요?**
A: 월 $5-10 정도입니다. 처음 시작은 거의 무료입니다.

**Q: API 키는 어디서 받나요?**
A: https://platform.openai.com 에서 받을 수 있습니다. (위 2단계 참고)

**Q: 배포가 안 돼요!**
A: `DEPLOYMENT.md`의 "문제 해결" 섹션을 확인하거나 이메일 주세요.

### 연락처

**이메일**: ikjoobang@gmail.com

**포함할 내용**:
- 어떤 단계에서 문제가 생겼는지
- 오류 메시지 (있다면)
- 사용 중인 플랫폼

---

## 🎨 커스터마이징

### 색상 변경
`public/styles.css` 파일에서:
```css
:root {
  --accent-primary: #6366f1;  /* 원하는 색상 코드로 변경 */
}
```

### 타로 리딩 스타일 변경
`server.js` 파일에서 `systemPrompt` 수정

### 카드 이미지 교체
`cards/` 폴더의 이미지 교체 (이름 형식 유지)

---

## 🎉 시작하기

준비되셨나요?

1. ✅ `DEPLOYMENT.md` 열기
2. ✅ 단계별로 따라하기
3. ✅ 배포 완료!
4. ✅ 서비스 시작!

**당신의 AI 타로 서비스가 곧 세상에 공개됩니다!**

---

## 📋 버전 정보

- **버전**: 1.0.0
- **생성일**: 2025년 11월 8일
- **AI 모델**: GPT-3.5-turbo
- **타로 덱**: Rider-Waite (78장)
- **UI 트렌드**: 2025 (다크모드, 글라스모피즘)

---

## 🙏 감사합니다

이 서비스를 선택해주셔서 감사합니다!

**행운과 성공을 기원합니다! 🔮✨**

---

> 💡 **팁**: 이 파일을 프린트해서 옆에 두고 작업하면 편리합니다!
