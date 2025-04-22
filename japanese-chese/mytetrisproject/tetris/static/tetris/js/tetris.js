const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 24;

let canvas, ctx;
let board = [];
let currentPiece = null;
let score = 0;
let requestId = null;
let gameOver = false;
let dropSpeed = 500;

const SHAPES = [
  [[1,1,1,1]],
  [[1,1],[1,1]],
  [[0,1,0],[1,1,1]],
  [[1,0,0],[1,1,1]],
  [[0,0,1],[1,1,1]],
  [[0,1,1],[1,1,0]],
  [[1,1,0],[0,1,1]]
];

const SHAPE_COLORS = [
  'cyan', 'yellow', 'purple', 'blue', 'orange', 'green', 'red'
];

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    initBoard();
    drawBoard();
    document.addEventListener('keydown', handleKey);

    document.getElementById("speed-slow").onclick = () => { dropSpeed = 800; };
    document.getElementById("speed-normal").onclick = () => { dropSpeed = 500; };
    document.getElementById("speed-fast").onclick = () => { dropSpeed = 200; };
};

function initBoard() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(-1));
}

function generatePiece(id = null) {
    const shapeId = id !== null ? id : Math.floor(Math.random() * SHAPES.length);
    return {
        shape: SHAPES[shapeId],
        color: SHAPE_COLORS[shapeId],
        id: shapeId,
        row: 0,
        col: Math.floor(COLS / 2) - Math.floor(SHAPES[shapeId][0].length / 2)
    };
}

function newPiece() {
    currentPiece = generatePiece();
}

function changePiece(delta) {
    if (!currentPiece) return;
    let newId = (currentPiece.id + delta + SHAPES.length) % SHAPES.length;
    const oldRow = currentPiece.row;
    const oldCol = currentPiece.col;
    const backup = currentPiece;
    currentPiece = generatePiece(newId);
    currentPiece.row = oldRow;
    currentPiece.col = oldCol;
    if (collision()) {
        currentPiece = backup;
    }
    drawBoard();
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] !== -1) {
                drawBlock(c, r, SHAPE_COLORS[board[r][c]]);
            }
        }
    }
    if (currentPiece) {
        for (let r = 0; r < currentPiece.shape.length; r++) {
            for (let c = 0; c < currentPiece.shape[r].length; c++) {
                if (currentPiece.shape[r][c]) {
                    drawBlock(currentPiece.col + c, currentPiece.row + r, currentPiece.color);
                }
            }
        }
    }
    document.getElementById("score").innerText = "Score: " + score;
}

function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function handleKey(e) {
    if (!currentPiece || gameOver) return;
    switch(e.key) {
        case 'ArrowLeft': movePiece(-1); break;
        case 'ArrowRight': movePiece(1); break;
        case 'ArrowDown': dropPiece(); break;
        case 'ArrowUp': rotatePiece(); break;
        case '<':
        case ',': changePiece(+1); break;
        case '>':
        case '.': changePiece(-1); break;
        case 'Enter':
            e.preventDefault(); // Enterでフォーム送信など防止
            hardDrop();
            break;
    }
}

function movePiece(dir) {
    currentPiece.col += dir;
    if (collision()) currentPiece.col -= dir;
    drawBoard();
}

function rotatePiece() {
    const shape = currentPiece.shape;
    const rotated = shape[0].map((_, c) => shape.map(row => row[row.length - 1 - c]));
    const oldShape = currentPiece.shape;
    currentPiece.shape = rotated;
    if (collision()) currentPiece.shape = oldShape;
    drawBoard();
}

function dropPiece() {
    currentPiece.row++;
    if (collision()) {
        currentPiece.row--;
        mergePiece();
        clearLines();
        newPiece();
        if (collision()) endGame();
    }
    drawBoard();
}

function hardDrop() {
    while (!collision()) currentPiece.row++;
    currentPiece.row--;
    mergePiece();
    clearLines();
    newPiece();
    if (collision()) endGame();
    drawBoard();
}

function collision() {
    const { shape, row, col } = currentPiece;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                let newR = row + r, newC = col + c;
                if (newC < 0 || newC >= COLS || newR >= ROWS || (newR >= 0 && board[newR][newC] !== -1)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function mergePiece() {
    const { shape, row, col, id } = currentPiece;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                board[row + r][col + c] = id;
            }
        }
    }
}

function clearLines() {
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every(cell => cell !== -1)) {
            board.splice(r, 1);
            board.unshift(Array(COLS).fill(-1));
            score += 10;
            r++;
        }
    }
}

function endGame() {
    gameOver = true;
    cancelAnimationFrame(requestId);
    saveScoreToServer(score);

    setTimeout(() => {
        alert("Game Over. Score: " + score);
        setTimeout(() => {
            startGame();
        }, 100); // alert後の遅延で確実に再開
    }, 50);
}

function update() {
    dropPiece();
    if (!gameOver) {
        requestId = requestAnimationFrame(() => setTimeout(update, dropSpeed));
    }
}

function startGame() {
    cancelAnimationFrame(requestId); // 既存ループを止める
    gameOver = false;
    score = 0;
    initBoard();
    newPiece();
    drawBoard();
    update();
}

function saveScoreToServer(finalScore) {
    const formData = new FormData();
    formData.append('score', finalScore);
    fetch('/save_score/', {
        method: 'POST',
        body: formData,
        headers: { 'X-CSRFToken': getCsrfToken() },
    });
}

function getCsrfToken() {
  const cookieValue = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
  return cookieValue ? cookieValue.split('=')[1] : '';
}
