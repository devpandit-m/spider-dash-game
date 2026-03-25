// --- SECURITY CHECK (Sabse Upar) ---
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = "login.html"; // Wapas login par bhej dega
}

const player = document.getElementById("player");
const container = document.getElementById("game-container");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const menu = document.getElementById("menu");
const menuTitle = document.getElementById("menu-title");
const menuMsg = document.getElementById("menu-msg");
const startBtn = document.getElementById("start-btn");
const quitBtn = document.getElementById("quit-btn");
const skyObj = document.getElementById("sky-obj");

let score = 0;
let isJumping = false;
let isGameOver = true;
let isNight = false;
let gameSpeed = 8;
const birdTypes = ["🐦", "🦅", "🦉", "🕊️", "🦆"];

// Load High Score & Player Name
let highScore = localStorage.getItem("spiderBestScore") || 0;
let playerName = localStorage.getItem("currentPlayer") || "Player";
highScoreElement.innerText = "Best: " + highScore;
menuMsg.innerHTML = `Welcome ${playerName}! <br> Jump over LOW birds. Stay still for HIGH birds.`;

// Start Game
startBtn.addEventListener("click", () => {
    menu.style.display = "none";
    isGameOver = false;
    score = 0;
    gameSpeed = 8;
    isNight = false;
    container.classList.remove("night-mode");
    skyObj.innerText = "☀️";
    scoreElement.innerText = "Score: 0";
    document.querySelectorAll('.bird').forEach(b => b.remove());
    spawnBirds();
});

// Quit Logic (Isse Logout ho jayega)
quitBtn.addEventListener("click", () => {
    if (confirm("Logout and Exit?")) {
        localStorage.removeItem('isLoggedIn'); // Permission clear
        window.location.href = "login.html"; 
    }
});

function jump() {
    if (isJumping || isGameOver) return;
    isJumping = true;
    player.classList.add("animate-jump");
    setTimeout(() => {
        player.classList.remove("animate-jump");
        isJumping = false;
    }, 600);
}

// Controls
window.addEventListener("keydown", (e) => { 
    if (e.code === "Space") { e.preventDefault(); jump(); } 
});
container.addEventListener("mousedown", jump);

function updateSky() {
    if (score > 0 && score % 10 === 0) {
        if (!isNight) {
            container.classList.add("night-mode");
            skyObj.innerText = "🌙";
            isNight = true;
        } else {
            container.classList.remove("night-mode");
            skyObj.innerText = "☀️";
            isNight = false;
        }
    }
}

function spawnBirds() {
    if (isGameOver) return;

    const bird = document.createElement("div");
    bird.classList.add("bird");
    bird.innerText = birdTypes[Math.floor(Math.random() * birdTypes.length)];
    
    let isHigh = Math.random() > 0.5;
    bird.style.bottom = isHigh ? "220px" : "15px"; 
    bird.style.left = "950px"; 
    container.appendChild(bird);

    let pos = 950;
    let currentSpeed = gameSpeed + (score * 0.15); 

    function move() {
        if (isGameOver) return;
        pos -= currentSpeed;
        bird.style.left = pos + "px";

        let pRect = player.getBoundingClientRect();
        let bRect = bird.getBoundingClientRect();

        // Simple Collision
        if (pRect.right > bRect.left + 20 && pRect.left < bRect.right - 20 && 
            pRect.bottom > bRect.top + 20 && pRect.top < bRect.bottom - 20) {
            endGame();
        }

        if (pos > -70) {
            requestAnimationFrame(move);
        } else {
            bird.remove();
            score++;
            scoreElement.innerText = "Score: " + score;
            updateSky();
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("spiderBestScore", highScore);
                highScoreElement.innerText = "Best: " + highScore;
            }
        }
    }
    requestAnimationFrame(move);

    let spawnGap = Math.max(500, 1500 - (score * 25));
    setTimeout(spawnBirds, Math.random() * 500 + spawnGap);
}

function endGame() {
    isGameOver = true;
    menuTitle.innerText = "GAME OVER";
    menuMsg.innerHTML = `Final Score: ${score} <br> Personal Best: ${highScore}`;
    startBtn.innerText = "TRY AGAIN";
    menu.style.display = "flex";
}
