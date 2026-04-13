// GN-Gassy behavior: keep the site fast and direct, preserve the original utility feel, and move all page logic out of index.html into a dedicated script file.

const pages = {
  home: `
    <section class="home-grid">
      <article class="panel hero-panel">
        <h2>Home</h2>
        <p class="lead">Welcome to GN-Gassy. This keeps the original dark look, but the page code is now split into separate HTML, CSS, and JavaScript files so it is easier to update.</p>
        <div class="image-row">
          <figure class="image-card">
            <img src="https://cdn.jsdelivr.net/gh/Neon64makoto/GN-Gassy@main/sili2.jpg" alt="Cat image from GN-Gassy">
            <span>sili2.jpg</span>
          </figure>
          <figure class="image-card">
            <img src="https://cdn.jsdelivr.net/gh/Neon64makoto/GN-Gassy@main/sili3.jpg" alt="Cat image from GN-Gassy">
            <span>sili3.jpg</span>
          </figure>
        </div>
      </article>

      <aside class="panel patch-panel">
        <div class="version-chip">Latest patch · v0.24</div>
        <h3>Patch Notes</h3>
        <p class="section-copy">Recent changes to the homepage and site structure.</p>
        <ul class="patch-list">
          <li>Moved the inline style block into <strong>style.css</strong>.</li>
          <li>Moved the inline script block into <strong>script.js</strong>.</li>
          <li>Kept the existing dark GN-Gassy look while cleaning up the page layout.</li>
          <li>Added a dedicated <strong>Patch Notes</strong> area to the Home page.</li>
          <li>Updated the displayed site version from v0.23 to <strong>v0.24</strong>.</li>
        </ul>
      </aside>
    </section>
  `,

  calc: `
    <section class="panel calc-panel">
      <h2>Calculators</h2>
      <div class="button-row">
        <button onclick="showCalc('simple')">Simple</button>
        <button onclick="showCalc('volume')">Volume</button>
        <button onclick="showCalc('graph')">Graph</button>
      </div>
      <div id="calcArea"></div>
    </section>
  `,

  games: `
    <section class="panel games-panel">
      <h2>Scratch Games</h2>
      <div class="games-layout">
        <div class="sideBox">
          <h3>Controls</h3>
          <div id="gameControls"></div>
        </div>

        <div class="centerBox">
          <div class="button-row" style="justify-content:center;">
            <button onclick="prevGame()">◀</button>
            <button onclick="nextGame()">▶</button>
          </div>
          <iframe id="scratchFrame" allowfullscreen title="GN-Gassy Scratch game viewer"></iframe>
          <h3 id="gameTitle"></h3>
        </div>

        <div class="sideBox">
          <h3>Notes / Credits</h3>
          <div id="gameNotes"></div>
        </div>
      </div>
    </section>
  `,

  about: `
    <section class="panel about-panel">
      <h2>About</h2>
      <p class="section-copy">This is GN-Gassy.</p>
    </section>
  `
};

function load(page) {
  document.getElementById("content").innerHTML = pages[page];

  if (page === "games") {
    currentIndex = 0;
    updateGame();
  }
}

function enterRun(e, fn) {
  if (e.key === "Enter") fn();
}

