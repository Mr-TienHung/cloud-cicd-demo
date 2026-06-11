// ================= 1. ĐỒNG HỒ NGÀY & GIỜ =================
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = `${now.toLocaleDateString('vi-VN')} - ${now.toLocaleTimeString('vi-VN')}`;
}
setInterval(updateClock, 1000); updateClock();

// ================= 2. CHẾ ĐỘ SÁNG / TỐI =================
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.replace('dark-theme', 'light-theme');
        themeToggle.innerText = "🌙 Chế độ tối";
    } else {
        document.body.classList.replace('light-theme', 'dark-theme');
        themeToggle.innerText = "☀️ Chế độ sáng";
    }
});

// ================= 3. MÁY TÍNH BỎ TÚI =================
const calcScreen = document.getElementById('calc-screen');
function pressCalc(value) { calcScreen.value += value; }
function clearCalc() { calcScreen.value = ''; }
function calculateResult() {
    try { if (calcScreen.value) calcScreen.value = eval(calcScreen.value); } 
    catch (e) { calcScreen.value = 'Lỗi biểu thức'; }
}

// ================= 4. THÁCH THỨC TÍNH NHẨM =================
let score = 0, correctAnswer = 0;
function generateQuestion() {
    const n1 = Math.floor(Math.random() * 20) + 1, n2 = Math.floor(Math.random() * 20) + 1;
    const ops = ['+', '-', '*'], op = ops[Math.floor(Math.random() * ops.length)];
    document.getElementById('question').innerText = `${n1} ${op} ${n2} = ?`;
    correctAnswer = op === '+' ? n1 + n2 : op === '-' ? n1 - n2 : n1 * n2;
}
function checkGameAnswer() {
    const ans = parseInt(document.getElementById('game-answer').value), fb = document.getElementById('game-feedback');
    if (ans === correctAnswer) { score += 10; fb.innerText = "Chính xác! +10đ 🎉"; fb.style.color = "#4caf50"; } 
    else { score = Math.max(0, score - 5); fb.innerText = `Sai rồi! Đáp án: ${correctAnswer} 😢`; fb.style.color = "#f44336"; }
    document.getElementById('game-score').innerText = score;
    document.getElementById('game-answer').value = ''; generateQuestion();
}
document.getElementById('submit-answer-btn').addEventListener('click', checkGameAnswer);
document.getElementById('game-answer').addEventListener('keypress', (e) => { if(e.key==='Enter') checkGameAnswer(); });
generateQuestion();

// ================= 5. GHI CHÚ (LOCALSTORAGE) =================
const noteInput = document.getElementById('note-input'), notesList = document.getElementById('notes-list');
let savedNotes = JSON.parse(localStorage.getItem('my_web_notes')) || [];
function renderNotes() {
    notesList.innerHTML = '';
    savedNotes.forEach(n => { const li = document.createElement('li'); li.innerText = n; notesList.appendChild(li); });
}
document.getElementById('save-note-btn').addEventListener('click', () => {
    const t = noteInput.value.trim();
    if(t) { savedNotes.unshift(t); localStorage.setItem('my_web_notes', JSON.stringify(savedNotes)); noteInput.value = ''; renderNotes(); }
});
renderNotes();

// ================= 6. INTERACTIVE DINO JUMP GAME =================
const dino = document.getElementById('dino'), cactus = document.getElementById('cactus');
const jumpBtn = document.getElementById('jump-btn'), overlay = document.getElementById('dino-overlay');
const startBtn = document.getElementById('start-game-btn');

let dinoScore = 0, cactusPosition = 100, isJumping = false, isAlive = false, animationId = null;

function jump() {
    if (!isJumping && isAlive) {
        isJumping = true;
        dino.style.transition = "bottom 0.28s cubic-bezier(0.4, 0, 0.2, 1)";
        dino.style.bottom = "85px";
        setTimeout(() => {
            dino.style.transition = "bottom 0.22s cubic-bezier(0.4, 0, 1, 1)";
            dino.style.bottom = "0px";
            setTimeout(() => { isJumping = false; }, 220);
        }, 280);
    }
}

document.addEventListener('keydown', (e) => { if (e.code === 'Space') { e.preventDefault(); jump(); } });
jumpBtn.addEventListener('click', jump);

startBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    isAlive = true;
    jumpBtn.disabled = false;
    cactusPosition = 100;
    dinoScore = 0;
    document.getElementById('dino-score').innerText = `Điểm Dino: 0`;
    if(!animationId) animationId = requestAnimationFrame(gameLoop);
});

function gameLoop() {
    if (!isAlive) { animationId = null; return; }
    cactusPosition -= 1.6;
    if (cactusPosition < -4) {
        cactusPosition = 100; dinoScore += 1;
        document.getElementById('dino-score').innerText = `Điểm Dino: ${dinoScore}`;
    }
    cactus.style.left = cactusPosition + "%";
    const dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));
    if (cactusPosition > 11 && cactusPosition < 15 && dinoBottom <= 30) {
        isAlive = false;
        jumpBtn.disabled = true;
        overlay.style.display = 'flex';
        startBtn.innerText = "🔄 Chơi lại";
        alert(`Game Over! Điểm của bạn: ${dinoScore}`);
    }
    animationId = requestAnimationFrame(gameLoop);
}

// ================= 7. TIỆN ÍCH AI CHAT BOX HỘP THOẠI =================
const aiChatBox = document.getElementById('ai-chat-box'), toggleAiBtn = document.getElementById('toggle-ai-btn');
const closeChatBtn = document.getElementById('close-chat-btn'), sendChatBtn = document.getElementById('send-chat-btn');
const chatInput = document.getElementById('chat-input'), chatContent = document.getElementById('chat-content');

toggleAiBtn.addEventListener('click', () => aiChatBox.classList.toggle('hidden'));
closeChatBtn.addEventListener('click', () => aiChatBox.classList.add('hidden'));

function appendMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `msg ${sender}`;
    msg.innerText = text;
    chatContent.appendChild(msg);
    chatContent.scrollTop = chatContent.scrollHeight;
}

function handleSendMessage() {
    const txt = chatInput.value.trim();
    if(!txt) return;
    appendMessage(txt, 'user');
    chatInput.value = '';
    
    setTimeout(() => {
        let aiReply = "Mình đã nhận thông tin. Hệ thống CI/CD hoạt động rất tốt!";
        if(txt.toLowerCase().includes('hello') || txt.toLowerCase().includes('chào')) aiReply = "Xin chào Tiến Hùng! Chúc bạn một ngày lập trình thật nhiều niềm vui.";
        else if(txt.toLowerCase().includes('dino')) aiReply = "Game Khủng long đã sẵn sàng, hãy nhấn Bắt đầu để thử thách điểm số nhé.";
        appendMessage(aiReply, 'ai');
    }, 800);
}
sendChatBtn.addEventListener('click', handleSendMessage);
chatInput.addEventListener('keypress', (e) => { if(e.key==='Enter') handleSendMessage(); });
