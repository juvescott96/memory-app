import { themes, type ThemeData, getCurrentTheme } from "./theme";
import { exitDialog } from "./dialog";
import { createEl } from "./dom";
import { addClickListener, createCards } from "./cards";
import {
  scores,
  renderPlayers,
  currentPlayers,
  switchPlayer,
  addPoint,
} from "./players";

import drawSvg from "../styles/themes/svg/draw.svg?raw";
import confettiSvg from "../styles/themes/svg/confetti.svg?raw";

let boardNumber: string | null = localStorage.getItem("board-size");
const boardSize: number = boardNumber ? parseInt(boardNumber, 10) : 16;

function init() {
  const fieldRef = document.getElementById("field");
  const themeData = getCurrentTheme();
  setTheme(themeData);
  if (themeData) {
    renderPlayers(themeData);
    currentPlayers(themeData);
  }
  addClickListener(fieldRef, {
    onMatch: handleMatch,
    onMismatch: switchPlayer,
  });
  exitDialog();
  createCards(themeData, boardSize);
}

function setTheme(themeData?: ThemeData): void {
  if (themeData) {
    document.body.dataset.theme = themeData.id;
  }
}

function handleMatch() {
  addPoint();
  if (isGameOver()) {
    const winner = getWinner();
    showGameOver(winner);
  }
}

function isGameOver(): boolean {
  const foundPairs = scores.Orange + scores.Blue;
  return foundPairs === boardSize / 2;
}

function getWinner(): string {
  if (scores.Blue > scores.Orange) {
    return "Blue";
  } else if (scores.Orange > scores.Blue) {
    return "Orange";
  } else {
    return "Draw";
  }
}

function showGameOver(winner: string): void {
  const themeData = getCurrentTheme();

  document.body.innerHTML = "";
  document.body.classList.add("game-over-screen");

  const center = createEl("div", "game-over-content");
  const headline = createEl("h1", "game-over", "Game Over");
  const box = createEl("div", "final-score-content");
  const title = createEl("p", "final-score-title", "Final score");
  const playerBox = createEl("div", "players");
  playerBox.id = "players";

  box.append(title, playerBox);
  center.append(headline, box);
  document.body.append(center);

  if (themeData) {
    renderPlayers(themeData);
  }

  setTimeout(() => {
    showWinner(winner);
  }, 2000);
}

function showWinner(winner: string): void {
  const themeData = getCurrentTheme();
  document.body.innerHTML = "";
  document.body.classList.add("game-over-screen");
  if (themeData?.confettiSvg && winner !== "Draw") {
    const confetti = addConfetti();
    document.body.appendChild(confetti);
  }

  const center = createEl("div", "game-over-content");
  center.classList.add(winner.toLowerCase());

  const box = createEl("div", "final-score-content");
  let titleText: string;
  let headlineText: string;
  let draw: string;

  if (winner === "Draw") {
    titleText = "It's a";
    headlineText = `${winner.toUpperCase()}`;
    draw = drawSvg;
  } else {
    titleText = "The winner is";
    headlineText = `${winner.toUpperCase()} PLAYER`;
    draw = themeData?.winnerSvg ?? "";
  }

  const title = createEl("p", "winner-title", titleText);
  const headline = createEl("h2", "winner-headline", headlineText);

  const playerSvg = document.createElement("div");
  playerSvg.classList.add("winner-svg");
  playerSvg.innerHTML = draw;

  const button = createEl("button", "backbutton", "Back to start");
  button.addEventListener("click", () => {
    window.location.href = "settings.html";
  });

  box.append(title, headline);
  center.append(box, playerSvg, button);
  document.body.append(center);
}

function addConfetti(): HTMLElement {
  const confetti = createEl("div", "confetti");
  confetti.innerHTML = confettiSvg.repeat(3);
  return confetti;
}

init();