function showCalc(type) {
  const c = document.getElementById("calcArea");

  if (type === "simple") {
    c.innerHTML = `
      <h3>Simple Calculator</h3>
      <input id="simpleInput" placeholder="2+2*3" onkeydown="enterRun(event, calcSimple)">
      <button onclick="calcSimple()">Calc</button>
      <p id="simpleOut"></p>
    `;
  } else if (type === "volume") {
    c.innerHTML = `
      <h3>Volume Calculator</h3>

      Cube (Side):
      <input id="cubeSide" onkeydown="enterRun(event, volCube)">
      <button onclick="volCube()">Calc</button>
      <p id="cubeOut"></p>

      Sphere (Radius):
      <input id="sphereR" onkeydown="enterRun(event, volSphere)">
      <button onclick="volSphere()">Calc</button>
      <p id="sphereOut"></p>

      Rectangular Prism (Length, Width, Height):
      <input id="recL" placeholder="Length" onkeydown="enterRun(event, volRect)">
      <input id="recW" placeholder="Width" onkeydown="enterRun(event, volRect)">
      <input id="recH" placeholder="Height" onkeydown="enterRun(event, volRect)">
      <button onclick="volRect()">Calc</button>
      <p id="rectOut"></p>

      Cylinder (Radius, Height):
      <input id="cylR" placeholder="Radius" onkeydown="enterRun(event, volCyl)">
      <input id="cylH" placeholder="Height" onkeydown="enterRun(event, volCyl)">
      <button onclick="volCyl()">Calc</button>
      <p id="cylOut"></p>

      Pyramid (Base Area, Height):
      <input id="pyrB" placeholder="Base Area" onkeydown="enterRun(event, volPyr)">
      <input id="pyrH" placeholder="Height" onkeydown="enterRun(event, volPyr)">
      <button onclick="volPyr()">Calc</button>
      <p id="pyrOut"></p>
    `;
  } else if (type === "graph") {
    c.innerHTML = `
      <h3>Graph Calculator</h3>

      X: <input id="xmin" value="-10"> to <input id="xmax" value="10"><br>
      Y: <input id="ymin" value="-10"> to <input id="ymax" value="10"><br><br>

      y=<input id="eq1" onkeydown="enterRun(event, drawGraph)"><br>
      y=<input id="eq2" onkeydown="enterRun(event, drawGraph)"><br>
      y=<input id="eq3" onkeydown="enterRun(event, drawGraph)"><br>
      y=<input id="eq4" onkeydown="enterRun(event, drawGraph)"><br>
      y=<input id="eq5" onkeydown="enterRun(event, drawGraph)"><br><br>

      <button onclick="drawGraph()">Graph</button><br><br>

      <div class="canvas-wrap">
        <canvas id="grid" width="400" height="400"></canvas>
        <div id="axesLabels"></div>
      </div>
    `;
  }
}

function calcSimple() {
  try {
    simpleOut.innerText = eval(simpleInput.value);
  } catch {
    simpleOut.innerText = "Error";
  }
}

function volCube() {
  const v = parseFloat(cubeSide.value);
  cubeOut.innerText = !isNaN(v) ? v ** 3 : "Invalid";
}

function volSphere() {
  const v = parseFloat(sphereR.value);
  sphereOut.innerText = !isNaN(v) ? (4 / 3) * Math.PI * v ** 3 : "Invalid";
}

function volRect() {
  const l = parseFloat(recL.value);
  const w = parseFloat(recW.value);
  const h = parseFloat(recH.value);
  rectOut.innerText = !isNaN(l) && !isNaN(w) && !isNaN(h) ? l * w * h : "Invalid";
}

function volCyl() {
  const r = parseFloat(cylR.value);
  const h = parseFloat(cylH.value);
  cylOut.innerText = !isNaN(r) && !isNaN(h) ? Math.PI * r * r * h : "Invalid";
}

function volPyr() {
  const b = parseFloat(pyrB.value);
  const h = parseFloat(pyrH.value);
  pyrOut.innerText = !isNaN(b) && !isNaN(h) ? (b * h) / 3 : "Invalid";
}

