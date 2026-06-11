// ================= 1. ĐỒNG HỒ NGÀY & GIỜ =================
function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN');
    const dateStr = now.toLocaleDateString('vi-VN');
    document.getElementById('clock').innerText = `${dateStr} - ${timeStr}`;
}
setInterval(updateClock, 1000);
updateClock();


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
function pressCalc(value) {
    calcScreen.value += value;
}
function clearCalc() {
    calcScreen.value = '';
}
function calculateResult() {
    try {
        if (calcScreen.value) {
            calcScreen.value = eval(calcScreen.value);
        }
    } catch (error) {
        calcScreen.value = 'Lỗi biểu thức';
    }
}


// ================= 4. TRÒ CHƠI TÍNH NHẨM CỘNG ĐIỂM =================
let score = 0;
let correctAnswer = 0;

function generateQuestion() {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operators = ['+', '-', '*'];
    const op = operators[Math.floor(Math.random() * operators.length)];
    
    document.getElementById('question').innerText = `${num1} ${op} ${num2} = ?`;
    
    if (op === '+') correctAnswer = num1 + num2;
    else if (op === '-') correctAnswer = num1 - num2;
    else if (op === '*') correctAnswer = num1 * num2;
}

document.getElementById('submit-answer-btn').addEventListener('click', checkGameAnswer);
document.getElementById('game-answer').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkGameAnswer();
});

function checkGameAnswer() {
    const inputAns = parseInt(document.getElementById('game-answer').value);
    const feedback = document.getElementById('game-feedback');
    
    if (inputAns === correctAnswer) {
        score += 10;
        feedback.innerText = "Chính xác! +10 điểm 🎉";
        feedback.style.color = "#4caf50";
    } else {
        score = Math.max(0, score - 5);
        feedback.innerText = `Sai rồi! Đáp án đúng là ${correctAnswer} 😢`;
        feedback.style.color = "#f44336";
    }
    
    document.getElementById('game-score').innerText = score;
    document.getElementById('game-answer').value = '';
    generateQuestion();
}
generateQuestion();


// ================= 5. QUẢN LÝ GHI CHÚ (NOTES) =================
const noteInput = document.getElementById('note-input');
const saveNoteBtn = document.getElementById('save-note-btn');
const notesList = document.getElementById('notes-list');

// Tự động tải ghi chú cũ nếu có lưu từ trước
let savedNotes = JSON.parse(localStorage.getItem('my_web_notes')) || [];
function renderNotes() {
    notesList.innerHTML = '';
    savedNotes.forEach((note, index) => {
        const li = document.createElement('li');
        li.innerText = note;
        notesList.appendChild(li);
    });
}

saveNoteBtn.addEventListener('click', () => {
    const text = noteInput.value.trim();
    if (text) {
        savedNotes.unshift(text); // Thêm ghi chú mới lên đầu danh sách
        localStorage.setItem('my_web_notes', JSON.stringify(savedNotes));
        noteInput.value = '';
        renderNotes();
    }
});
renderNotes();


// ================= 6. MINI DINO JUMP GAME =================
const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
const jumpBtn = document.getElementById('jump-btn');
let dinoScore = 0;
let isJumping = false;
let isAlive = true;

function jump() {
    if (!isJumping && isAlive) {
        isJumping = true;
        dino.style.transition = "bottom 0.3s ease-out";
        dino.style.bottom = "80px";
        
        setTimeout(() => {
            dino.style.transition = "bottom 0.25s ease-in";
            dino.style.bottom = "0px";
            setTimeout(() => { isJumping = false; }, 250);
        }, 300);
    }
}

// Bấm phím Space hoặc nút để Nhảy
document.addEventListener('keydown', (e) => { if (e.code === 'Space') jump(); });
jumpBtn.addEventListener('click', jump);

// Khởi chạy vòng lặp di chuyển chướng ngại vật bằng JS
let cactusPosition = 100;
function gameLoop() {
    if (!isAlive) return;

    cactusPosition -= 1.5; // Tốc độ chạy của cây xương rồng
    if (cactusPosition < -5) {
        cactusPosition = 100;
        dinoScore += 1;
        document.getElementById('dino-score').innerText = `Điểm Dino: ${dinoScore}`;
    }
    cactus.style.left = cactusPosition + "%";

    // Kiểm tra va chạm (Độ phân giải tương đối)
    const dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));
    if (cactusPosition > 10 && cactusPosition < 14 && dinoBottom <= 30) {
        isAlive = false;
        alert(`Game Over! Khủng long va chạm cây xương rồng. Điểm của bạn: ${dinoScore}`);
        // Reset Game tự động
        cactusPosition = 100;
        dinoScore = 0;
        document.getElementById('dino-score').innerText = `Điểm Dino: 0`;
        isAlive = true;
    }
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
