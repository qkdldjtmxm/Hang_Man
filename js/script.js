/* =========================================================
   행맨 - 단어 맞히기 — 학생용 (js/script.js)
   ========================================================= */


/* ===== 1. HTML 요소 찾기 ===== */
const hint        = document.querySelector('#hint');
const lives       = document.querySelector('#lives');
const wordDisplay = document.querySelector('#wordDisplay');
const message     = document.querySelector('#message');
const keyboard    = document.querySelector('#keyboard');
const restartBtn  = document.querySelector('#restartBtn');
const scoreText   = document.querySelector('#scoreText');


/* ===== 2. 게임 데이터 (배열 + 객체) ===== */
const words = [
    { word: 'JAVASCRIPT', hint: '웹 페이지를 움직이게 하는 프로그래밍 언어' },
    { word: 'BROWSER',    hint: '크롬, 엣지, 사파리 같은 웹 사이트 보는 프로그램' },
    { word: 'VARIABLE',   hint: '값을 담아 두는 상자 (let, const)' },
    { word: 'FUNCTION',   hint: '여러 줄의 코드를 묶어 이름을 붙인 것' },
    { word: 'KEYBOARD',   hint: '글자를 입력하는 장치' },
    { word: 'STYLE',      hint: 'CSS 는 웹 페이지의 ○○○ 을 꾸밉니다' },
    { word: 'BUTTON',     hint: '누르면 이벤트가 일어나는 요소' },
    { word: 'RANDOM',     hint: 'Math.○○○○○ 로 뽑는 무작위 수' }
];

const MAX_LIVES = 6;          // 틀릴 수 있는 최대 횟수


/* ===== 3. 게임 상태 변수 ===== */
let answer = '';              // 이번 판의 정답 단어
let guessed = [];             // 지금까지 누른 알파벳들
let lifeCount = MAX_LIVES;    // 남은 목숨
let gameOver = false;         // 게임이 끝났는지
let winCount = 0;             // 이긴 횟수
let loseCount = 0;            // 진 횟수


/* ===== 4. 단어 보여주기 ===== */
// ★ STEP 1. showWord 함수 
//   맞힌 글자는 그대로, 못 맞힌 글자는 _ 로 만들어 화면에 보여 줍니다.
//   ① 빈 문자열 text 를 만든다.            
//   ② answer 의 글자를 처음부터 끝까지 하나씩 본다. (for)
//   ③ 그 글자가 guessed 안에 있으면 글자 + 공백, 없으면 _ + 공백 을 text 에 이어 붙인다. (if ~ else)
//   ④ 맨 끝의 공백을 trim() 으로 없애고 wordDisplay 에 넣는다.
function showWord() {
    let text = '';
    for (let i = 0; i < answer.length; i++) {
        const letter = answer[i];
        if (guessed.includes(letter)) {
            text += letter + ' ';
        } else {
            text += '_ ';
        }
    }
    wordDisplay.textContent = text.trim();
}



/* ===== 5. 목숨과 점수 보여주기 ===== */
// ★ STEP 2. showLives, showScore 함수
//   showLives : 남은 목숨(lifeCount)만큼 ❤️, 잃은 목숨은 🖤 를 이어 붙여 lives 에 보여 줍니다.
//   showScore : '이긴 횟수 ○ / 진 횟수 ○' 글자를 만들어 scoreText 에 보여 줍니다. (글자 + 변수 + 글자)
function showLives() {
    let hearts = '';
    for (let i = 0; i < lifeCount; i++) {
        hearts += '❤️';
    }
    for (let i = lifeCount; i < MAX_LIVES ; i++) {
        hearts += '🖤';
    }
    lives.textContent = hearts;
}

function showScore() {
    scoreText.textContent = `이긴 횟수 ${winCount} / 진 횟수 ${loseCount}`;
}



/* ===== 6. 알파벳 키보드 만들기 ===== */
// ★ STEP 3. makeKeyboard 함수
//   A ~ Z 버튼 26개를 JavaScript 로 만들어 keyboard 안에 넣습니다.
//   ① keyboard.innerHTML = ''; 으로 예전 버튼을 지운다.   
//   ② letters 에 알파벳 26글자를 담는다.
//   ③ for 로 26번 반복하며:  document.createElement('button') 으로 버튼 만들기
//   → className = 'key' 로 이름표(class) 붙이기 → textContent 에 글자 넣기
//   → addEventListener('click', function () { guess(...) }) 로 누르면 guess 실행
//   → keyboard.appendChild(btn) 으로 화면에 붙이기
function makeKeyboard() {
    keyboard.innerHTML = '';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < letters.length; i++) {
        const btn = document.createElement('button');
        btn.className = 'key';
        btn.textContent = letters[i];
        btn.addEventListener('click', function () {
            guess(letters[i], btn);
        });
        keyboard.appendChild(btn);
    }
}



