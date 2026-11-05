import { type ThemeData, getCurrentTheme } from "./theme";
import { exitDialog } from "./dialog";
import { addClickListener, createCards } from "./cards";
import {
  scores,
  renderPlayers,
  switchPlayer,
  currentPlayers,
  addPoint,
} from "./players";
import { showGameOver } from "./end-screen";

let boardNumber: string | null = localStorage.getItem("board-size");
const boardSize: number = boardNumber ? parseInt(boardNumber, 10) : 16;

/** Sets up theme, players, cards and dialog when the game page loads. */
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

/** Sets the theme id on the body so theme styles apply. */
function setTheme(themeData?: ThemeData): void {
  if (themeData) {
    document.body.dataset.theme = themeData.id;
  }
}

/** Adds a point for the current player and ends the game when all pairs are found. */
function handleMatch() {
  addPoint();
  if (isGameOver()) {
    const winner = getWinner();
    setTimeout(() => {
      showGameOver(winner);
    }, 1000);
  }
}

/** Returns true when all pairs have been found. */
function isGameOver(): boolean {
  const foundPairs = scores.Orange + scores.Blue;
  return foundPairs === boardSize / 2;
}

/** Returns the player with more points, or "Draw" on a tie. */
function getWinner(): string {
  if (scores.Blue > scores.Orange) {
    return "Blue";
  } else if (scores.Orange > scores.Blue) {
    return "Orange";
  } else {
    return "Draw";
  }
}

init();
