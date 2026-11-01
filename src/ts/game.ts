import { themes, type ThemeData } from "./theme";
import { exitDialog } from "./dialog";
import { createEl } from "./dom";
import { addClickListener, createCards } from "./cards";

import drawSvg from "../styles/themes/svg/draw.svg?raw";
import confettiSvg from "../styles/themes/svg/confetti.svg?raw";

let boardNumber: string | null = localStorage.getItem("board-size");
const boardSize: number = boardNumber ? parseInt(boardNumber, 10) : 16;
const theme: string | null = localStorage.getItem("theme");

let currentPlayer: string = localStorage.getItem("player") || "Blue";

const scores: Record<string, number> = {
  Blue: 0,
  Orange: 0,
};

interface Player {
  color: "Blue" | "Orange";
  label?: string;
  score: number;
  svg: string;
}

function init() {
  const fieldRef = document.getElementById("field");
  const themeData = theme ? themes[theme] : undefined;
  setTheme(themeData);
  if (themeData) {
    renderPlayers(themeData);
    currentPlayers(themeData);
  }
  addClickListener(fieldRef, handleMatch, switchPlayer);
  exitDialog();
  createCards(theme, boardSize);
}

function setTheme(themeData?: ThemeData): void {
  if (themeData) {
    document.body.dataset.theme = themeData.id;
  }
}

function updateScore(): void {
  const scoreRef = document.querySelector(
    `.${currentPlayer.toLowerCase()} .score`,
  );
  if (!scoreRef) return;

  scoreRef.textContent = String(scores[currentPlayer]);
}

function switchPlayer() {
  if (currentPlayer === "Blue") {
    currentPlayer = "Orange";
  } else {
    currentPlayer = "Blue";
  }
  const themeData = theme ? themes[theme] : undefined;
  if (themeData) currentPlayers(themeData);
}

function handleMatch() {
  scores[currentPlayer] += 1;
  updateScore();
  if (isGameOver()) {
    const winner = getWinner();
    showGameOver(winner);
  }
  return;
}

function createPlayerBox(player: Player): HTMLDivElement {
  const playerLeft = document.createElement("div");
  playerLeft.classList.add("content", player.color.toLowerCase());

  const picture = createPlayerImage(player.svg);
  const label = document.createElement("p");
  const score = document.createElement("p");
  score.textContent = String(player.score);
  score.classList.add("score");

  playerLeft.append(picture);
  if (player.label) {
    label.textContent = player.label;
    playerLeft.append(label);
  }
  playerLeft.append(score);

  return playerLeft;
}

function createPlayerImage(svgText: string): HTMLDivElement {
  const picture = document.createElement("div");
  picture.innerHTML = svgText;
  picture.classList.add("players-img");

  return picture;
}

function renderPlayers(themeData: ThemeData): void {
  const players = document.getElementById("players");
  if (!players) return;

  const blue: Player = {
    color: "Blue",
    label: themeData.showLabel ? "Blue" : undefined,
    score: scores.Blue,
    svg: themeData.playerSvg,
  };
  const orange: Player = {
    color: "Orange",
    label: themeData.showLabel ? "Orange" : undefined,
    score: scores.Orange,
    svg: themeData.playerSvg,
  };

  players.append(createPlayerBox(blue), createPlayerBox(orange));
}

function currentPlayers(themeData: ThemeData): void {
  const currPlayers = document.getElementById("currentPlayer");
  if (!currPlayers) return;

  currPlayers.innerHTML = themeData.playerSvg;
  currPlayers.classList.remove("blue", "orange");
  currPlayers.classList.add("current", currentPlayer.toLowerCase());
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
  const themeData = theme ? themes[theme] : undefined;

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
  const themeData = theme ? themes[theme] : undefined;
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
