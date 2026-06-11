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
let mathScore = 0, correctAnswer = 0;
function generateQuestion() {
    const n1 = Math.floor(Math.random() * 20) + 1, n2 = Math.floor(Math.random() * 20) + 1;
    const ops = ['+', '-', '*'], op = ops[Math.floor(Math.random() * ops.length)];
    document.getElementById('question').innerText = `${n1} ${op} ${n2} = ?`;
    correctAnswer = op === '+' ? n1 + n2 : op === '-' ? n1 - n2 : n1 * n2;
}
function checkGameAnswer() {
    const ans = parseInt(document.getElementById('game-answer').value), fb = document.getElementById('game-feedback');
    if (ans === correctAnswer) { mathScore += 10; fb.innerText = "Chính xác! +10đ 🎉"; fb.style.color = "#4caf50"; } 
    else { mathScore = Math.max(0, mathScore - 5); fb.innerText = `Sai rồi! Đáp án: ${correctAnswer} 😢`; fb.style.color = "#f44336"; }
    document.getElementById('game-score').innerText = mathScore;
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


// ================= 6. SỬA LỖI KHỦNG LONG VA CHẠM CHUẨN XÁC =================
const dino = document.getElementById('dino'), cactus = document.getElementById('cactus');
const jumpBtn = document.getElementById('jump-btn'), dinoOverlay = document.getElementById('dino-overlay');
const startDinoBtn = document.getElementById('start-game-btn');

let dinoScore = 0, cactusPosition = 100, isJumping = false, isDinoAlive = false, dinoId = null;

function jump() {
    if (!isJumping && isDinoAlive) {
        isJumping = true;
        dino.style.transition = "bottom 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        dino.style.bottom = "85px"; // Chiều cao nhảy lên
        setTimeout(() => {
            dino.style.transition = "bottom 0.22s cubic-bezier(0.55, 0.085, 0.68, 0.53)";
            dino.style.bottom = "0px";
            setTimeout(() => { isJumping = false; }, 220);
        }, 250);
    }
}

// BẮT SỰ KIỆN KHÔNG BỊ LỖI CHAT: Chỉ khi con trỏ KHÔNG nằm trong ô nhập dữ liệu thì mới bắt Space để nhảy
document.addEventListener('keydown', (e) => { 
    if (e.code === 'Space') { 
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return; // Đang gõ chữ thì cho phép cách bình thường
        }
        e.preventDefault(); 
        jump(); 
    } 
});
jumpBtn.addEventListener('click', jump);

startDinoBtn.addEventListener('click', () => {
    dinoOverlay.style.display = 'none';
    isDinoAlive = true;
    jumpBtn.disabled = false;
    cactusPosition = 100;
    dinoScore = 0;
    document.getElementById('dino-score').innerText = `Điểm Dino: 0`;
    if(!dinoId) dinoId = requestAnimationFrame(dinoLoop);
});

function dinoLoop() {
    if (!isDinoAlive) { dinoId = null; return; }
    cactusPosition -= 1.6; // Tốc độ di chuyển cây
    if (cactusPosition < -4) {
        cactusPosition = 100; dinoScore += 1;
        document.getElementById('dino-score').innerText = `Điểm Dino: ${dinoScore}`;
    }
    cactus.style.left = cactusPosition + "%";

    // XỬ LÝ VA CHẠM CHUẨN XÁC: Đổi sang Pixel tương đối của khung chứa
    const containerWidth = document.querySelector('.dino-game-container').clientWidth;
    const cactusLeftPx = (cactusPosition / 100) * containerWidth;
    const dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));

    // Khủng long nằm ở vị trí Left cố định: 50px đến 74px (Rộng 24px). Cây rộng 14px.
    // Chỉ kích hoạt va chạm khi Tọa độ X trùng nhau VÀ Khủng long chưa nhảy cao hơn cây (28px).
    if (cactusLeftPx >= 50 && cactusLeftPx <= 74 && dinoBottom <= 28) {
        isDinoAlive = false;
        jumpBtn.disabled = true;
        dinoOverlay.style.display = 'flex';
        startDinoBtn.innerText = "🔄 Chơi lại";
        alert(`Game Over Dino! Điểm của bạn: ${dinoScore}`);
    }
    dinoId = requestAnimationFrame(dinoLoop);
}


// ================= 7. THÊM TRÒ CHƠI RẮN SĂN MỒI (SNAKE) =================
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const snakeOverlay = document.getElementById("snake-overlay");
const startSnakeBtn = document.getElementById("start-snake-btn");

const box = 20; // Kích thước mỗi ô vuông
let snake, food, snakeScore, d, snakeGameInterval = null;

// Điều khiển hướng di chuyển của rắn bằng các phím mũi tên
document.addEventListener("keydown", (e) => {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
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
    snakeScore = 0;
    document.getElementById('snake-score').innerText = `Điểm Rắn: 0`;
    d = "RIGHT"; // Hướng ban đầu
    if(snakeGameInterval) clearInterval(snakeGameInterval);
    snakeGameInterval = setInterval(drawSnake, 130); // Tốc độ rắn chạy
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

function drawSnake() {
    // Vẽ nền đen cho bàn cờ
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Vẽ thân rắn
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#4caf50" : "#81c784"; // Đầu màu đậm, thân nhạt hơn
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Vẽ Quả táo (Thức ăn màu đỏ)
    ctx.fillStyle = "#e53935";
    ctx.beginPath();
    ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, 2 * Math.PI);
    ctx.fill();

    // Vị trí đầu cũ của rắn
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Xác định hướng đi kế tiếp
    if (d === "LEFT") snakeX -= box;
    if (d === "UP") snakeY -= box;
    if (d === "RIGHT") snakeX += box;
    if (d === "DOWN") snakeY += box;

    // Nếu ăn được mồi
    if (snakeX === food.x && snakeY === food.y) {
        snakeScore += 1;
        document.getElementById('snake-score').innerText = `Điểm Rắn: ${snakeScore}`;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop(); // Loại bỏ đốt đuôi cuối nếu không ăn mồi
    }

    // Tạo đầu mới cho Rắn
    let newHead = { x: snakeX, y: snakeY };

    // Xử lý các điều kiện Thua (Chạm tường hoặc tự cắn đuôi)
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(snakeGameInterval);
        snakeOverlay.style.display = "flex";
        startSnakeBtn.innerText = "🔄 Chơi lại Rắn";
        alert(`Game Over Rắn Săn Mồi! Điểm của bạn: ${snakeScore}`);
        return;
    }

    snake.unshift(newHead);
}


// ================= 8. TIỆN ÍCH AI CHAT BOX =================
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
        let aiReply = "Mình đã cập nhật sửa hoàn tất lỗi phím dấu cách cách và căn chỉnh cấu hình va chạm cho bạn!";
        if(txt.toLowerCase().includes('hello') || txt.toLowerCase().includes('chào')) aiReply = "Xin chào Tiến Hùng! Trò chơi Rắn săn mồi và Khủng long nhảy đã vận hành trơn tru rồi nhé.";
        appendMessage(aiReply, 'ai');
    }, 800);
}
sendChatBtn.addEventListener('click', handleSendMessage);
chatInput.addEventListener('keypress', (e) => { if(e.key==='Enter') handleSendMessage(); });
