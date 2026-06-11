// ================= Đồng hồ hệ thống =================
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = `${now.toLocaleDateString('vi-VN')} - ${now.toLocaleTimeString('vi-VN')}`;
}
setInterval(updateClock, 1000); updateClock();

// ================= Chế độ sáng/tối =================
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

// ================= Máy tính số học =================
const calcScreen = document.getElementById('calc-screen');
function pressCalc(value) { calcScreen.value += value; }
function clearCalc() { calcScreen.value = ''; }
function calculateResult() {
    try { if (calcScreen.value) calcScreen.value = eval(calcScreen.value); } 
    catch (e) { calcScreen.value = 'Lỗi'; }
}

// ================= Bàn phím tính nhẩm chuyên dụng =================
let mathScore = 0, correctAnswer = 0;
const gameAnswerInput = document.getElementById('game-answer');

function generateQuestion() {
    const n1 = Math.floor(Math.random() * 15) + 1, n2 = Math.floor(Math.random() * 15) + 1;
    const ops = ['+', '-', '*'], op = ops[Math.floor(Math.random() * ops.length)];
    document.getElementById('question').innerText = `${n1} ${op} ${n2} = ?`;
    correctAnswer = op === '+' ? n1 + n2 : op === '-' ? n1 - n2 : n1 * n2;
}

function pressMathPad(char) { gameAnswerInput.value += char; }
function clearMathPad() { gameAnswerInput.value = ''; }

function checkGameAnswer() {
    const ans = parseInt(gameAnswerInput.value), fb = document.getElementById('game-feedback');
    if (gameAnswerInput.value === '' || isNaN(ans)) return;
    
    if (ans === correctAnswer) { 
        mathScore += 10; 
        fb.innerText = "Chính xác! 🎉"; 
        fb.style.color = "#4caf50"; 
    } else { 
        mathScore = Math.max(0, mathScore - 5); 
        fb.innerText = `Sai rồi! Đáp án: ${correctAnswer}`; 
        fb.style.color = "#f44336"; 
    }
    document.getElementById('game-score').innerText = mathScore;
    gameAnswerInput.value = ''; 
    generateQuestion();
}
document.getElementById('submit-answer-btn').addEventListener('click', checkGameAnswer);
generateQuestion();

// ================= Sổ tay ghi chú =================
const noteInput = document.getElementById('note-input'), notesList = document.getElementById('notes-list');
let savedNotes = JSON.parse(localStorage.getItem('my_web_notes')) || [];

function renderNotes() {
    notesList.innerHTML = '';
    savedNotes.forEach((note, index) => {
        const li = document.createElement('li');
        li.className = 'note-item';
        
        const textSpan = document.createElement('span');
        textSpan.className = 'note-text';
        textSpan.innerText = note;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete-note';
        deleteBtn.innerText = 'Xóa';
        deleteBtn.onclick = () => deleteNote(index);
        
        li.appendChild(textSpan);
        li.appendChild(deleteBtn);
        notesList.appendChild(li);
    });
}

function deleteNote(index) {
    savedNotes.splice(index, 1);
    localStorage.setItem('my_web_notes', JSON.stringify(savedNotes));
    renderNotes();
}

document.getElementById('save-note-btn').addEventListener('click', () => {
    const val = noteInput.value.trim();
    if(val) { 
        savedNotes.unshift(val); 
        localStorage.setItem('my_web_notes', JSON.stringify(savedNotes)); 
        noteInput.value = ''; 
        renderNotes(); 
    }
});
renderNotes();

// ================= Game Khủng Long (Sửa logic báo thua màn hình) =================
const dino = document.getElementById('dino'), cactus = document.getElementById('cactus');
const jumpBtn = document.getElementById('jump-btn'), dinoOverlay = document.getElementById('dino-overlay');
const startDinoBtn = document.getElementById('start-game-btn');
const dinoStatus = document.getElementById('dino-status'), dinoFinalScore = document.getElementById('dino-final-score');

let dinoScore = 0, cactusPosition = 100, isJumping = false, isDinoAlive = false, dinoId = null;

function jump() {
    if (!isJumping && isDinoAlive) {
        isJumping = true;
        dino.style.transition = "bottom 0.25s ease-out";
        dino.style.bottom = "75px";
        setTimeout(() => {
            dino.style.transition = "bottom 0.22s ease-in";
            dino.style.bottom = "0px";
            setTimeout(() => { isJumping = false; }, 220);
        }, 250);
    }
}

