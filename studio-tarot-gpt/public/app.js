// 🔮 AI 타로 상담 서비스 - 메인 앱 로직

// ===== 1. 전역 상태 관리 =====
const AppState = {
  tarotCards: [],
  selectedSpread: null,
  selectedCards: [],
  currentQuestion: '',
  currentReading: null,
  maxCards: 3,
};

// ===== 2. DOM 요소 참조 =====
const Elements = {
  // 로딩
  loadingScreen: document.getElementById('loading-screen'),
  loadingModal: document.getElementById('loading-modal'),
  
  // 화면들
  welcomeScreen: document.getElementById('welcome-screen'),
  questionScreen: document.getElementById('question-screen'),
  cardsScreen: document.getElementById('cards-screen'),
  resultScreen: document.getElementById('result-screen'),
  dailyFortuneScreen: document.getElementById('daily-fortune-screen'),
  
  // 테마
  themeToggle: document.getElementById('theme-toggle'),
  
  // 스프레드 선택
  spreadCards: document.querySelectorAll('.spread-card'),
  dailyFortuneBtn: document.getElementById('daily-fortune-btn'),
  
  // 질문 입력
  questionInput: document.getElementById('question-input'),
  charCount: document.getElementById('char-count'),
  exampleChips: document.querySelectorAll('.example-chip'),
  drawCardsBtn: document.getElementById('draw-cards-btn'),
  
  // 카드 선택
  cardDeck: document.getElementById('card-deck'),
  cardsSelected: document.getElementById('cards-selected'),
  cardsTotal: document.getElementById('cards-total'),
  getReadingBtn: document.getElementById('get-reading-btn'),
  
  // 결과
  resultQuestionText: document.getElementById('result-question-text'),
  selectedCardsDisplay: document.getElementById('selected-cards-display'),
  readingText: document.getElementById('reading-text'),
  newReadingBtn: document.getElementById('new-reading-btn'),
  shareBtn: document.getElementById('share-btn'),
  
  // 운세
  fortuneDate: document.getElementById('fortune-date'),
  fortuneCardDisplay: document.getElementById('fortune-card-display'),
  fortuneText: document.getElementById('fortune-text'),
  checkDetailReading: document.getElementById('check-detail-reading'),
  
  // 뒤로가기 버튼들
  backToWelcome: document.getElementById('back-to-welcome'),
  backToQuestion: document.getElementById('back-to-question'),
  backToWelcomeFinal: document.getElementById('back-to-welcome-final'),
  backFromFortune: document.getElementById('back-from-fortune'),
};

// ===== 3. API 호출 함수 =====
const API = {
  async getCards() {
    const response = await fetch(`${API_BASE}/api/cards`);
    if (!response.ok) throw new Error('카드 데이터를 불러올 수 없습니다.');
    return await response.json();
  },
  
  async getReading(cards, question, spreadType) {
    const response = await fetch(\${API_BASE}/api/`reading', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cards, question, spreadType })
    });
    if (!response.ok) throw new Error('리딩을 가져올 수 없습니다.');
    return await response.json();
  },
  
  async getDailyFortune(birthDate = null) {
    const response = await fetch(\${API_BASE}/api/`daily-fortune', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birthDate })
    });
    if (!response.ok) throw new Error('운세를 가져올 수 없습니다.');
    return await response.json();
  }
};

// ===== 4. 유틸리티 함수 =====
const Utils = {
  showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  
  showLoading() {
    Elements.loadingModal.classList.add('active');
  },
  
  hideLoading() {
    Elements.loadingModal.classList.remove('active');
  },
  
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },
  
  showNotification(message, type = 'info') {
    alert(message); // 실제로는 토스트 알림 구현
  }
};

// ===== 5. 초기화 =====
async function init() {
  try {
    // 타로 카드 데이터 로드
    const data = await API.getCards();
    AppState.tarotCards = data.cards;
    
    // 로딩 화면 숨기기
    setTimeout(() => {
      Elements.loadingScreen.classList.add('hidden');
    }, 1000);
    
    // 이벤트 리스너 등록
    setupEventListeners();
    
  } catch (error) {
    console.error('초기화 오류:', error);
    Utils.showNotification('서비스를 시작할 수 없습니다. 페이지를 새로고침 해주세요.', 'error');
  }
}

