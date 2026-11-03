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

init();