document.addEventListener('keydown', (e) => { 
    if (e.code === 'Space') {
        if (document.activeElement.tagName === 'TEXTAREA') return;
        e.preventDefault(); jump(); 
    } 
});
jumpBtn.addEventListener('click', jump);

startDinoBtn.addEventListener('click', () => {
    dinoOverlay.style.display = 'none';
    isDinoAlive = true; jumpBtn.disabled = false;
    cactusPosition = 100; dinoScore = 0;
    document.getElementById('dino-score').innerText = `Điểm Dino: 0`;
    if(!dinoId) dinoId = requestAnimationFrame(dinoLoop);
});

function dinoLoop() {
    if (!isDinoAlive) { dinoId = null; return; }
    cactusPosition -= 1.3; 
    if (cactusPosition < -4) {
        cactusPosition = 100; dinoScore += 1;
        document.getElementById('dino-score').innerText = `Điểm Dino: ${dinoScore}`;
    }
    cactus.style.left = cactusPosition + "%";

    const containerWidth = document.querySelector('.dino-game-container').clientWidth;
    const cactusLeftPx = (cactusPosition / 100) * containerWidth;
    const dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));

    if (cactusLeftPx >= 40 && cactusLeftPx <= 62 && dinoBottom <= 25) {
        isDinoAlive = false; jumpBtn.disabled = true;
        
        // Cập nhật trạng thái thua lên màn hình
        dinoStatus.innerText = "GAME OVER";
        dinoFinalScore.innerText = `Điểm đạt được: ${dinoScore}`;
        startDinoBtn.innerText = "🔄 Chơi lại";
        dinoOverlay.style.display = 'flex';
        return;
    }
    dinoId = requestAnimationFrame(dinoLoop);
}

// ================= Game Rắn săn mồi (Sửa logic báo thua màn hình) =================
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const snakeOverlay = document.getElementById("snake-overlay");
const startSnakeBtn = document.getElementById("start-snake-btn");
const snakeStatus = document.getElementById("snake-status"), snakeFinalScore = document.getElementById("snake-final-score");

const box = 20;
let snake, food, snakeScore, d, snakeGameInterval = null;

document.addEventListener("keydown", (e) => {
    if (document.activeElement.tagName === 'TEXTAREA') return;
    if (e.key === "ArrowLeft" && d !== "RIGHT") d = "LEFT";
    else if (e.key === "ArrowUp" && d !== "DOWN") d = "UP";
    else if (e.key === "ArrowRight" && d !== "LEFT") d = "RIGHT";
    else if (e.key === "ArrowDown" && d !== "UP") d = "DOWN";
});

startSnakeBtn.addEventListener("click", () => {
    snakeOverlay.style.display = "none";
    initSnakeGame();
});

function initSnakeGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    };
    snakeScore = 0; d = "RIGHT";
    document.getElementById('snake-score').innerText = `Điểm Rắn: 0`;
    if(snakeGameInterval) clearInterval(snakeGameInterval);
    snakeGameInterval = setInterval(drawSnake, 160); 
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

function drawSnake() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#4caf50" : "#81c784";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "#e53935";
    ctx.beginPath();
    ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, 2 * Math.PI);
    ctx.fill();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === "LEFT") snakeX -= box;
    if (d === "UP") snakeY -= box;
    if (d === "RIGHT") snakeX += box;
    if (d === "DOWN") snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        snakeScore += 1;
        document.getElementById('snake-score').innerText = `Điểm Rắn: ${snakeScore}`;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(snakeGameInterval);
        
        // Cập nhật trạng thái thua lên màn hình thay vì dùng alert
        snakeStatus.innerText = "GAME OVER";
        snakeFinalScore.innerText = `Điểm đạt được: ${snakeScore}`;
        startSnakeBtn.innerText = "🔄 Chơi lại";
        snakeOverlay.style.display = "flex";
        return;
    }
    snake.unshift(newHead);
}

// ================= Hộp chat AI =================
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
        appendMessage("Mã nguồn giao diện mới và tính năng Game Over đã được đồng bộ!", 'ai');
    }, 600);
}
sendChatBtn.addEventListener('click', handleSendMessage);
chatInput.addEventListener('keypress', (e) => { if(e.key==='Enter') handleSendMessage(); });
