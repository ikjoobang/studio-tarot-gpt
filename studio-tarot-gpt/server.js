require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS 설정 - Netlify 도메인 허용
app.use(cors({
  origin: [
    'https://studio-tarot-gpt.netlify.app',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 타로 카드 데이터 (78장 전체)
const tarotCards = [
  // 메이저 아르카나 (0-21)
  { id: 0, name: "바보(The Fool)", image: "00-fool.jpg", suit: "major", keywords: "새로운 시작, 순수함, 자유" },
  { id: 1, name: "마법사(The Magician)", image: "01-magician.jpg", suit: "major", keywords: "창조력, 의지력, 기술" },
  { id: 2, name: "여사제(The High Priestess)", image: "02-high-priestess.jpg", suit: "major", keywords: "직관, 신비, 잠재의식" },
  { id: 3, name: "여황제(The Empress)", image: "03-empress.jpg", suit: "major", keywords: "풍요, 모성, 창조성" },
  { id: 4, name: "황제(The Emperor)", image: "04-emperor.jpg", suit: "major", keywords: "권위, 구조, 안정" },
  { id: 5, name: "교황(The Hierophant)", image: "05-hierophant.jpg", suit: "major", keywords: "전통, 교육, 믿음" },
  { id: 6, name: "연인(The Lovers)", image: "06-lovers.jpg", suit: "major", keywords: "사랑, 선택, 조화" },
  { id: 7, name: "전차(The Chariot)", image: "07-chariot.jpg", suit: "major", keywords: "의지, 승리, 결단" },
  { id: 8, name: "힘(Strength)", image: "08-strength.jpg", suit: "major", keywords: "용기, 인내, 자제력" },
  { id: 9, name: "은둔자(The Hermit)", image: "09-hermit.jpg", suit: "major", keywords: "성찰, 지혜, 고독" },
  { id: 10, name: "운명의 수레바퀴(Wheel of Fortune)", image: "10-wheel-of-fortune.jpg", suit: "major", keywords: "변화, 운명, 순환" },
  { id: 11, name: "정의(Justice)", image: "11-justice.jpg", suit: "major", keywords: "균형, 진실, 공정" },
  { id: 12, name: "거꾸로 매달린 사람(The Hanged Man)", image: "12-hanged-man.jpg", suit: "major", keywords: "희생, 관점의 전환, 깨달음" },
  { id: 13, name: "죽음(Death)", image: "13-death.jpg", suit: "major", keywords: "변화, 종결, 새로운 시작" },
  { id: 14, name: "절제(Temperance)", image: "14-temperance.jpg", suit: "major", keywords: "균형, 조화, 절제" },
  { id: 15, name: "악마(The Devil)", image: "15-devil.jpg", suit: "major", keywords: "속박, 집착, 유혹" },
  { id: 16, name: "탑(The Tower)", image: "16-tower.jpg", suit: "major", keywords: "급격한 변화, 파괴, 깨달음" },
  { id: 17, name: "별(The Star)", image: "17-star.jpg", suit: "major", keywords: "희망, 영감, 평온" },
  { id: 18, name: "달(The Moon)", image: "18-moon.jpg", suit: "major", keywords: "무의식, 두려움, 환상" },
  { id: 19, name: "태양(The Sun)", image: "19-sun.jpg", suit: "major", keywords: "기쁨, 성공, 활력" },
  { id: 20, name: "심판(Judgement)", image: "20-judgement.jpg", suit: "major", keywords: "부활, 결정, 평가" },
  { id: 21, name: "세계(The World)", image: "21-world.jpg", suit: "major", keywords: "완성, 성취, 통합" },

  // 완드(Wands) 수트 - 불의 원소
  { id: 22, name: "완드 에이스", image: "wands-01.jpg", suit: "wands", keywords: "창조적 에너지, 새로운 프로젝트" },
  { id: 23, name: "완드 2", image: "wands-02.jpg", suit: "wands", keywords: "계획, 미래 전망" },
  { id: 24, name: "완드 3", image: "wands-03.jpg", suit: "wands", keywords: "확장, 전망" },
  { id: 25, name: "완드 4", image: "wands-04.jpg", suit: "wands", keywords: "축하, 조화" },
  { id: 26, name: "완드 5", image: "wands-05.jpg", suit: "wands", keywords: "갈등, 경쟁" },
  { id: 27, name: "완드 6", image: "wands-06.jpg", suit: "wands", keywords: "승리, 인정" },
  { id: 28, name: "완드 7", image: "wands-07.jpg", suit: "wands", keywords: "도전, 용기" },
  { id: 29, name: "완드 8", image: "wands-08.jpg", suit: "wands", keywords: "빠른 행동, 소식" },
  { id: 30, name: "완드 9", image: "wands-09.jpg", suit: "wands", keywords: "회복력, 경계" },
  { id: 31, name: "완드 10", image: "wands-10.jpg", suit: "wands", keywords: "부담, 책임" },
  { id: 32, name: "완드 페이지", image: "wands-page.jpg", suit: "wands", keywords: "열정, 탐험" },
  { id: 33, name: "완드 나이트", image: "wands-knight.jpg", suit: "wands", keywords: "모험, 충동" },
  { id: 34, name: "완드 퀸", image: "wands-queen.jpg", suit: "wands", keywords: "자신감, 독립" },
  { id: 35, name: "완드 킹", image: "wands-king.jpg", suit: "wands", keywords: "리더십, 비전" },

  // 컵(Cups) 수트 - 물의 원소
  { id: 36, name: "컵 에이스", image: "cups-01.jpg", suit: "cups", keywords: "새로운 사랑, 감정" },
  { id: 37, name: "컵 2", image: "cups-02.jpg", suit: "cups", keywords: "파트너십, 연결" },
  { id: 38, name: "컵 3", image: "cups-03.jpg", suit: "cups", keywords: "축하, 우정" },
  { id: 39, name: "컵 4", image: "cups-04.jpg", suit: "cups", keywords: "무관심, 명상" },
  { id: 40, name: "컵 5", image: "cups-05.jpg", suit: "cups", keywords: "상실, 후회" },
  { id: 41, name: "컵 6", image: "cups-06.jpg", suit: "cups", keywords: "향수, 순수" },
  { id: 42, name: "컵 7", image: "cups-07.jpg", suit: "cups", keywords: "선택, 환상" },
  { id: 43, name: "컵 8", image: "cups-08.jpg", suit: "cups", keywords: "떠남, 탐색" },
  { id: 44, name: "컵 9", image: "cups-09.jpg", suit: "cups", keywords: "만족, 소원 성취" },
  { id: 45, name: "컵 10", image: "cups-10.jpg", suit: "cups", keywords: "행복, 가족" },
  { id: 46, name: "컵 페이지", image: "cups-page.jpg", suit: "cups", keywords: "창의성, 직관" },
  { id: 47, name: "컵 나이트", image: "cups-knight.jpg", suit: "cups", keywords: "로맨스, 매력" },
  { id: 48, name: "컵 퀸", image: "cups-queen.jpg", suit: "cups", keywords: "공감, 감성" },
  { id: 49, name: "컵 킹", image: "cups-king.jpg", suit: "cups", keywords: "감정 성숙, 외교" },

  // 검(Swords) 수트 - 공기의 원소
  { id: 50, name: "검 에이스", image: "swords-01.jpg", suit: "swords", keywords: "명확함, 진실" },
  { id: 51, name: "검 2", image: "swords-02.jpg", suit: "swords", keywords: "결정, 균형" },
  { id: 52, name: "검 3", image: "swords-03.jpg", suit: "swords", keywords: "상처, 슬픔" },
  { id: 53, name: "검 4", image: "swords-04.jpg", suit: "swords", keywords: "휴식, 회복" },
  { id: 54, name: "검 5", image: "swords-05.jpg", suit: "swords", keywords: "갈등, 패배" },
  { id: 55, name: "검 6", image: "swords-06.jpg", suit: "swords", keywords: "전환, 여행" },
  { id: 56, name: "검 7", image: "swords-07.jpg", suit: "swords", keywords: "전략, 기만" },
  { id: 57, name: "검 8", image: "swords-08.jpg", suit: "swords", keywords: "제약, 혼란" },
  { id: 58, name: "검 9", image: "swords-09.jpg", suit: "swords", keywords: "불안, 악몽" },
  { id: 59, name: "검 10", image: "swords-10.jpg", suit: "swords", keywords: "종결, 바닥" },
  { id: 60, name: "검 페이지", image: "swords-page.jpg", suit: "swords", keywords: "호기심, 경계" },
  { id: 61, name: "검 나이트", image: "swords-knight.jpg", suit: "swords", keywords: "행동, 충동" },
  { id: 62, name: "검 퀸", image: "swords-queen.jpg", suit: "swords", keywords: "지성, 독립" },
  { id: 63, name: "검 킹", image: "swords-king.jpg", suit: "swords", keywords: "권위, 진실" },

  // 펜타클(Pentacles) 수트 - 땅의 원소
  { id: 64, name: "펜타클 에이스", image: "pentacles-01.jpg", suit: "pentacles", keywords: "새로운 기회, 번영" },
  { id: 65, name: "펜타클 2", image: "pentacles-02.jpg", suit: "pentacles", keywords: "균형, 적응" },
  { id: 66, name: "펜타클 3", image: "pentacles-03.jpg", suit: "pentacles", keywords: "협력, 기술" },
  { id: 67, name: "펜타클 4", image: "pentacles-04.jpg", suit: "pentacles", keywords: "안정, 소유" },
  { id: 68, name: "펜타클 5", image: "pentacles-05.jpg", suit: "pentacles", keywords: "재정 어려움, 고립" },
  { id: 69, name: "펜타클 6", image: "pentacles-06.jpg", suit: "pentacles", keywords: "관대함, 나눔" },
  { id: 70, name: "펜타클 7", image: "pentacles-07.jpg", suit: "pentacles", keywords: "평가, 인내" },
  { id: 71, name: "펜타클 8", image: "pentacles-08.jpg", suit: "pentacles", keywords: "장인정신, 근면" },
  { id: 72, name: "펜타클 9", image: "pentacles-09.jpg", suit: "pentacles", keywords: "성취, 사치" },
  { id: 73, name: "펜타클 10", image: "pentacles-10.jpg", suit: "pentacles", keywords: "유산, 부" },
  { id: 74, name: "펜타클 페이지", image: "pentacles-page.jpg", suit: "pentacles", keywords: "야망, 실용성" },
  { id: 75, name: "펜타클 나이트", image: "pentacles-knight.jpg", suit: "pentacles", keywords: "책임감, 성실" },
  { id: 76, name: "펜타클 퀸", image: "pentacles-queen.jpg", suit: "pentacles", keywords: "양육, 실용성" },
  { id: 77, name: "펜타클 킹", image: "pentacles-king.jpg", suit: "pentacles", keywords: "풍요, 비즈니스" }
];

// API 엔드포인트: 타로 카드 목록 가져오기
app.get('/api/cards', (req, res) => {
  console.log('📥 타로 카드 목록 요청 받음');
  res.json(tarotCards);
});

// API 엔드포인트: 타로 리딩 (GPT-3.5 연동)
app.post('/api/reading', async (req, res) => {
  try {
    const { cards, question, spread } = req.body;
    
    console.log('📥 타로 리딩 요청:', { 
      카드수: cards.length, 
      질문: question,
      스프레드: spread 
    });

    if (!cards || cards.length === 0) {
      return res.status(400).json({ error: '카드를 선택해주세요.' });
    }

    // GPT-3.5에게 전달할 프롬프트 구성
    const cardDescriptions = cards.map((card, index) => 
      `${index + 1}. ${card.name} (${card.keywords})`
    ).join('\n');

    const systemPrompt = `당신은 30년 경력의 전문 타로 리더입니다. 
사용자의 질문과 뽑힌 카드를 바탕으로 깊이 있고 구체적인 해석을 제공합니다.
해석은 다음 구조로 작성하세요:

1. **전체적인 메시지** (2-3문장)
2. **각 카드의 의미** (각 카드마다 구체적 해석)
3. **실천 조언** (구체적이고 실용적인 조언)

따뜻하고 공감적인 톤으로 작성하되, 명확하고 구체적으로 답변하세요.`;

    const userPrompt = `질문: ${question || '일반적인 운세를 알려주세요'}
스프레드: ${spread}
뽑힌 카드:
${cardDescriptions}

위 카드들을 바탕으로 타로 리딩을 해주세요.`;

    console.log('🤖 GPT-3.5 호출 시작...');

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 1000
    });

    const reading = completion.choices[0].message.content;
    
    console.log('✅ 타로 리딩 완료');

    res.json({
      reading,
      cards,
      question,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 타로 리딩 오류:', error);
    
    if (error.code === 'insufficient_quota') {
      res.status(402).json({ 
        error: 'OpenAI API 크레딧이 부족합니다. API 키를 확인해주세요.' 
      });
    } else {
      res.status(500).json({ 
        error: '타로 리딩 중 오류가 발생했습니다.',
        details: error.message 
      });
    }
  }
});

// API 엔드포인트: 오늘의 운세 (한 장 리딩)
app.post('/api/daily-fortune', async (req, res) => {
  try {
    console.log('📥 오늘의 운세 요청');

    // 랜덤으로 한 장 선택
    const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];

    const systemPrompt = `당신은 전문 타로 리더입니다. 
오늘의 운세를 밝고 긍정적인 톤으로 간결하게 전달하세요.
3-4문장으로 오늘 하루의 에너지와 조언을 제공하세요.`;

    const userPrompt = `오늘의 카드: ${randomCard.name} (${randomCard.keywords})

이 카드를 바탕으로 오늘 하루의 운세를 알려주세요.`;

    console.log('🤖 GPT-3.5 호출 (오늘의 운세)...');

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const fortune = completion.choices[0].message.content;
    
    console.log('✅ 오늘의 운세 완료');

    res.json({
      card: randomCard,
      fortune,
      date: new Date().toLocaleDateString('ko-KR')
    });

  } catch (error) {
    console.error('❌ 오늘의 운세 오류:', error);
    res.status(500).json({ 
      error: '오늘의 운세를 가져오는 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

// 헬스 체크
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    openai: process.env.OPENAI_API_KEY ? 'configured' : 'missing'
  });
});

// 루트 경로
app.get('/', (req, res) => {
  res.json({ 
    message: '🔮 타로 GPT API 서버',
    endpoints: {
      cards: 'GET /api/cards',
      reading: 'POST /api/reading',
      dailyFortune: 'POST /api/daily-fortune',
      health: 'GET /health'
    }
  });
});


app.listen(PORT, () => {
  console.log(`✨ 타로 GPT 서버 시작됨: http://localhost:${PORT}`);
  console.log(`🔑 OpenAI API 키: ${process.env.OPENAI_API_KEY ? '설정됨 ✅' : '설정 안됨 ❌'}`);
});
