if (window.dinoGameCleanup) {
  window.dinoGameCleanup();
}

const frame = document.getElementById("webGameFrame");

frame.innerHTML = `
<canvas id="dinoGameCanvas"></canvas>
`;

const canvas = document.getElementById("dinoGameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = frame.clientWidth;
  canvas.height = frame.clientHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

function getGroundY() {
  return canvas.height - 80;
}

let score = 0;
let speed = 6;
let gameOver = false;
let animationFrame;

const player = {
  x: 80,
  y: getGroundY(),
  w: 40,
  h: 40,
  vy: 0,
  jumping: false
};

const obstacles = [];

function spawnObstacle() {
  const height = 30 + Math.random() * 40;

  obstacles.push({
    x: canvas.width + 50,
    y: getGroundY() + (40 - height),
    w: 25,
    h: height
  });
}

const obstacleInterval = setInterval(() => {
  if (!gameOver) {
    spawnObstacle();
  }
}, 1400);

function jump() {
  if (!player.jumping && !gameOver) {
    player.vy = -14;
    player.jumping = true;
  }

  if (gameOver) {
    restartGame();
  }
}

function restartGame() {
  score = 0;
  speed = 6;
  gameOver = false;

  obstacles.length = 0;

  player.y = getGroundY();
  player.vy = 0;
  player.jumping = false;
}

function handleKey(e) {
  if (
    e.code === "Space" ||
    e.code === "ArrowUp" ||
    e.code === "ArrowRight"
  ) {
    e.preventDefault();
    jump();
  }
}

function handleClick() {
  jump();
}

window.addEventListener("keydown", handleKey);

canvas.addEventListener("mousedown", handleClick);
canvas.addEventListener("touchstart", handleClick);

function rectsCollide(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function update() {
  if (gameOver) return;

  player.vy += 0.7;
  player.y += player.vy;

  if (player.y >= getGroundY()) {
    player.y = getGroundY();
    player.vy = 0;
    player.jumping = false;
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];

    obs.x -= speed;

    if (rectsCollide(player, obs)) {
      gameOver = true;
    }

    if (obs.x + obs.w < 0) {
      obstacles.splice(i, 1);

      score++;

      if (score % 5 === 0) {
        speed += 0.5;
      }
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = "#00ffff";

  ctx.fillRect(
    player.x,
    player.y,
    player.w,
    player.h
  );

  ctx.fillStyle = "#000";

  ctx.fillRect(
    player.x + 25,
    player.y + 8,
    6,
    6
  );
}

function drawObstacles() {
  ctx.fillStyle = "#ff3366";

  obstacles.forEach(obs => {
    ctx.fillRect(
      obs.x,
      obs.y,
      obs.w,
      obs.h
    );
  });
}

function drawGround() {
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 3;

  ctx.beginPath();

  ctx.moveTo(0, getGroundY() + 40);

  ctx.lineTo(
    canvas.width,
    getGroundY() + 40
  );

  ctx.stroke();
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";

  ctx.fillText(
    "Score: " + score,
    20,
    40
  );

  ctx.fillStyle = "#888";
  ctx.font = "16px Arial";

  ctx.fillText(
    "Speed: " + speed.toFixed(1),
    20,
    65
  );
}

function drawGameOver() {
  if (!gameOver) return;

  ctx.fillStyle = "#ff4444";
  ctx.font = "48px Arial";

  ctx.fillText(
    "GAME OVER",
    canvas.width / 2 - 170,
    canvas.height / 2 - 20
  );

  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";

  ctx.fillText(
    "Press Space / Arrow / Click",
    canvas.width / 2 - 165,
    canvas.height / 2 + 40
  );

  ctx.fillText(
    "to Restart",
    canvas.width / 2 - 55,
    canvas.height / 2 + 75
  );
}

function render() {
  ctx.fillStyle = "#050505";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  drawGround();
  drawPlayer();
  drawObstacles();
  drawScore();
  drawGameOver();
}

function loop() {
  update();
  render();

  animationFrame =
    requestAnimationFrame(loop);
}

loop();

window.dinoGameCleanup = function() {
  cancelAnimationFrame(animationFrame);

  clearInterval(obstacleInterval);

  window.removeEventListener(
    "resize",
    resizeCanvas
  );

  window.removeEventListener(
    "keydown",
    handleKey
  );

  canvas.removeEventListener(
    "mousedown",
    handleClick
  );

  canvas.removeEventListener(
    "touchstart",
    handleClick
  );
};
