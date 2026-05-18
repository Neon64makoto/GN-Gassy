(() => {

if (window.currentGameCleanup) {
  window.currentGameCleanup();
}

const frame = document.getElementById("webGameFrame");

frame.innerHTML = `
<div id="guessGameWrap">
  <div id="guessGameBox">

    <div id="guessHeader">
      Number Guessing Game
    </div>

    <div id="guessRange">
      Guess a number between 1 and 100
    </div>

    <input
      type="number"
      id="guessInput"
      placeholder="Enter your guess"
    />

    <div id="guessButtons">
      <button id="guessSubmit">
        Guess
      </button>

      <button id="guessRestart">
        Play Again
      </button>
    </div>

    <div id="guessMessage"></div>

  </div>

  <button id="difficultyToggle">
    ◀
  </button>

  <div id="difficultyPanel">

    <div class="difficultyTitle">
      Difficulty
    </div>

    <button class="difficultyBtn" data-min="0" data-max="50">
      Easy
    </button>

    <button class="difficultyBtn" data-min="0" data-max="100">
      Normal
    </button>

    <button class="difficultyBtn" data-min="0" data-max="500">
      Hard
    </button>

    <button class="difficultyBtn" data-min="0" data-max="1000000">
      Impossible
    </button>

    <div class="customRange">
      <input
        type="number"
        id="customMin"
        placeholder="Min"
      />

      <input
        type="number"
        id="customMax"
        placeholder="Max"
      />

      <button id="setCustomRange">
        Set Custom
      </button>
    </div>

  </div>
</div>
`;

const style = document.createElement("style");

style.id = "guessGameStyle";

style.textContent = `
#guessGameWrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(
    to top,
    #070e54,
    #0015ff
  );
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Arial, sans-serif;
}

#guessGameBox {
  width: 90%;
  max-width: 420px;
  background: #050505;
  border-radius: 18px;
  padding: 28px;
  box-sizing: border-box;
  text-align: center;
  box-shadow: 0 0 25px rgba(0,0,0,0.4);
}

#guessHeader {
  font-size: 32px;
  color: #00bfff;
  margin-bottom: 16px;
  font-weight: bold;
}

#guessRange {
  color: #ffffff;
  margin-bottom: 18px;
  font-size: 18px;
}

#guessInput {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  outline: none;
  box-sizing: border-box;
  margin-bottom: 16px;
}

#guessButtons {
  display: flex;
  gap: 10px;
}

#guessButtons button {
  flex: 1;
}

#guessSubmit,
#guessRestart,
.difficultyBtn,
#setCustomRange {
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;
}

#guessSubmit {
  background: #0066ff;
  color: white;
}

#guessSubmit:hover {
  background: #3385ff;
}

#guessRestart {
  background: #00aa66;
  color: white;
  display: none;
}

#guessRestart:hover {
  background: #00cc77;
}

#guessMessage {
  margin-top: 18px;
  color: white;
  font-size: 20px;
  min-height: 24px;
}

#difficultyPanel {
  position: absolute;
  top: 0;
  right: -270px;
  width: 250px;
  height: 100%;
  background: #050505;
  box-sizing: border-box;
  padding: 18px;
  transition: right 0.35s ease;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

#difficultyToggle {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 42px;
  height: 60px;
  border: none;
  background: #0066ff;
  color: white;
  font-size: 22px;
  border-radius: 10px 0 0 10px;
  cursor: pointer;
  transition: right 0.35s ease;
}

.difficultyTitle {
  color: #00bfff;
  font-size: 24px;
  text-align: center;
  margin-bottom: 10px;
  font-weight: bold;
}

.difficultyBtn,
#setCustomRange {
  background: #0066ff;
  color: white;
}

.difficultyBtn:hover,
#setCustomRange:hover {
  background: #3385ff;
}

.customRange {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.customRange input {
  padding: 10px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
}
`;

document.head.appendChild(style);

const guessInput =
  document.getElementById("guessInput");

const guessSubmit =
  document.getElementById("guessSubmit");

const guessRestart =
  document.getElementById("guessRestart");

const guessMessage =
  document.getElementById("guessMessage");

const guessRange =
  document.getElementById("guessRange");

const difficultyPanel =
  document.getElementById("difficultyPanel");

const difficultyToggle =
  document.getElementById("difficultyToggle");

const difficultyButtons =
  document.querySelectorAll(".difficultyBtn");

const customMin =
  document.getElementById("customMin");

const customMax =
  document.getElementById("customMax");

const setCustomRange =
  document.getElementById("setCustomRange");

let min = 1;
let max = 100;

let guessCount = 0;

let secretNumber = generateNumber();

function generateNumber() {
  return (
    Math.floor(
      Math.random() * (max - min + 1)
    ) + min
  );
}

function resetGame() {

  guessCount = 0;

  secretNumber = generateNumber();

  guessRange.textContent =
    `Guess a number between ${min} and ${max}`;

  guessMessage.textContent = "";

  guessInput.value = "";

  guessInput.min = min;

  guessInput.max = max;

  guessSubmit.style.display = "block";

  guessRestart.style.display = "none";

  guessInput.focus();
}

function winGame() {

  guessMessage.textContent =
    `🎉 Correct! Took ${guessCount} guesses.`;

  guessSubmit.style.display = "none";

  guessRestart.style.display = "block";
}

function makeGuess() {

  const value =
    parseInt(guessInput.value);

  if (isNaN(value)) {
    guessMessage.textContent =
      "Enter a valid number.";
    return;
  }

  guessCount++;

  if (value === secretNumber) {

    winGame();

  } else if (value < secretNumber) {

    guessMessage.textContent =
      "Too low!";

  } else {

    guessMessage.textContent =
      "Too high!";
  }

  guessInput.value = "";
}

function handleKey(e) {

  if (e.key === "Enter") {

    if (
      guessSubmit.style.display !== "none"
    ) {

      makeGuess();

    } else {

      resetGame();
    }
  }
}

function toggleDifficulty() {

  const open =
    difficultyPanel.style.right === "0px";

  difficultyPanel.style.right =
    open ? "-270px" : "0px";

  difficultyToggle.style.right =
    open ? "0px" : "250px";

  difficultyToggle.textContent =
    open ? "◀" : "▶";
}

difficultyButtons.forEach(btn => {

  btn.addEventListener("click", () => {

    min =
      parseInt(btn.dataset.min);

    max =
      parseInt(btn.dataset.max);

    resetGame();
  });
});

setCustomRange.addEventListener(
  "click",
  () => {

    const newMin =
      parseInt(customMin.value);

    const newMax =
      parseInt(customMax.value);

    if (
      isNaN(newMin) ||
      isNaN(newMax) ||
      newMin >= newMax
    ) {

      guessMessage.textContent =
        "Invalid custom range.";

      return;
    }

    min = newMin;

    max = newMax;

    resetGame();
  }
);

guessSubmit.addEventListener(
  "click",
  makeGuess
);

guessRestart.addEventListener(
  "click",
  resetGame
);

guessInput.addEventListener(
  "keydown",
  handleKey
);

difficultyToggle.addEventListener(
  "click",
  toggleDifficulty
);

resetGame();

window.currentGameCleanup = function() {

  guessSubmit.removeEventListener(
    "click",
    makeGuess
  );

  guessRestart.removeEventListener(
    "click",
    resetGame
  );

  guessInput.removeEventListener(
    "keydown",
    handleKey
  );

  difficultyToggle.removeEventListener(
    "click",
    toggleDifficulty
  );

  difficultyButtons.forEach(btn => {
    btn.replaceWith(btn.cloneNode(true));
  });

  setCustomRange.replaceWith(
    setCustomRange.cloneNode(true)
  );

  const styleEl =
    document.getElementById(
      "guessGameStyle"
    );

  if (styleEl) {
    styleEl.remove();
  }
};

})();