function drawGraph() {
  const canvas = document.getElementById("grid");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 400, 400);

  const xminVal = parseFloat(xmin.value);
  const xmaxVal = parseFloat(xmax.value);
  const yminVal = parseFloat(ymin.value);
  const ymaxVal = parseFloat(ymax.value);

  const width = 400;
  const height = 400;

  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    const x = i * (width / 10);
    const y = i * (height / 10);

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;

  const xZero = (-xminVal / (xmaxVal - xminVal)) * width;
  const yZero = (ymaxVal / (ymaxVal - yminVal)) * height;

  ctx.beginPath();
  ctx.moveTo(xZero, 0);
  ctx.lineTo(xZero, height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, yZero);
  ctx.lineTo(width, yZero);
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = "10px Arial";

  for (let i = 0; i <= 10; i++) {
    const xVal = xminVal + (i / 10) * (xmaxVal - xminVal);
    const yVal = yminVal + (i / 10) * (ymaxVal - yminVal);

    const px = i * (width / 10);
    const py = height - i * (height / 10);

    ctx.fillText(xVal.toFixed(1), px, yZero + 10);
    ctx.fillText(yVal.toFixed(1), xZero + 5, py);
  }

  const eqs = [eq1.value, eq2.value, eq3.value, eq4.value, eq5.value];
  const colors = ["red", "cyan", "lime", "yellow", "orange"];
  let resultsHTML = "<h3>Results</h3>";
  const functions = [];

  eqs.forEach((expr, i) => {
    if (!expr) return;

    expr = expr.replace(/(\d)x/g, "$1*x");

    let fn;
    try {
      fn = (x) => eval(expr);
      functions.push({ fn, color: colors[i], expr });
    } catch {
      return;
    }

    ctx.strokeStyle = colors[i];
    ctx.lineWidth = 2;
    ctx.beginPath();

    let first = true;

    for (let px = 0; px <= width; px++) {
      const x = xminVal + (px / width) * (xmaxVal - xminVal);
      let y;

      try {
        y = fn(x);
      } catch {
        continue;
      }

      const py = ((ymaxVal - y) / (ymaxVal - yminVal)) * height;

      if (py >= 0 && py <= height) {
        if (first) {
          ctx.moveTo(px, py);
          first = false;
        } else {
          ctx.lineTo(px, py);
        }
      }
    }

    ctx.stroke();

    try {
      const y0 = fn(0);
      resultsHTML += `<p style="color:${colors[i]}">y=${expr} → y(0) = ${y0.toFixed(2)}</p>`;
    } catch {}
  });

  for (let i = 0; i < functions.length; i++) {
    for (let j = i + 1; j < functions.length; j++) {
      for (let x = xminVal; x <= xmaxVal; x += 0.1) {
        let y1;
        let y2;
        try {
          y1 = functions[i].fn(x);
          y2 = functions[j].fn(x);
        } catch {
          continue;
        }

        if (Math.abs(y1 - y2) < 0.1) {
          resultsHTML += `<p>Intersection ≈ (${x.toFixed(2)}, ${y1.toFixed(2)})</p>`;
          break;
        }
      }
    }
  }

  let existing = document.getElementById("graphResults");
  if (!existing) {
    const div = document.createElement("div");
    div.id = "graphResults";
    canvas.parentElement.appendChild(div);
    existing = div;
  }

  existing.innerHTML = resultsHTML;
}

const games = [
  "https://turbowarp.org/10128407/embed?addons=pause,fullscreen",
  "https://turbowarp.org/1143765424/embed?addons=pause,fullscreen&fps=60",
  "https://turbowarp.org/1075310827/embed?addons=pause,fullscreen&fps=60",
  "https://turbowarp.org/941803602/embed?addons=pause,fullscreen&fps=60",
  "https://turbowarp.org/973637218/embed?addons=pause,fullscreen&fps=60",
  "https://turbowarp.org/883776962/embed?addons=pause,fullscreen&fps=60",
  "https://turbowarp.org/898492644/embed?addons=pause,fullscreen&fps=60",
  "https://turbowarp.org/916303075/embed?addons=pause,fullscreen&fps=60",
  "https://turbowarp.org/978483855/embed?addons=pause,fullscreen&fps=60",
  "https://turbowarp.org/959847748/embed?addons=pause,fullscreen&fps=60"
];

const titles = [
  "Paper Minecraft (Not Made By Me)",
  "Sisyphean Escalator",
  "Gambling but Mid",
  "Laser Dodge",
  "Goober Dodger",
  "Neon's Hostile Road",
  "Mid Cookie Clicker",
  "Asteroid Assault",
  "Reel 'Em In",
  "Cats Hate Rats"
];

