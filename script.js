// ==================== 1. TÍNH NĂNG: NGÀY VÀ GIỜ HỆ THỐNG ====================
function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = now.toLocaleDateString('vi-VN');
    document.getElementById('datetime-display').innerText = `${dateStr} - ${timeStr}`;
}
setInterval(updateClock, 1000);
updateClock();

// ==================== 2. TÍNH NĂNG: ĐỔI GIAO DIỆN SÁNG / TỐI ====================
const themeToggleBtn = document.getElementById('theme-toggle');
themeToggleBtn.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.replace('dark-theme', 'light-theme');
        themeToggleBtn.innerText = "🌙 Chế độ Tối";
    } else {
        document.body.classList.replace('light-theme', 'dark-theme');
        themeToggleBtn.innerText = "☀️ Chế độ Sáng";
    }
});

// ==================== 3. TÍNH NĂNG: MÁY TÍNH SỐ ====================
const calcScreen = document.getElementById('calc-screen');
function pressCalc(value) {
    calcScreen.value += value;
}
function clearCalc() {
    calcScreen.value = '';
}
function calculateResult() {
    try {
        if (calcScreen.value) {
            calcScreen.value = eval(calcScreen.value); // Xử lý phép tính cơ bản
        }
    } catch (error) {
        calcScreen.value = 'Lỗi!';
    }
}

// ==================== 4. TÍNH NĂNG: GHI CHÚ TỰ ĐỘNG LƯU (LOCALSTORAGE) ====================
const notesArea = document.getElementById('notes-area');
// Tải ghi chú cũ lên nếu có
if(localStorage.getItem('chunkbase_notes')) {
    notesArea.value = localStorage.getItem('chunkbase_notes');
}
// Lắng nghe sự kiện gõ phím để lưu luôn
notesArea.addEventListener('input', () => {
    localStorage.setItem('chunkbase_notes', notesArea.value);
});

// ==================== 5. TÍNH NĂNG: TRÒ CHƠI KHỦNG LONG (DINO GAME) ====================
const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
const scoreSpan = document.getElementById('score');
const gameContainer = document.getElementById('game-container');

let score = 0;
let isPlaying = false;
let gameLoop;

function jump() {
    if (!dino.classList.contains('jump')) {
        dino.classList.add('jump');
        setTimeout(() => {
            dino.classList.remove('jump');
        }, 500);
    }
}

// Nhảy bằng phím Space (Phím cách)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault(); // Tránh bị cuộn trang khi nhấn Space ngoài ý muốn
        jump();
    }
});

// Nhảy bằng cách bấm chuột thẳng vào khung Game
gameContainer.addEventListener('click', () => {
    jump();
});

function startGame() {
    // Reset thông số
    score = 0;
    scoreSpan.innerText = score;
    cactus.style.left = '100%';
    cactus.style.animation = 'blockAnim 1.5s infinite linear';
    isPlaying = true;
    
    // Tạo chuyển động cho cây xương rồng bằng css injection để dễ reset
    const style = document.createElement('style');
    style.id = 'dino-animation-sheet';
    style.innerHTML = `@keyframes blockAnim { 0% { left: 100%; } 100% { left: -20px; } }`;
    document.head.appendChild(style);

    clearInterval(gameLoop);
    
    // Kiểm tra va chạm định kỳ mỗi 10ms
    gameLoop = setInterval(() => {
        let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));
        let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue('left'));

        // Cộng điểm khi né được xương rồng
        if (cactusLeft < 50 && cactusLeft > 40 && isPlaying) {
            score++;
            scoreSpan.innerText = score;
        }

        // Điều kiện va chạm vật lý
        if (cactusLeft < 90 && cactusLeft > 50 && dinoTop <= 40) {
            // Thua game
            cactus.style.animation = 'none';
            const oldSheet = document.getElementById('dino-animation-sheet');
            if(oldSheet) oldSheet.remove();
            isPlaying = false;
            clearInterval(gameLoop);
            alert('Game Over! Điểm của bạn là: ' + score);
        }
    }, 50);
}

// Tự động chạy game khi load trang
startGame();
