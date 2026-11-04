import drawSvg from "../styles/themes/svg/draw.svg?raw";
import confettiSvg from "../styles/themes/svg/confetti.svg?raw";
import { getCurrentTheme, type ThemeData } from "./theme";
import { createEl } from "./dom";
import { renderPlayers } from "./players";

export { showGameOver };

interface FinalBox {
  titleText: string;
  headlineText: string;
  draw: string;
}

function showGameOver(winner: string): void {
  const themeData = getCurrentTheme();
  resetScreen();

  const center = buildGameOverContent();
  document.body.append(center);

  if (themeData) {
    renderPlayers(themeData);
  }

  setTimeout(() => {
    showWinner(winner);
  }, 2000);
}

function buildGameOverContent(): HTMLElement {
  const center = createEl("div", "game-over-content");
  const headline = createEl("h1", "game-over", "Game Over");
  const box = createEl("div", "final-score-content");
  const title = createEl("p", "final-score-title", "Final score");
  const playerBox = createEl("div", "players");
  playerBox.id = "players";

  box.append(title, playerBox);
  center.append(headline, box);

  return center;
}

function showWinner(winner: string): void {
  const themeData = getCurrentTheme();
  resetScreen();
  maybeAddConfetti(themeData, winner);

  const center = createEl("div", `game-over-content ${winner.toLowerCase()}`);
  const box = createEl("div", "final-score-content");
  const finalBox = getWinnerText(winner, themeData);
  const title = createEl("p", "winner-title", finalBox.titleText);
  const headline = createEl("h2", "winner-headline", finalBox.headlineText);
  const playerSvg = buildWinnerSvg(finalBox.draw);
  const button = buildBackBtn(themeData?.backBtnLabel ?? "Back to start");

  box.append(title, headline);
  center.append(box, playerSvg, button);
  document.body.append(center);
}

function maybeAddConfetti(
  themeData: ThemeData | undefined,
  winner: string,
): void {
  if (themeData?.confettiSvg && winner !== "Draw") {
    const confetti = addConfetti();
    document.body.appendChild(confetti);
  }
}

function buildWinnerSvg(svgText: string): HTMLElement {
  const el = createEl("div", "winner-svg");
  el.innerHTML = svgText;
  return el;
}

function buildBackBtn(label: string): HTMLElement {
  const button = createEl("button", "backbutton", label);
  button.addEventListener("click", () => {
    window.location.href = "settings.html";
  });
  return button;
}

function getWinnerText(winner: string, data: ThemeData | undefined): FinalBox {
  if (winner === "Draw") {
    return {
      titleText: "It's a",
      headlineText: winner.toUpperCase(),
      draw: drawSvg,
    };
  }
  return {
    titleText: "The winner is",
    headlineText: winner.toUpperCase() + " PLAYER",
    draw: data?.winnerSvg ?? "",
  };
}

function addConfetti(): HTMLElement {
  const confetti = createEl("div", "confetti");
  confetti.innerHTML = confettiSvg.repeat(3);
  return confetti;
}

function resetScreen(): void {
  document.body.innerHTML = "";
  document.body.classList.add("game-over-screen");
}
