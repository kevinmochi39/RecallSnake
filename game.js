const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const size = 32; 
const cols = canvas.width / size;
const rows = canvas.height / size;

let snake, dir, food, score, playing;

// Load ảnh
const snakeImg = new Image();
snakeImg.src = "snake.png";

const foodImg = new Image();
foodImg.src = "food.png";

const bgImg = new Image();
bgImg.src = "background.png";

// Load nhạc
const eatSound = new Audio("eat.mp3");
const overSound = new Audio("gameover.mp3");
const bgMusic = new Audio("background.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;

// Input
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && dir.y === 0) dir = { x: 0, y: -1 };
  if (e.key === "ArrowDown" && dir.y === 0) dir = { x: 0, y: 1 };
  if (e.key === "ArrowLeft" && dir.x === 0) dir = { x: -1, y: 0 };
  if (e.key === "ArrowRight" && dir.x === 0) dir = { x: 1, y: 0 };
});

// Vẽ
function draw() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // Vẽ food
  ctx.drawImage(foodImg, food.x * size, food.y * size, size, size);

  // Vẽ snake
  snake.forEach((s) => {
    ctx.drawImage(snakeImg, s.x * size, s.y * size, size, size);
  });

  document.getElementById("score").textContent = "Score: " + score;
}

// Cập nhật
function update() {
  if (!playing) return;

  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  // Check va chạm
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= cols ||
    head.y >= rows ||
    snake.some((s) => s.x === head.x && s.y === head.y)
  ) {
    playing = false;
    overSound.play();
    bgMusic.pause();
    document.getElementById("restartBtn").style.display = "inline-block";
    return;
  }

  snake.unshift(head);

  // Ăn mồi
  if (head.x === food.x && head.y === food.y) {
    score++;
    eatSound.currentTime = 0;
    eatSound.play();
    food = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };
  } else {
    snake.pop();
  }
}

// Game loop
function loop() {
  update();
  draw();
  if (playing) setTimeout(loop, 200); // dễ hơn: 200ms
}

// Khởi động game
function startGame() {
  snake = [{ x: 5, y: 5 }];
  dir = { x: 1, y: 0 };
  food = { x: 10, y: 10 };
  score = 0;
  playing = true;
  document.getElementById("restartBtn").style.display = "none";
  bgMusic.currentTime = 0;
  bgMusic.play();
  loop();
}

// Restart button
document.getElementById("restartBtn").addEventListener("click", startGame);

// Chạy lần đầu
startGame();
