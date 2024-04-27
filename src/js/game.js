import { WORDS } from "./consts";
import { LETTERS } from "./consts";

const gameDiv = document.getElementById("game");
const logoH1 = document.getElementById("logo");

let triesLeft;
let winCount;

const createPlaceholdersHTML = () => {
  //  Placeholders from random word _ _ _

  const word = sessionStorage.getItem("word");
  const wordArray = Array.from(word);
  const placeholdersHTML = wordArray.reduce(
    (acc, curr, i) => acc + `<h1 id="letter_${i}" class="letter">_</h1>`,
    ""
  );
  return `<div id="placeholders" class="placeholders_wrapper">${placeholdersHTML}</div>`;
};

// Keyboard Letters
const createKeyboard = () => {
  const keyboard = document.createElement("div");
  keyboard.classList.add("keyboard");
  keyboard.id = "keyboard";

  const keyboardHTML = LETTERS.reduce((acc, curr) => {
    return acc + `<button class="keyboardBtn" id="${curr}">${curr}</button>`;
  }, "");

  keyboard.innerHTML = keyboardHTML;
  return keyboard;
};

// Create Hangman Image
const createHangmanImg = () => {
  const image = document.createElement("img");
  image.src = "images/hg-0.png";
  image.alt = "Hangman Image";
  image.classList.add("hangman-img");
  image.id = "hangman-img";

  return image;
};

const checkLetter = (letter) => {
  const word = sessionStorage.getItem("word");
  const inputLetter = letter.toLowerCase();
  if (!word.includes(inputLetter)) {
    const triesCounter = document.getElementById("tries-left");
    triesLeft -= 1;
    triesCounter.innerText = triesLeft;

    const hangmanImg = document.getElementById("hangman-img");
    hangmanImg.src = `images/hg-${10 - triesLeft}.png`;

    if (triesLeft === 0) {
      stopGame("lose");
    }
  } else {
    const wordArray = Array.from(word);
    wordArray.forEach((currentLetter, i) => {
      if (currentLetter === inputLetter) {
        winCount += 1;
        if (winCount === word.length) {
          stopGame("win");
          return;
        }
        document.getElementById(`letter_${i}`).innerText =
          inputLetter.toUpperCase();
      }
    });
  }
};

const stopGame = (status) => {
  document.getElementById("placeholders").remove();
  document.getElementById("tries").remove();
  document.getElementById("keyboard").remove();
  document.getElementById("quit").remove();

  const word = sessionStorage.getItem("word");

  if (status === "win") {
    document.getElementById("hangman-img").src = "images/hg-win.png";
    document.getElementById("game").innerHTML +=
      '<h2 class="result-header win"> You Won!</h2>';
  } else if (status === "lose") {
    document.getElementById("game").innerHTML +=
      '<h2 class="result-header lose"> You Lost!</h2>';
  } else if (status === "quit") {
    document.getElementById("hangman-img").remove();
  }

  document.getElementById(
    "game"
  ).innerHTML += `<p>The word was: <span class="result-word">${word}</span></p><button id="play-again" class="startBtn mt-4">Play Again</button>`;
  document.getElementById("play-again").onclick = startGame;
};

export const startGame = () => {
  triesLeft = 10;
  winCount = 0;
  logoH1.remove();
  // Random word generator
  const randomIndex = Math.floor(Math.random() * WORDS.length);
  const wordToGuess = WORDS[randomIndex];
  sessionStorage.setItem("word", wordToGuess);
  gameDiv.innerHTML = createPlaceholdersHTML();
  gameDiv.innerHTML +=
    '<p id="tries" class="tries">Attempts left: <span id="tries-left" class="tries-left"> 10</span></p>';

  const keyboardDiv = createKeyboard();
  keyboardDiv.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() === "button") {
      event.target.disabled = true;
      checkLetter(event.target.id);
    }
  });

  const hangmanImg = createHangmanImg();
  gameDiv.prepend(hangmanImg);

  gameDiv.appendChild(keyboardDiv);

  gameDiv.insertAdjacentHTML(
    "beforeend",
    '<button id="quit" class="quitBtn">Quit</button>'
  );
  document.getElementById("quit").onclick = () => {
    const isSure = confirm(
      "Are you sure you want to quit and lose the progress?"
    );
    if (isSure === true) {
      stopGame("quit");
    }
  };
};
