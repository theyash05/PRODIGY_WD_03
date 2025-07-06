const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restart');
const twoPlayerButton = document.getElementById('two-player');
const vsAIButton = document.getElementById('vs-ai');
const overlay = document.getElementById('celebration-overlay');
const overlayMsg = document.getElementById('celebration-message');
const confettiDiv = document.querySelector('.confetti');

let board, currentPlayer, gameActive, vsAI;

function initBoard() {
    board = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    statusElement.textContent = `Player ${currentPlayer}'s turn`;
    renderBoard();
}

function renderBoard() {
    boardElement.innerHTML = '';
    board.forEach((cell, idx) => {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'cell';
        cellDiv.textContent = cell;
        cellDiv.addEventListener('click', () => handleCellClick(idx));
        boardElement.appendChild(cellDiv);
    });
}

function showCelebration(message, isWin) {
    overlayMsg.textContent = message;
    overlay.classList.remove('hidden');
    if (isWin) launchConfetti();
    // Hide overlay after 3 seconds
    setTimeout(hideCelebration, 3000);
}

function hideCelebration() {
    overlay.classList.add('hidden');
    confettiDiv.innerHTML = '';
}

function launchConfetti() {
    confettiDiv.innerHTML = '';
    const colors = ['#ff0', '#0ff', '#f0f', '#0f0', '#f00', '#00f'];
    for (let i = 0; i < 40; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti-piece';
        conf.style.background = colors[Math.floor(Math.random()*colors.length)];
        conf.style.left = Math.random()*100 + 'vw';
        conf.style.animationDelay = (Math.random()*0.7) + 's';
        confettiDiv.appendChild(conf);
    }
}

function handleCellClick(idx) {
    if (!gameActive || board[idx]) return;
    board[idx] = currentPlayer;
    renderBoard();
    if (checkWin(currentPlayer)) {
        statusElement.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        showCelebration(`Player ${currentPlayer} Wins! 🎉`, true);
        return;
    }
    if (board.every(cell => cell)) {
        statusElement.textContent = "It's a draw!";
        gameActive = false;
        showCelebration("It's a Draw! 🤝", false);
        return;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusElement.textContent = `Player ${currentPlayer}'s turn`;
    if (vsAI && currentPlayer === 'O' && gameActive) {
        setTimeout(aiMove, 400);
    }
}

function checkWin(player) {
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return winPatterns.some(pattern =>
        pattern.every(idx => board[idx] === player)
    );
}

function aiMove() {
    // Simple AI: pick random empty cell
    const emptyCells = board.map((cell, idx) => cell ? null : idx).filter(idx => idx !== null);
    if (emptyCells.length === 0) return;
    const move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    handleCellClick(move);
}

twoPlayerButton.onclick = () => {
    hideCelebration();
    vsAI = false;
    initBoard();
};

vsAIButton.onclick = () => {
    hideCelebration();
    vsAI = true;
    initBoard();
};

restartButton.onclick = () => {
    hideCelebration();
    initBoard();
};

// Start with 2 player mode by default
vsAI = false;
initBoard();
