(() => {

if (window.currentGameCleanup) {
  window.currentGameCleanup();
  delete window.currentGameCleanup;
}

const frame = document.getElementById("webGameFrame");

frame.innerHTML = `

<div id="spaceGameWrap">

  <div id="spaceHud">

    <div id="spaceTitle">
      Neon Dodger
    </div>

    <div id="spaceStats">
      <span id="scoreText">Score: 0</span>
      <span id="livesText">Lives: 3</span>
    </div>

  </div>

  <canvas id="spaceCanvas"></canvas>

  <div id="gameOverScreen">

    <div id="gameOverTitle">
      Game Over
    </div>

    <div id="finalScore">
      Score: 0
    </div>

    <button id="restartButton">
      Restart
    </button>

  </div>

  <button id="difficultyToggle">
    ◀
  </button>

  <div id="difficultyMenu">

    <div id="difficultyTitle">
      Difficulty
    </div>

    <button
      class="difficultyButton"
      data-speed="2"
      data-spawn="90"
    >
      Easy
    </button>

    <button
      class="difficultyButton"
      data-speed="3"
      data-spawn="65"
    >
      Normal
    </button>

    <button
      class="difficultyButton"
      data-speed="4"
      data-spawn="45"
    >
      Hard
    </button>

    <button
      class="difficultyButton"
      data-speed="5"
      data-spawn="28"
    >
      Impossible
    </button>

  </div>

</div>

`;

const style = document.createElement("style");

style.id = "spaceGameStyle";

style.textContent = `

#spaceGameWrap {

  width: 100%;
  height: 100%;

  position: relative;

  overflow: hidden;

  background:
    linear-gradient(
      to bottom,
      #090909,
      #000000
    );

  font-family: Arial, sans-serif;
}

#spaceCanvas {

  width: 100%;
  height: 100%;

  display: block;
}

#spaceHud {

  position: absolute;

  top: 10px;
  left: 10px;

  z-index: 5;

  background:
    rgba(10,10,10,0.82);

  border:
    2px solid #00aaff;

  border-radius: 12px;

  padding: 10px 14px;

  box-shadow:
    0 0 18px rgba(0,170,255,0.22);
}

#spaceTitle {

  color: #00bfff;

  font-size: 18px;

  font-weight: bold;

  margin-bottom: 6px;
}

#spaceStats {

  display: flex;

  gap: 14px;

  color: white;

  font-size: 13px;
}

#gameOverScreen {

  position: absolute;

  top: 50%;
  left: 50%;

  transform:
    translate(-50%, -50%);

  width: 220px;

  background:
    rgba(10,10,10,0.94);

  border:
    2px solid #00aaff;

  border-radius: 16px;

  padding: 18px;

  text-align: center;

  display: none;

  z-index: 10;
}

#gameOverTitle {

  color: #00bfff;

  font-size: 24px;

  font-weight: bold;

  margin-bottom: 12px;
}

#finalScore {

  color: white;

  margin-bottom: 14px;

  font-size: 15px;
}

#restartButton,
.difficultyButton {

  width: 100%;

  border: none;

  border-radius: 10px;

  padding: 9px;

  margin-top: 8px;

  font-size: 13px;

  cursor: pointer;

  color: white;

  transition: 0.2s;

  background:
    linear-gradient(
      to bottom,
      #0099ff,
      #0066cc
    );
}

#restartButton:hover,
.difficultyButton:hover {

  transform: scale(1.03);
}

#difficultyMenu {

  position: absolute;

  top: 0;
  right: -230px;

  width: 210px;
  height: 100%;

  background:
    rgba(10,10,10,0.97);

  border-left:
    2px solid #00aaff;

  box-sizing: border-box;

  padding: 14px;

  display: flex;
  flex-direction: column;

  transition: right 0.35s ease;

  z-index: 8;
}

#difficultyTitle {

  color: #00bfff;

  font-size: 21px;

  text-align: center;

  margin-bottom: 10px;

  font-weight: bold;
}

#difficultyToggle {

  position: absolute;

  top: 50%;
  right: 0;

  transform: translateY(-50%);

  width: 36px;
  height: 54px;

  border: none;

  border-radius: 10px 0 0 10px;

  background:
    linear-gradient(
      to bottom,
      #0099ff,
      #0066cc
    );

  color: white;

  font-size: 20px;

  cursor: pointer;

  z-index: 9;
}

`;

document.head.appendChild(style);

const canvas =
  document.getElementById("spaceCanvas");

const ctx =
  canvas.getContext("2d");

const scoreText =
  document.getElementById("scoreText");

const livesText =
  document.getElementById("livesText");

const gameOverScreen =
  document.getElementById("gameOverScreen");

const finalScore =
  document.getElementById("finalScore");

const restartButton =
  document.getElementById("restartButton");

const difficultyMenu =
  document.getElementById("difficultyMenu");

const difficultyToggle =
  document.getElementById("difficultyToggle");

let running = true;

let score = 0;

let lives = 3;

let asteroidSpeed = 3;

let spawnRate = 65;

let frameCount = 0;

let animationFrame;

const keys = {};

const stars = [];

const asteroids = [];

const player = {

  x: 0,
  y: 0,

  width: 26,
  height: 26,

  speed: 5
};

function resizeCanvas() {

  canvas.width =
    canvas.clientWidth;

  canvas.height =
    canvas.clientHeight;

  player.x =
    canvas.width / 2;

  player.y =
    canvas.height - 70;
}

resizeCanvas();

window.addEventListener(
  "resize",
  resizeCanvas
);

for (let i = 0; i < 70; i++) {

  stars.push({

    x:
      Math.random() *
      canvas.width,

    y:
      Math.random() *
      canvas.height,

    size:
      Math.random() * 2
  });
}

function spawnAsteroid() {

  asteroids.push({

    x:
      Math.random() *
      (canvas.width - 30),

    y: -40,

    width: 26 +
      Math.random() * 20,

    height: 26 +
      Math.random() * 20,

    speed:
      asteroidSpeed +
      Math.random() * 2
  });
}

function drawBackground() {

  ctx.fillStyle = "#000000";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.fillStyle = "#55bbff";

  stars.forEach(star => {

    ctx.fillRect(
      star.x,
      star.y,
      star.size,
      star.size
    );

    star.y += 0.4;

    if (star.y > canvas.height) {

      star.y = 0;

      star.x =
        Math.random() *
        canvas.width;
    }
  });
}

function drawPlayer() {

  ctx.save();

  ctx.translate(
    player.x,
    player.y
  );

  ctx.fillStyle = "#00aaff";

  ctx.shadowBlur = 18;

  ctx.shadowColor = "#00aaff";

  ctx.beginPath();

  ctx.moveTo(0, -18);

  ctx.lineTo(-14, 14);

  ctx.lineTo(0, 8);

  ctx.lineTo(14, 14);

  ctx.closePath();

  ctx.fill();

  ctx.restore();
}

function drawAsteroids() {

  ctx.fillStyle = "#ff4444";

  asteroids.forEach(
    asteroid => {

      asteroid.y +=
        asteroid.speed;

      ctx.shadowBlur = 14;

      ctx.shadowColor =
        "#ff4444";

      ctx.fillRect(
        asteroid.x,
        asteroid.y,
        asteroid.width,
        asteroid.height
      );
    }
  );
}

function updatePlayer() {

  if (keys["ArrowLeft"] ||
      keys["a"]) {

    player.x -=
      player.speed;
  }

  if (keys["ArrowRight"] ||
      keys["d"]) {

    player.x +=
      player.speed;
  }

  if (keys["ArrowUp"] ||
      keys["w"]) {

    player.y -=
      player.speed;
  }

  if (keys["ArrowDown"] ||
      keys["s"]) {

    player.y +=
      player.speed;
  }

  player.x = Math.max(
    16,
    Math.min(
      canvas.width - 16,
      player.x
    )
  );

  player.y = Math.max(
    20,
    Math.min(
      canvas.height - 16,
      player.y
    )
  );
}

function checkCollisions() {

  for (
    let i = asteroids.length - 1;
    i >= 0;
    i--
  ) {

    const asteroid =
      asteroids[i];

    const hit =
      player.x + 12 >
      asteroid.x &&

      player.x - 12 <
      asteroid.x +
      asteroid.width &&

      player.y + 12 >
      asteroid.y &&

      player.y - 12 <
      asteroid.y +
      asteroid.height;

    if (hit) {

      asteroids.splice(i, 1);

      lives--;

      livesText.textContent =
        `Lives: ${lives}`;

      if (lives <= 0) {

        endGame();
      }
    }

    if (
      asteroid.y >
      canvas.height + 50
    ) {

      asteroids.splice(i, 1);

      score++;

      scoreText.textContent =
        `Score: ${score}`;
    }
  }
}

function endGame() {

  running = false;

  finalScore.textContent =
    `Score: ${score}`;

  gameOverScreen.style.display =
    "block";
}

function loop() {

  if (!running) {
    return;
  }

  frameCount++;

  if (
    frameCount % spawnRate === 0
  ) {

    spawnAsteroid();
  }

  drawBackground();

  updatePlayer();

  drawPlayer();

  drawAsteroids();

  checkCollisions();

  animationFrame =
    requestAnimationFrame(loop);
}

function resetGame() {

  running = true;

  score = 0;

  lives = 3;

  frameCount = 0;

  asteroids.length = 0;

  scoreText.textContent =
    "Score: 0";

  livesText.textContent =
    "Lives: 3";

  gameOverScreen.style.display =
    "none";

  player.x =
    canvas.width / 2;

  player.y =
    canvas.height - 70;

  cancelAnimationFrame(
    animationFrame
  );

  loop();
}

function toggleMenu() {

  const open =
    difficultyMenu.style.right ===
    "0px";

  difficultyMenu.style.right =
    open ? "-230px" : "0px";

  difficultyToggle.style.right =
    open ? "0px" : "210px";

  difficultyToggle.textContent =
    open ? "◀" : "▶";
}

document
.querySelectorAll(".difficultyButton")
.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      asteroidSpeed =
        parseInt(
          button.dataset.speed
        );

      spawnRate =
        parseInt(
          button.dataset.spawn
        );

      resetGame();
    }
  );
});

document.addEventListener(
  "keydown",
  e => {

    keys[e.key] = true;
  }
);

document.addEventListener(
  "keyup",
  e => {

    keys[e.key] = false;
  }
);

restartButton.addEventListener(
  "click",
  resetGame
);

difficultyToggle.addEventListener(
  "click",
  toggleMenu
);

loop();

window.currentGameCleanup =
  function() {

    cancelAnimationFrame(
      animationFrame
    );

    window.removeEventListener(
      "resize",
      resizeCanvas
    );

    const styleEl =
      document.getElementById(
        "spaceGameStyle"
      );

    if (styleEl) {
      styleEl.remove();
    }

    frame.innerHTML = "";
  };

})();