// ===== 6. 이벤트 리스너 설정 =====
function setupEventListeners() {
  // 테마 토글
  Elements.themeToggle.addEventListener('click', toggleTheme);
  
  // 스프레드 선택
  Elements.spreadCards.forEach(card => {
    card.addEventListener('click', () => selectSpread(card.dataset.spread));
  });
  
  // 오늘의 운세
  Elements.dailyFortuneBtn.addEventListener('click', showDailyFortune);
  
  // 질문 입력
  Elements.questionInput.addEventListener('input', handleQuestionInput);
  Elements.exampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      Elements.questionInput.value = chip.textContent;
      handleQuestionInput();
    });
  });
  Elements.drawCardsBtn.addEventListener('click', startCardSelection);
  
  // 카드 리딩 요청
  Elements.getReadingBtn.addEventListener('click', requestReading);
  
  // 결과 화면 액션
  Elements.newReadingBtn.addEventListener('click', resetApp);
  Elements.shareBtn.addEventListener('click', shareReading);
  
  // 운세 상세 리딩
  Elements.checkDetailReading.addEventListener('click', () => {
    Utils.showScreen(Elements.welcomeScreen);
  });
  
  // 뒤로가기
  Elements.backToWelcome.addEventListener('click', () => Utils.showScreen(Elements.welcomeScreen));
  Elements.backToQuestion.addEventListener('click', () => Utils.showScreen(Elements.questionScreen));
  Elements.backToWelcomeFinal.addEventListener('click', resetApp);
  Elements.backFromFortune.addEventListener('click', () => Utils.showScreen(Elements.welcomeScreen));
}

// ===== 7. 테마 전환 =====
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  Elements.themeToggle.querySelector('.theme-icon').textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// 저장된 테마 불러오기
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
  document.body.classList.remove('dark-mode');
  Elements.themeToggle.querySelector('.theme-icon').textContent = '🌙';
}

// ===== 8. 스프레드 선택 =====
function selectSpread(spreadType) {
  AppState.selectedSpread = spreadType;
  
  // 최대 카드 수 설정
  const cardCounts = {
    'single': 1,
    'three-card': 3,
    'five-card': 5
  };
  AppState.maxCards = cardCounts[spreadType];
  
  // 질문 화면으로 이동
  Utils.showScreen(Elements.questionScreen);
}

// ===== 9. 질문 입력 처리 =====
function handleQuestionInput() {
  const question = Elements.questionInput.value.trim();
  const length = question.length;
  
  Elements.charCount.textContent = length;
  Elements.drawCardsBtn.disabled = length < 5;
  
  AppState.currentQuestion = question;
}

// ===== 10. 카드 선택 시작 =====
function startCardSelection() {
  if (!AppState.currentQuestion) {
    Utils.showNotification('질문을 입력해주세요.');
    return;
  }
  
  // 카드 덱 생성
  renderCardDeck();
  
  // 카드 화면으로 이동
  Utils.showScreen(Elements.cardsScreen);
  Elements.cardsTotal.textContent = AppState.maxCards;
}

// ===== 11. 카드 덱 렌더링 =====
function renderCardDeck() {
  Elements.cardDeck.innerHTML = '';
  AppState.selectedCards = [];
  
  // 카드 섞기
  const shuffledCards = Utils.shuffleArray(AppState.tarotCards);
  
  // 카드 생성 (78장 중 일부만 표시)
  const displayCount = Math.min(40, shuffledCards.length);
  
  for (let i = 0; i < displayCount; i++) {
    const card = shuffledCards[i];
    const cardElement = document.createElement('div');
    cardElement.className = 'tarot-card';
    cardElement.dataset.cardIndex = i;
    cardElement.dataset.cardData = JSON.stringify(card);
    
    cardElement.addEventListener('click', () => selectCard(cardElement, card));
    
    Elements.cardDeck.appendChild(cardElement);
  }
  
  updateCardCounter();
}

// ===== 12. 카드 선택 =====
function selectCard(element, card) {
  const isSelected = element.classList.contains('selected');
  
  if (isSelected) {
    // 선택 해제
    element.classList.remove('selected');
    AppState.selectedCards = AppState.selectedCards.filter(c => c.name !== card.name);
  } else {
    // 최대 개수 체크
    if (AppState.selectedCards.length >= AppState.maxCards) {
      Utils.showNotification(`최대 ${AppState.maxCards}장까지 선택할 수 있습니다.`);
      return;
    }
    
    // 선택
    element.classList.add('selected');
    
    // 역방향 랜덤 결정
    const reversed = Math.random() < 0.3; // 30% 확률
    
    AppState.selectedCards.push({
      ...card,
      reversed: reversed
    });
  }
  
  updateCardCounter();
}

// ===== 13. 카드 카운터 업데이트 =====
function updateCardCounter() {
  Elements.cardsSelected.textContent = AppState.selectedCards.length;
  Elements.getReadingBtn.disabled = AppState.selectedCards.length !== AppState.maxCards;
}

// ===== 14. 리딩 요청 =====
async function requestReading() {
  try {
    Utils.showLoading();
    
    const result = await API.getReading(
      AppState.selectedCards,
      AppState.currentQuestion,
      AppState.selectedSpread
    );
    
    AppState.currentReading = result;
    
    // 결과 화면 렌더링
    renderReadingResult(result);
    
    Utils.hideLoading();
    Utils.showScreen(Elements.resultScreen);
    
  } catch (error) {
    Utils.hideLoading();
    console.error('리딩 오류:', error);
    Utils.showNotification('리딩을 가져오는데 실패했습니다. 다시 시도해주세요.', 'error');
  }
}