const controls = [`Modding Guide: ▶️ https://youtu.be/PexNsUvqD5w
[1 to 9] - Select Item    [Click] - Place or Mine
[WASD] - Move / Jump  [E] - Open/Close Inventory
[E+hover] - Open / Close Chest, Crafting Table, Door
[Space] - Drop single tile from a stack while dragging.
[F] - Eat food       [N] - Label a sign or chest
[Q] - Drop item      [P] - Pause / Unpause
[T] - Talk / Command    [O] - Save your game
[M] - Music / Sounds   [Shift] - Sprint`, `Type the letters shown fast enough or fall.

Not case sensitive.`, `::At BlackJack::
Use arrow keys to bet:

Left and Right set the bet to 0 and max

Up and down will change the bet by 10, or if holding "." will change it by 500
1
Enter to place bet, and after will be the hit button.

Space to stand.

::At Slots::
S to Spin

Same betting controls.`, `Use the mouse to dodge the lasers that get faster with time!

Press the left mouse button to become invincible for three seconds with a 10 second cool down so use it wisely!`, `Use the mouse to dodge the goobers, and don't stay in the border too long.

That's really about it.`, `ASD to move.
W for a 3-second long power-up of invincibility.
Space to Start/Restart on the game-over screen.

1 and 2 control the arcade scan filter.
3 and 4 control the arcade cabinet overlay.
5 and 6 control the arcade music (on/off)

(60 fps Is highly recommended)`, `It's Cookie Clicker, but worse.

Use your mouse.`, `Left mouse button to fire a weak auxiliary laser that overheats quickly.

Space for Main powerful laser.

W for a backup shield that lasts 10 seconds, but has limited uses.

Use your mouse to aim the laser.`, `Use Left Mouse Button to fire the harpoon and try to get the best fish, and buy upgrades.
 
Beware of the explosive mine, it takes $50 dollars to repair the harpoon and the explosion might scare a few good fish away.


This is still a work in progress and I plan on adding more things like power ups, multipliers, and maybe a high score system.

F to show debug menu 
G to hide debug menu`, `goober.

Use mouse 1 to hit the rats.
use F to turn off the yarn.
Use G to turn them back on.
`];

const notes = [`*** Credits ***
All the graphics are taken from the Minecraft wiki page and have not been created by me. I have rescaled them and broken them up to make the game work, but that is it at present.

ORIGNAL PROJECT MADE BY GRIFFPATCH ON SCRATCH, NOT ME:

Check him out he does great stuf, https://scratch.mit.edu/users/griffpatch/`, `The game is based on this video by the way:

https://youtu.be/2Gby1XQ4Z2M?feature=shared`, `Don't gamble in real life, also this technically is not correct, and if you do it quick enough you can easily break most of this.

The special codes are:

L E O

Z A C H

N F S M W
`, `Not much to add, I could have done a better job with the randomization of everything, but I am not gonna be working on this any further.`, `<b>!!!VOLUME WARNING!!!</b>

I made all of this in scratch.

For now there is a max of 15 goobers on screen at a time.
`, `Added a normal and hard mode to the game, plus a secret Most Wanted mode.

I made most of these sprites in scratch and the ships were made in Pixil Art

link to my Pixil Art profile here: https://www.pixilart.com/neon64makoto

Arcade cabinet overlay here:https://forums.launchbox-app.com/files/file/2726-generic-arcade-1080p-overlay/    (i used the 4th one)

Most sounds were found here:
https://pixabay.com/sound-effects/search/arcade/
https://downloads.khinsider.com/game-soundtracks/album/five-nights-at-freddy-s-fnaf-2-sfx

Plus this for hard mode music: https://www.youtube.com/watch?v=R6ZHn2XEbGk

And this for <b>****MW****</b> mode:
https://www.youtube.com/watch?v=kG5LF_QS1JU`, `I stole all the assets I obviously stole and made the assets I obviously made. Not much else.

Secret code this time is:

D R G`, `I made everything except for the crosshair which you can find here: https://nohat.cc/f/red-crosshair-png-transparent/m2i8N4N4K9Z5A0K9-201907232239.html
And the asteroid is here: https://assets.website-files.com/62cc3ac38e15ba20d4ff98f5/62d908ddf4c208aa8b54b424_asteroid-8bit-picture.png

Everything else was either made in scratch or made on my Pixil art profile

Link to my Pixil art profile: https://www.pixilart.com/neon64makoto/gallery




goober.`, `Everything was pretty much made in scratch except for the harpoon and boat clip art. Also the fish are just a part of scratch's sprite library.`, `<b>!!!VOLUME WARNING!!!</b>`];

let currentIndex = 0;

function updateGame() {
  const f = document.getElementById("scratchFrame");
  if (!f) return;
  f.src = games[currentIndex];
  gameTitle.innerText = titles[currentIndex];
  document.getElementById("gameControls").innerHTML = controls[currentIndex] || "";
  document.getElementById("gameNotes").innerHTML = notes[currentIndex] || "";
}

function nextGame() {
  currentIndex = (currentIndex + 1) % games.length;
  updateGame();
}

function prevGame() {
  currentIndex = (currentIndex - 1 + games.length) % games.length;
  updateGame();
}

load("home");