/* ===== 7. 알파벳을 눌렀을 때 ===== */
// ★ STEP 4. guess 함수 (알파벳을 눌렀을 때)
//   letter(누른 알파벳)와 btn(누른 버튼)을 받아서 처리합니다.
//   ① gameOver 가 true 이면 return 으로 함수를 끝낸다.   
//   ② guessed 에 letter 를 추가하고(push), 버튼을 잠근다(disabled = true).
//   ③ answer.includes(letter) 가 true 이면 : btn 에 'right' class 추가 → showWord() → checkWin()
//   ④ 아니면 : btn 에 'wrong' class 추가 → lifeCount 1 줄이기 → showLives() → checkLose()
function guess(letter, btn) {
    if (gameOver) return;

    guessed.push(letter);
    btn.disabled = true;

    if (answer.includes(letter)) {
        btn.classList.add('right');
        showWord();
        checkWin();
    } else {
        btn.classList.add('wrong');
        lifeCount--;
        showLives();
        checkLose();
    }
}



/* ===== 8. 이겼는지 / 졌는지 확인 ===== */
// ★ STEP 5. checkWin, checkLose, endGame 함수
//   checkWin  : 단어의 모든 글자가 guessed 안에 있으면 승리.
//   allFound = true 로 시작 → for 로 글자를 보다가 하나라도 없으면 false → if (allFound) 이면 메시지, win class, winCount + 1, endGame()
//   checkLose : lifeCount 가 0 이면 패배. 메시지, lose class, loseCount + 1, 정답 공개(answer.split('').join(' ')), endGame()
//   endGame   : gameOver = true, showScore(), 모든 .key 버튼(querySelectorAll)을 for 로 돌며 disabled = true
function checkWin() {
    let allFound = true;
    for (let i = 0; i < answer.length; i++) {
        if (!guessed.includes(answer[i])) {
            allFound = false;   // 하나라도 못 맞힌 글자가 있으면 "false"
            break;
        }
    }
    if (allFound) {
        message.textContent = '🎉 정답입니다! 잘했어요!';
        message.className = 'message win';
        winCount++;
        endGame();
    }
}

function checkLose() {
    if (lifeCount === 0) {
        message.textContent = `😢 실패! 정답은 ${answer} 였어요.`;
        message.className = 'message lose';
        loseCount++;

        wordDisplay.textContent = answer.split('').join(' ');  // 정답 공개
        endGame();
    }
}

function endGame() {
    gameOver = true;
    showScore();

    const keys = document.querySelectorAll('.key');
    for (let i = 0; i < keys.length; i++) {
        keys[i].disabled = true;
    }
}


/* ===== 9. 새 게임 시작 ===== */
// ★ STEP 6. startGame 함수 (새 게임 시작)
//   게임 판을 처음 상태로 되돌리고 새 단어를 뽑습니다.
//   ① words[Math.floor(Math.random() * words.length)] 로 단어 하나(객체)를 뽑아 pick 에 담는다.
//   ② answer = pick.word 로 정답 정하기, guessed 비우기([]), lifeCount = MAX_LIVES, gameOver = false
//   ③ 힌트·메시지 글자 바꾸기 (message.className = 'message' 로 색도 되돌림)
//   ④ makeKeyboard(), showWord(), showLives(), showScore() 호출
function startGame() {
    const pick = words[Math.floor(Math.random() * words.length)];
    answer = pick.word;
    guessed = [];
    lifeCount = MAX_LIVES;
    gameOver = false;

    hint.textContent = pick.hint;
    message.textContent = '';
    message.className = 'message';

    makeKeyboard();
    showWord();
    showLives();
    showScore();
}



/* ===== 10. 이벤트 연결 + 게임 시작 ===== */
// ★ STEP 7. 이벤트 연결 + 게임 시작 
//   새 게임 버튼을 누르면 startGame 이 실행되게 연결하고, 페이지가 열리자마자 한 번 시작합니다.

restartBtn.addEventListener('click', startGame);
startGame();
