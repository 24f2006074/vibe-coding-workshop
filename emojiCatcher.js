let score = 0;
let gameOver = false;
const basket = document.getElementById('basket');
const gameArea = document.getElementById('gameArea');

document.addEventListener('keydown', controlBasket);

function controlBasket(event) {
    const basketRect = basket.getBoundingClientRect();
    if (event.key === 'ArrowLeft' && basketRect.left > 0) {
        basket.style.left = `${basketRect.left - 20}px`;
    }
    if (event.key === 'ArrowRight' && basketRect.right < window.innerWidth) {
        basket.style.left = `${basketRect.left + 20}px`;
    }
}

function dropEmoji() {
    const emoji = document.createElement('div');
    emoji.className = 'emoji';
    emoji.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
    gameArea.appendChild(emoji);
    let emojiFallInterval = setInterval(() => {
        const emojiRect = emoji.getBoundingClientRect();
        if (emojiRect.bottom >= window.innerHeight) {
            clearInterval(emojiFallInterval);
            gameOver = true;
            alert('Game Over! Your score: ' + score);
        } else {
            emoji.style.top = `${emojiRect.top + 5}px`;
        }
        checkCatch(emoji, emojiFallInterval);
    }, 100);
}

function checkCatch(emoji, emojiFallInterval) {
    const basketRect = basket.getBoundingClientRect();
    const emojiRect = emoji.getBoundingClientRect();
    if (
        emojiRect.bottom >= basketRect.top &&
        emojiRect.right >= basketRect.left &&
        emojiRect.left <= basketRect.right
    ) {
        score++;
        clearInterval(emojiFallInterval);
        emoji.remove();
    }
}

setInterval(() => {
    if (!gameOver) dropEmoji();
}, 2000);
