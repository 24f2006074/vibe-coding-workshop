// ===========================
// Emoji Catcher Game - Working Version
// ===========================

// DOM Elements
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const gameOverScreen = document.getElementById("game-over-screen");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// Resize canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let basket = { x: canvas.width / 2 - 40, y: canvas.height - 80, width: 80, height: 40 };
let emojis = [];
let score = 0;
let lives = 3;
let isGameRunning = false;

const emojiList = ["🍎", "🍋", "🍒", "🎈", "💣"];

// ===========================
// Game Setup
// ===========================

// Start button
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

function startGame() {
  // Reset state
  emojis = [];
  score = 0;
  lives = 3;
  isGameRunning = true;

  // UI transitions
  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");

  // Start loops
  updateScoreboard();
  spawnEmoji();
  gameLoop();
}

// ===========================
// Controls
// ===========================
document.addEventListener("keydown", (event) => {
  if (!isGameRunning) return;
  if (event.key === "ArrowLeft" && basket.x > 0) {
    basket.x -= 25;
  } else if (event.key === "ArrowRight" && basket.x + basket.width < canvas.width) {
    basket.x += 25;
  }
});

// ===========================
// Game Mechanics
// ===========================
function spawnEmoji() {
  if (!isGameRunning) return;

  const emoji = {
    x: Math.random() * (canvas.width - 40),
    y: 0,
    speed: 2 + Math.random() * 3,
    symbol: emojiList[Math.floor(Math.random() * emojiList.length)],
  };
  emojis.push(emoji);

  setTimeout(spawnEmoji, 1000 + Math.random() * 1500);
}

function gameLoop() {
  if (!isGameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw basket
  ctx.font = "40px Arial";
  ctx.fillText("🧺", basket.x, basket.y);

  // Draw and update emojis
  emojis.forEach((emoji, index) => {
    emoji.y += emoji.speed;
    ctx.fillText(emoji.symbol, emoji.x, emoji.y);

    // Collision check
    if (
      emoji.y + 30 >= basket.y &&
      emoji.x + 30 >= basket.x &&
      emoji.x <= basket.x + basket.width
    ) {
      // Collision
      if (emoji.symbol === "💣") {
        lives--;
      } else {
        score++;
      }
      emojis.splice(index, 1);
      updateScoreboard();
    }else if (emoji.y > canvas.height) {
      if (emoji.symbol !== "💣") {
        lives--; // only lose a life for missing good emojis
      }
      emojis.splice(index, 1);
      updateScoreboard();
    }
  });

  // Check Game Over
  if (lives <= 0) {
    endGame();
    return;
  }

  requestAnimationFrame(gameLoop);
}

function updateScoreboard() {
  scoreDisplay.textContent = score;
  livesDisplay.textContent = "❤️".repeat(lives);
}

// ===========================
// Game Over
// ===========================
function endGame() {
  isGameRunning = false;
  gameContainer.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");
}
