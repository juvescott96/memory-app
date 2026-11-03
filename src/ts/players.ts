export { scores, renderPlayers, currentPlayers, switchPlayer, addPoint };

import { type ThemeData, getCurrentTheme } from "./theme";
import { createEl } from "./dom";

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

function createPlayerImage(svgText: string): HTMLElement {
  const picture = createEl("div", "players-img");
  picture.innerHTML = svgText;

  return picture;
}

function createPlayerBox(player: Player): HTMLElement {
  const playerLeft = createEl("div", `content ${player.color.toLowerCase()}`);

  const picture = createPlayerImage(player.svg);
  const label = document.createElement("p");
  const score = createEl("p", "score");
  score.textContent = String(player.score);

  playerLeft.append(picture);
  if (player.label) {
    label.textContent = player.label;
    playerLeft.append(label);
  }
  playerLeft.append(score);

  return playerLeft;
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

function switchPlayer() {
  if (currentPlayer === "Blue") {
    currentPlayer = "Orange";
  } else {
    currentPlayer = "Blue";
  }
  const themeData = getCurrentTheme();
  if (themeData) currentPlayers(themeData);
}

function updateScore(): void {
  const scoreRef = document.querySelector(
    `.${currentPlayer.toLowerCase()} .score`,
  );
  if (!scoreRef) return;

  scoreRef.textContent = String(scores[currentPlayer]);
}

function addPoint(): void {
  scores[currentPlayer] += 1;
  updateScore();
}
