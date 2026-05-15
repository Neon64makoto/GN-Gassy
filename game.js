const frame = document.getElementById("webGameFrame");

frame.innerHTML = `
  <canvas id="gameCanvas"></canvas>
`;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

let x = 100;

function loop() {
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = "cyan";
  ctx.fillRect(x,200,50,50);

  x++;

  requestAnimationFrame(loop);
}

loop();
