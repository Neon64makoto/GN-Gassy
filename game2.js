(() => {

if (window.currentGameCleanup) {
  window.currentGameCleanup();
  delete window.currentGameCleanup;
}

const frame = document.getElementById("webGameFrame");

frame.innerHTML = `

<div id="guessGameWrap">

  <div id="guessGameBox">

    <div id="guessTitle">
      Number Guessing
    </div>

    <div id="guessInfo">
      Guess a number between 1 and 100
    </div>

    <div id="guessCounter">
      Guesses Left: 10
    </div>

    <input
      type="number"
      id="guessInput"
      placeholder="Enter Guess"
    >

    <div id="guessButtonRow">

      <button id="guessButton">
        Guess
      </button>

      <button id="restartButton">
        Restart
      </button>

    </div>

    <div id="guessMessage"></div>

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
      data-min="0"
      data-max="50"
      data-guesses="15"
    >
      Easy
    </button>

    <button
      class="difficultyButton"
      data-min="0"
      data-max="100"
      data-guesses="10"
    >
      Normal
    </button>

    <button
      class="difficultyButton"
      data-min="0"
      data-max="500"
      data-guesses="15"
    >
      Hard
    </button>

    <button
      class="difficultyButton"
      data-min="0"
      data-max="5000"
      data-guesses="25"
    >
      Impossible
    </button>

    <div id="customSection">

      <input
        type="number"
        id="customMin"
        placeholder="Min"
      >

      <input
        type="number"
        id="customMax"
        placeholder="Max"
      >

      <input
        type="number"
        id="customGuesses"
        placeholder="Guesses"
      >

      <button id="applyCustom">
        Apply Custom
      </button>

    </div>

  </div>

</div>
`;

const style = document.createElement("style");

style.id = "guessGameStyle";

style.textContent = `

#guessGameWrap {

  width: 100%;
  height: 100%;
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;

  font-family: Arial, sans-serif;

  background:
    linear-gradient(
      to bottom,
      #111111,
      #050505
    );
}

#guessGameBox {

  width: 82%;
  max-width: 340px;

  background:
    rgba(20,20,20,0.92);

  border:
    2px solid #00aaff;

  border-radius: 18px;

  padding: 18px;

  box-sizing: border-box;

  box-shadow:
    0 0 20px rgba(0,170,255,0.25);

  text-align: center;
}

#guessTitle {

  font-size: 26px;
  font-weight: bold;

  color: #00bfff;

  margin-bottom: 12px;
}

#guessInfo {

  color: white;

  font-size: 15px;

  margin-bottom: 8px;
}

#guessCounter {

  color: #66ccff;

  font-size: 14px;

  margin-bottom: 14px;
}

#guessInput {

  width: 100%;

  padding: 11px;

  font-size: 16px;

  border: none;

  border-radius: 10px;

  outline: none;

  box-sizing: border-box;

  margin-bottom: 12px;

  background: #111111;

  color: white;

  border:
    1px solid #00aaff;
}

#guessButtonRow {

  display: flex;

  gap: 8px;
}

#guessButton,
#restartButton,
.difficultyButton,
#applyCustom {

  flex: 1;

  border: none;

  border-radius: 10px;

  padding: 10px;

  font-size: 14px;

  cursor: pointer;

  transition: 0.2s;

  background:
    linear-gradient(
      to bottom,
      #0099ff,
      #0066cc
    );

  color: white;
}

#guessButton:hover,
#restartButton:hover,
.difficultyButton:hover,
#applyCustom:hover {

  transform: scale(1.03);
}

#restartButton {

  display: none;
}

#guessMessage {

  margin-top: 14px;

  color: white;

  min-height: 20px;

  font-size: 15px;
}

#difficultyMenu {

  position: absolute;

  top: 0;
  right: -250px;

  width: 230px;
  height: 100%;

  background:
    rgba(10,10,10,0.98);

  border-left:
    2px solid #00aaff;

  box-sizing: border-box;

  padding: 16px;

  transition: right 0.35s ease;

  display: flex;
  flex-direction: column;

  gap: 8px;
}

#difficultyTitle {

  color: #00bfff;

  text-align: center;

  font-size: 22px;

  margin-bottom: 8px;

  font-weight: bold;
}

#difficultyToggle {

  position: absolute;

  top: 50%;
  right: 0;

  transform: translateY(-50%);

  width: 38px;
  height: 56px;

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

  transition: right 0.35s ease;
}

#customSection {

  margin-top: 6px;

  display: flex;
  flex-direction: column;

  gap: 8px;
}

#customSection input {

  padding: 9px;

  border-radius: 8px;

  border:
    1px solid #00aaff;

  background: #111111;

  color: white;

  font-size: 14px;
}

`;

document.head.appendChild(style);

const guessInput =
  document.getElementById("guessInput");

const guessButton =
  document.getElementById("guessButton");

const restartButton =
  document.getElementById("restartButton");

const guessMessage =
  document.getElementById("guessMessage");

const guessInfo =
  document.getElementById("guessInfo");

const guessCounter =
  document.getElementById("guessCounter");

const difficultyMenu =
  document.getElementById("difficultyMenu");

const difficultyToggle =
  document.getElementById("difficultyToggle");

const customMin =
  document.getElementById("customMin");

const customMax =
  document.getElementById("customMax");

const customGuesses =
  document.getElementById("customGuesses");

const applyCustom =
  document.getElementById("applyCustom");

let min = 1;
let max = 100;

let maxGuesses = 10;

let guessesLeft = maxGuesses;

let number =
  generateNumber();

function generateNumber() {

  return (
    Math.floor(
      Math.random() *
      (max - min + 1)
    ) + min
  );
}

function updateUI() {

  guessInfo.textContent =
    `Guess a number between ${min} and ${max}`;

  guessCounter.textContent =
    `Guesses Left: ${guessesLeft}`;

  guessInput.min = min;

  guessInput.max = max;
}

function resetGame() {

  guessesLeft = maxGuesses;

  number = generateNumber();

  guessInput.value = "";

  guessMessage.textContent = "";

  guessButton.style.display =
    "block";

  restartButton.style.display =
    "none";

  updateUI();

  guessInput.focus();
}

function loseGame() {

  guessMessage.textContent =
    `💀 You lost! Number was ${number}`;

  guessButton.style.display =
    "none";

  restartButton.style.display =
    "block";
}

function winGame() {

  guessMessage.textContent =
    `🎉 Correct!`;

  guessButton.style.display =
    "none";

  restartButton.style.display =
    "block";
}

function submitGuess() {

  const value =
    parseInt(guessInput.value);

  if (isNaN(value)) {

    guessMessage.textContent =
      "Enter a valid number.";

    return;
  }

  guessesLeft--;

  if (value === number) {

    winGame();

    return;
  }

  if (guessesLeft <= 0) {

    loseGame();

    return;
  }

  if (value < number) {

    guessMessage.textContent =
      "Too low!";

  } else {

    guessMessage.textContent =
      "Too high!";
  }

  updateUI();

  guessInput.value = "";
}

function keyHandler(e) {

  if (e.key === "Enter") {

    if (
      guessButton.style.display !==
      "none"
    ) {

      submitGuess();

    } else {

      resetGame();
    }
  }
}

function toggleMenu() {

  const open =
    difficultyMenu.style.right ===
    "0px";

  difficultyMenu.style.right =
    open ? "-250px" : "0px";

  difficultyToggle.style.right =
    open ? "0px" : "230px";

  difficultyToggle.textContent =
    open ? "◀" : "▶";
}

document
.querySelectorAll(".difficultyButton")
.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      min =
        parseInt(button.dataset.min);

      max =
        parseInt(button.dataset.max);

      maxGuesses =
        parseInt(
          button.dataset.guesses
        );

      resetGame();
    }
  );
});

applyCustom.addEventListener(
  "click",
  () => {

    const newMin =
      parseInt(customMin.value);

    const newMax =
      parseInt(customMax.value);

    const newGuesses =
      parseInt(customGuesses.value);

    if (
      isNaN(newMin) ||
      isNaN(newMax) ||
      isNaN(newGuesses) ||
      newMin >= newMax ||
      newGuesses <= 0
    ) {

      guessMessage.textContent =
        "Invalid custom settings.";

      return;
    }

    min = newMin;

    max = newMax;

    maxGuesses = newGuesses;

    resetGame();
  }
);

guessButton.addEventListener(
  "click",
  submitGuess
);

restartButton.addEventListener(
  "click",
  resetGame
);

guessInput.addEventListener(
  "keydown",
  keyHandler
);

difficultyToggle.addEventListener(
  "click",
  toggleMenu
);

resetGame();

window.currentGameCleanup =
  function() {

    const styleEl =
      document.getElementById(
        "guessGameStyle"
      );

    if (styleEl) {
      styleEl.remove();
    }

    frame.innerHTML = "";
  };

})();
