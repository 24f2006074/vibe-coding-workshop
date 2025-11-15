// ===========================
// Emoji Catcher Game - Enhanced Edition 🎮
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

// Adjust canvas for device screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Basket configuration
let basket = {
  x: canvas.width / 2 - 60,
  y: canvas.height - 120,
  width: 120,
  height: 60,
};

// Emojis and game state
let emojis = [];
let score = 0;
let lives = 3;
let isGameRunning = false;

const emojiList = ["🍎", "🍋", "🍉", "🍒", "🎈", "💣"];

// ===========================
// 🎵 Sound Effects
// ===========================
const sounds = {
  catch: new Audio("catch.mp3"), // when catching a fruit
  bomb: new Audio("bomb.mp3"),   // when catching a bomb
  miss: new Audio("miss.mp3"),   // when missing a fruit
  bgm: new Audio("bgm.mp3"),     // background music
};
sounds.bgm.loop = true;

// ===========================
// 🚀 Start & Restart Game
// ===========================
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

function startGame() {
  emojis = [];
  score = 0;
  lives = 3;
  isGameRunning = true;

  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");

  sounds.bgm.currentTime = 0;
  sounds.bgm.play().catch(() => {
    console.log("Background music will start on user action.");
  });

  updateScoreboard();
  spawnEmoji();
  gameLoop();
}

// ===========================
// 🎮 Controls
// ===========================
document.addEventListener("keydown", (event) => {
  if (!isGameRunning) return;
  if (event.key === "ArrowLeft" && basket.x > 0) {
    basket.x -= 30;
  } else if (event.key === "ArrowRight" && basket.x + basket.width < canvas.width) {
    basket.x += 30;
  }
});

// ===========================
// 🍎 Emoji Spawning
// ===========================
function spawnEmoji() {
  if (!isGameRunning) return;

  const emoji = {
    x: Math.random() * (canvas.width - 60),
    y: 0,
    speed: 2 + Math.random() * 4,
    symbol: emojiList[Math.floor(Math.random() * emojiList.length)],
  };
  emojis.push(emoji);

  setTimeout(spawnEmoji, 900 + Math.random() * 1000);
}

// ===========================
// 🎨 Game Loop
// ===========================
function gameLoop() {
  if (!isGameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw basket
  ctx.font = "70px Arial";
  ctx.fillText("🧺", basket.x, basket.y);

  // Draw and update emojis
  ctx.font = "60px Arial";
  emojis.forEach((emoji, index) => {
    emoji.y += emoji.speed;
    ctx.fillText(emoji.symbol, emoji.x, emoji.y);

    // Collision check
    if (
      emoji.y + 50 >= basket.y &&
      emoji.x + 50 >= basket.x &&
      emoji.x <= basket.x + basket.width
    ) {
      if (emoji.symbol === "💣") {
        lives--;
        sounds.bomb.play();
      } else {
        score++;
        sounds.catch.play();
      }
      emojis.splice(index, 1);
      updateScoreboard();
    }
    // Missed emoji
    else if (emoji.y > canvas.height) {
      if (emoji.symbol !== "💣") {
        lives--;
        sounds.miss.play();
      }
      emojis.splice(index, 1);
      updateScoreboard();
    }
  });

  // Game over
  if (lives <= 0) {
    endGame();
    return;
  }

  requestAnimationFrame(gameLoop);
}

// ===========================
// 🧮 Score + Lives Display
// ===========================
function updateScoreboard() {
  scoreDisplay.textContent = score;
  livesDisplay.textContent = "❤️".repeat(lives);
}

// ===========================
// 🔚 End Game
// ===========================
function endGame() {
  isGameRunning = false;
  sounds.bgm.pause();
  gameContainer.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");
}
