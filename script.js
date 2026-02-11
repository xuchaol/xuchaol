const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restart");

const gridSize = 20;
const tileCount = canvas.width / gridSize;
const tickMs = 120;

let snake;
let direction;
let nextDirection;
let food;
let score;
let gameTimer;
let gameOver;

const highScoreKey = "snake-high-score";
let highScore = Number(localStorage.getItem(highScoreKey)) || 0;
highScoreEl.textContent = String(highScore);

function resetGame() {
  snake = [
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { ...direction };
  score = 0;
  gameOver = false;
  scoreEl.textContent = "0";
  statusEl.textContent = "";
  placeFood();

  clearInterval(gameTimer);
  gameTimer = setInterval(gameLoop, tickMs);
  draw();
}

function placeFood() {
  do {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } while (snake.some((segment) => segment.x === food.x && segment.y === food.y));
}

function gameLoop() {
  if (gameOver) return;

  direction = nextDirection;
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  const hitWall =
    head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount;
  const hitSelf = snake.some((segment) => segment.x === head.x && segment.y === head.y);

  if (hitWall || hitSelf) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = String(score);
    if (score > highScore) {
      highScore = score;
      localStorage.setItem(highScoreKey, String(highScore));
      highScoreEl.textContent = String(highScore);
    }
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function endGame() {
  gameOver = true;
  clearInterval(gameTimer);
  statusEl.textContent = `游戏结束！最终得分：${score}`;
}

function drawCell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * gridSize, y * gridSize, gridSize - 1, gridSize - 1);
}

function draw() {
  ctx.fillStyle = "#11152b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawCell(food.x, food.y, "#ff5d73");

  snake.forEach((segment, index) => {
    drawCell(segment.x, segment.y, index === 0 ? "#7fff9f" : "#46d369");
  });
}

function setDirection(newDir) {
  if (gameOver) return;
  const isReverse =
    newDir.x === -direction.x &&
    newDir.y === -direction.y;
  if (!isReverse) {
    nextDirection = newDir;
  }
}

document.addEventListener("keydown", (event) => {
  switch (event.key.toLowerCase()) {
    case "arrowup":
    case "w":
      setDirection({ x: 0, y: -1 });
      break;
    case "arrowdown":
    case "s":
      setDirection({ x: 0, y: 1 });
      break;
    case "arrowleft":
    case "a":
      setDirection({ x: -1, y: 0 });
      break;
    case "arrowright":
    case "d":
      setDirection({ x: 1, y: 0 });
      break;
    default:
      return;
  }

  event.preventDefault();
});

restartBtn.addEventListener("click", resetGame);

resetGame();
