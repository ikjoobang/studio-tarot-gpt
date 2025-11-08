// AI 타로 상담 서비스 - 백엔드 서버
// GPT-3.5-turbo 연동 (비용 효율적)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// OpenAI 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 타로 카드 데이터 로드
let tarotData = null;
try {
  const dataPath = path.join(__dirname, 'assets', 'tarot.json');
  tarotData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (error) {
  console.error('타로 데이터 로드 실패:', error);
}

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/cards', express.static('cards'));
app.use('/assets', express.static('assets'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'AI Tarot Reading Service',
    timestamp: new Date().toISOString()
  });
});

// 타로 카드 데이터 API
app.get('/api/cards', (req, res) => {
  if (!tarotData) {
    return res.status(500).json({ error: '타로 데이터를 불러올 수 없습니다.' });
  }
  res.json(tarotData);
});

// GPT-3.5 타로 리딩 API
app.post('/api/reading', async (req, res) => {
  try {
    const { cards, question, spreadType } = req.body;
    
    // 입력 검증
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({ error: '카드 정보가 필요합니다.' });
    }
    
    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: '질문을 입력해주세요.' });
    }
    
    // 카드 정보 포맷팅
    const cardDescriptions = cards.map((card, index) => {
      const position = spreadType === 'three-card' 
        ? ['과거', '현재', '미래'][index]
        : spreadType === 'single'
        ? '현재 상황'
        : `위치 ${index + 1}`;
      
      return `${position}: ${card.name}${card.reversed ? ' (역방향)' : ''} - ${card.arcana}`;
    }).join('\n');
    
    // 프롬프트 구성 (GPT-3.5-turbo 최적화)
    const systemPrompt = `당신은 30년 경력의 전문 타로 리더입니다.

🔮 전문 분야:
- 라이더-웨이트 타로 덱 해석
- 심리학적 통찰과 상징 분석
- 실용적이고 따뜻한 조언

📋 리딩 원칙:
1. 카드의 상징과 의미를 깊이 있게 해석
2. 질문자의 상황을 공감하며 이해
3. 긍정적이면서도 현실적인 조언 제공
4. 구체적인 행동 방향 제시

✨ 답변 구조:
1. **전체적인 흐름** (2-3문장)
2. **각 카드 해석** (카드별 3-4문장)
   - 카드의 핵심 의미
   - 현재 상황과의 연결
   - 실천 가능한 조언
3. **종합 메시지** (2-3문장)
4. **행동 제안** (구체적인 첫 단계)

💡 답변 스타일:
- 따뜻하고 공감적인 톤
- 전문적이면서도 이해하기 쉬운 언어
- 길이: 400-600자
- 희망과 용기를 주는 메시지`;

    const userPrompt = `질문: ${question}

뽑힌 카드:
${cardDescriptions}

위 카드들을 바탕으로 질문자에게 깊이 있고 따뜻한 타로 리딩을 제공해주세요.`;

    // OpenAI API 호출 (GPT-3.5-turbo)
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });
    
    const reading = completion.choices[0].message.content;
    
    res.json({ 
      reading: reading,
      cards: cards,
      question: question,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Reading API Error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({ 
        error: 'OpenAI API 할당량이 초과되었습니다. API 키를 확인해주세요.' 
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'OpenAI API 키가 유효하지 않습니다.' 
      });
    }
    
    res.status(500).json({ 
      error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
    });
  }
});

// 일일 운세 API
app.post('/api/daily-fortune', async (req, res) => {
  try {
    const { birthDate } = req.body;
    
    // 오늘의 카드 랜덤 선택 (시드 기반)
    const today = new Date().toDateString();
    const seed = birthDate ? `${today}-${birthDate}` : today;
    const cardIndex = Math.abs(seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % tarotData.cards.length;
    const todayCard = tarotData.cards[cardIndex];
    
    const prompt = `당신은 친근한 타로 리더입니다. 

오늘의 카드: ${todayCard.name} (${todayCard.arcana})

이 카드를 바탕으로 오늘 하루의 운세를 밝고 긍정적으로 전해주세요.
- 전체 운세 (2-3문장)
- 행운의 색상, 숫자, 키워드 제안
- 오늘의 조언 (1-2문장)

답변은 200-300자로 작성해주세요.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    res.json({ 
      card: todayCard,
      fortune: completion.choices[0].message.content,
      date: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Daily Fortune Error:', error);
    res.status(500).json({ error: '운세를 가져오는데 실패했습니다.' });
  }
});

// 404 처리
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🔮 AI 타로 상담 서비스 실행 중 🔮      ║
╚════════════════════════════════════════════╝

🚀 서버: http://localhost:${PORT}
📡 API 엔드포인트:
   - GET  /api/cards          (타로 카드 데이터)
   - POST /api/reading        (타로 리딩)
   - POST /api/daily-fortune  (오늘의 운세)
💚 Health: http://localhost:${PORT}/health

📧 문의: ${process.env.SERVICE_EMAIL || 'ikjoobang@gmail.com'}

⏰ 시작 시간: ${new Date().toLocaleString('ko-KR')}
  `);
});

// 에러 핸들링
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
