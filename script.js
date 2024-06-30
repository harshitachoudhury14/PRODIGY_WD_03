const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const restartBtn = document.getElementById('restartBtn');
const turnIndicator = document.getElementById('turnIndicator');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const aiBtn = document.getElementById('aiBtn');

let currentPlayer = 'X';
let isTwoPlayer = true;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const startGame = () => {
    currentPlayer = 'X';
    turnIndicator.textContent = `Turn: Player 1 (X)`;
    cells.forEach(cell => {
        cell.classList.remove('X');
        cell.classList.remove('O');
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
};

const handleClick = (e) => {
    const cell = e.target;
    cell.classList.add(currentPlayer);
    if (checkWin(currentPlayer)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        switchPlayer();
        if (!isTwoPlayer && currentPlayer === 'O') {
            setTimeout(aiMove, 500); // AI makes its move after a short delay
        }
    }
};

const switchPlayer = () => {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    turnIndicator.textContent = `Turn: ${currentPlayer === 'X' ? 'Player 1 (X)' : (isTwoPlayer ? 'Player 2 (O)' : 'AI (O)')}`;
};

const checkWin = (player) => {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(player);
        });
    });
};

const isDraw = () => {
    return [...cells].every(cell => {
        return cell.classList.contains('X') || cell.classList.contains('O');
    });
};

const endGame = (draw) => {
    if (draw) {
        turnIndicator.textContent = 'Draw!';
    } else {
        turnIndicator.textContent = `${currentPlayer} Wins!`;
    }
    cells.forEach(cell => cell.removeEventListener('click', handleClick));
};

const aiMove = () => {
    const bestMove = getBestMove();
    if (bestMove !== -1) {
        cells[bestMove].click();
    }
};

const getBestMove = () => {
    let bestScore = -Infinity;
    let move = -1;

    cells.forEach((cell, index) => {
        if (!cell.classList.contains('X') && !cell.classList.contains('O')) {
            cell.classList.add('O');
            let score = minimax(0, false);
            cell.classList.remove('O');
            if (score > bestScore) {
                bestScore = score;
                move = index;
            }
        }
    });

    return move;
};

const minimax = (depth, isMaximizing) => {
    if (checkWin('O')) return 10 - depth;
    if (checkWin('X')) return depth - 10;
    if (isDraw()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        cells.forEach(cell => {
            if (!cell.classList.contains('X') && !cell.classList.contains('O')) {
                cell.classList.add('O');
                let score = minimax(depth + 1, false);
                cell.classList.remove('O');
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        cells.forEach(cell => {
            if (!cell.classList.contains('X') && !cell.classList.contains('O')) {
                cell.classList.add('X');
                let score = minimax(depth + 1, true);
                cell.classList.remove('X');
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
};

restartBtn.addEventListener('click', startGame);
twoPlayerBtn.addEventListener('click', () => {
    isTwoPlayer = true;
    startGame();
});
aiBtn.addEventListener('click', () => {
    isTwoPlayer = false;
    startGame();
});

startGame();
