// --- 1. ĐỒNG HỒ NGÀY GIỜ LIÊN TỤC ---
function updateClock() {
    const now = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    document.getElementById('live-clock').innerText = now.toLocaleString('vi-VN', options);
}
setInterval(updateClock, 1000);
updateClock();

// --- 2. ĐỔI GIAO DIỆN SÁNG / TỐI (THEME TOGGLE) ---
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    if (document.body.classList.contains('light-theme')) {
        themeToggle.innerText = "🌙 Chế độ Tối";
    } else {
        themeToggle.innerText = "☀️ Chế độ Sáng";
    }
});

// --- 3. MÁY TÍNH BỎ TÚI ---
const calcScreen = document.getElementById('calc-screen');
function pressCalc(val) { calcScreen.value += val; }
function clearCalc() { calcScreen.value = ''; }
function calculateResult() {
    try { calcScreen.value = eval(calcScreen.value); } 
    catch (e) { calcScreen.value = 'Lỗi biểu thức'; }
}

// --- 4. ỨNG DỤNG GHI CHÚ NHANH ---
function saveNote() {
    const text = document.getElementById('note-input').value;
    localStorage.setItem('chunk_user_note', text);
    const status = document.getElementById('saved-note-status');
    status.innerText = "✅ Đã lưu ghi chú vào bộ nhớ máy!";
    status.style.color = "#4caf50";
    setTimeout(() => status.innerText = "", 2500);
}
// Tự động tải lại ghi chú cũ nếu có khi load trang
window.onload = function() {
    const saved = localStorage.getItem('chunk_user_note');
    if(saved) document.getElementById('note-input').value = saved;
    generateMathQuestion();
}

// --- 5. TRÒ CHƠI TÍNH NHẨM CỘNG ĐIỂM ---
let num1, num2, currentAnswer;
let currentScore = 0;

function generateMathQuestion() {
    num1 = Math.floor(Math.random() * 20) + 5;
    num2 = Math.floor(Math.random() * 20) + 5;
    const operations = ['+', '-', '*'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    
    if(op === '+') currentAnswer = num1 + num2;
    else if(op === '-') currentAnswer = num1 - num2;
    else currentAnswer = num1 * num2;

    document.getElementById('math-quest').innerText = `${num1} ${op} ${num2}`;
    document.getElementById('math-answer').value = '';
}

function checkMathAnswer() {
    const userAnswer = parseInt(document.getElementById('math-answer').value);
    if (userAnswer === currentAnswer) {
        currentScore += 10;
        alert("Chính xác! +10 điểm");
    } else {
        currentScore = Math.max(0, currentScore - 5);
        alert(`Sai rồi! Đáp án đúng phải là: ${currentAnswer}`);
    }
    document.getElementById('game-score').innerText = currentScore;
    generateMathQuestion();
}

// --- 6. TRÒ CHƠI KHỦNG LONG NHẢY (CANVAS GAME) ---
const canvas = document.getElementById('dinoCanvas');
const ctx = canvas.getContext('2d');

let dino = { x: 50, y: 150, width: 20, height: 30, dy: 0, jumpForce: 10, g: 0.6, grounded: false };
let obstacles = [];
let dinoGameInterval;
let isGameOver = false;
let spawnTimer = 0;

function drawDino() {
    ctx.fillStyle = '#555555'; // Màu khủng long
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
}

function dinoJump() {
    if (dino.grounded && !isGameOver) {
        dino.dy = -dino.jumpForce;
        dino.grounded = false;
    }
}

// Bắt sự kiện phím Cách (Space) để nhảy tiện lợi
window.addEventListener('keydown', (e) => {
    if(e.code === "Space") {
        e.preventDefault(); // Tránh cuộn trang khi nhấn Space chơi game
        dinoJump();
    }
});

function spawnObstacle() {
    spawnTimer++;
    if (spawnTimer > 90) {
        obstacles.push({ x: 800, y: 160, width: 15, height: 20, speed: 5 });
        spawnTimer = 0;
    }
}

function updateDinoGame() {
    if (isGameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Đường mặt đất
    ctx.strokeStyle = '#999';
    ctx.beginPath(); ctx.moveTo(0, 180); ctx.lineTo(800, 180); ctx.stroke();

    // Vật lý Trọng lực Khủng long
    dino.y += dino.dy;
    if (dino.y + dino.height < 180) {
        dino.dy += dino.g;
        dino.grounded = false;
    } else {
        dino.y = 180 - dino.height;
        dino.dy = 0;
        dino.grounded = true;
    }
    drawDino();

    // Xử lý chướng ngại vật (Xương rồng)
    spawnObstacle();
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.x -= obs.speed;

        ctx.fillStyle = '#1b5e20'; // Màu cây xương rồng
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Kiểm tra va chạm dữ liệu hình khối
        if (dino.x < obs.x + obs.width && dino.x + dino.width > obs.x &&
            dino.y < obs.y + obs.height && dino.y + dino.height > obs.y) {
            isGameOver = true;
            ctx.fillStyle = 'red';
            ctx.font = '24px sans-serif';
            ctx.fillText('GAME OVER!', 330, 100);
            clearInterval(dinoGameInterval);
        }

        if (obs.x + obs.width < 0) obstacles.splice(i, 1);
    }
}

function restartDinoGame() {
    clearInterval(dinoGameInterval);
    isGameOver = false;
    obstacles = [];
    dino.y = 150; dino.dy = 0;
    spawnTimer = 0;
    dinoGameInterval = setInterval(updateDinoGame, 1000/60);
}

// Bấm trực tiếp vào vùng canvas để nhảy
canvas.addEventListener('click', dinoJump);
// Khởi chạy game ngay
restartDinoGame();