// ===== 15. 리딩 결과 렌더링 =====
function renderReadingResult(result) {
  // 질문 표시
  Elements.resultQuestionText.textContent = result.question;
  
  // 선택된 카드 표시
  Elements.selectedCardsDisplay.innerHTML = '';
  
  const positions = {
    'single': ['현재'],
    'three-card': ['과거', '현재', '미래'],
    'five-card': ['과거', '현재', '미래', '조언', '결과']
  };
  
  const positionNames = positions[AppState.selectedSpread] || [];
  
  result.cards.forEach((card, index) => {
    const cardItem = document.createElement('div');
    cardItem.className = 'selected-card-item';
    
    const cardImage = document.createElement('img');
    cardImage.className = 'selected-card-img';
    if (card.reversed) cardImage.classList.add('reversed');
    
    // 카드 이미지 경로
    const cardFileName = getCardFileName(card);
    cardImage.src = `/cards/${cardFileName}`;
    cardImage.alt = card.name;
    
    const cardName = document.createElement('div');
    cardName.className = 'selected-card-name';
    cardName.textContent = card.name + (card.reversed ? ' (역)' : '');
    
    const cardPosition = document.createElement('div');
    cardPosition.className = 'selected-card-position';
    cardPosition.textContent = positionNames[index] || `카드 ${index + 1}`;
    
    cardItem.appendChild(cardImage);
    cardItem.appendChild(cardName);
    cardItem.appendChild(cardPosition);
    
    Elements.selectedCardsDisplay.appendChild(cardItem);
  });
  
  // 리딩 텍스트
  Elements.readingText.textContent = result.reading;
}

// ===== 16. 카드 파일명 찾기 =====
function getCardFileName(card) {
  // 카드 번호 기반으로 파일명 생성
  const arcana = card.arcana;
  const number = card.number;
  
  if (arcana === 'Major Arcana') {
    return `m${String(number).padStart(2, '0')}.jpg`;
  } else {
    // Minor Arcana
    const suits = {
      'wands': 'w',
      'cups': 'c',
      'swords': 's',
      'pentacles': 'p'
    };
    const suit = card.suit ? card.suit.toLowerCase() : 'c';
    const suitCode = suits[suit] || 'c';
    return `${suitCode}${String(number).padStart(2, '0')}.jpg`;
  }
}

// ===== 17. 오늘의 운세 =====
async function showDailyFortune() {
  try {
    Utils.showLoading();
    
    const fortune = await API.getDailyFortune();
    
    // 날짜 표시
    const today = new Date();
    Elements.fortuneDate.textContent = today.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
    
    // 카드 표시
    Elements.fortuneCardDisplay.innerHTML = '';
    
    const cardItem = document.createElement('div');
    cardItem.className = 'fortune-card-item';
    
    const cardImage = document.createElement('img');
    cardImage.className = 'fortune-card-img';
    const cardFileName = getCardFileName(fortune.card);
    cardImage.src = `/cards/${cardFileName}`;
    cardImage.alt = fortune.card.name;
    
    const cardName = document.createElement('div');
    cardName.className = 'fortune-card-name';
    cardName.textContent = fortune.card.name;
    
    cardItem.appendChild(cardImage);
    cardItem.appendChild(cardName);
    
    Elements.fortuneCardDisplay.appendChild(cardItem);
    
    // 운세 텍스트
    Elements.fortuneText.textContent = fortune.fortune;
    
    Utils.hideLoading();
    Utils.showScreen(Elements.dailyFortuneScreen);
    
  } catch (error) {
    Utils.hideLoading();
    console.error('운세 오류:', error);
    Utils.showNotification('운세를 가져오는데 실패했습니다.', 'error');
  }
}

// ===== 18. 공유하기 =====
function shareReading() {
  const shareText = `🔮 AI 타로 리딩\n\n질문: ${AppState.currentQuestion}\n\n타로가 전하는 메시지를 확인해보세요!`;
  
  if (navigator.share) {
    navigator.share({
      title: 'AI 타로 리딩',
      text: shareText,
      url: window.location.href
    }).catch(err => console.log('공유 실패:', err));
  } else {
    // 폴백: 클립보드 복사
    navigator.clipboard.writeText(shareText).then(() => {
      Utils.showNotification('클립보드에 복사되었습니다!');
    }).catch(err => {
      Utils.showNotification('공유 기능을 사용할 수 없습니다.');
    });
  }
}

// ===== 19. 앱 리셋 =====
function resetApp() {
  AppState.selectedSpread = null;
  AppState.selectedCards = [];
  AppState.currentQuestion = '';
  AppState.currentReading = null;
  
  Elements.questionInput.value = '';
  Elements.charCount.textContent = '0';
  Elements.drawCardsBtn.disabled = true;
  
  Utils.showScreen(Elements.welcomeScreen);
}

// ===== 20. 앱 시작 =====
document.addEventListener('DOMContentLoaded', init);
