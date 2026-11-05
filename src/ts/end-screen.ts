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

/**
 * Shows the final score screen, then the winner screen after 2 seconds.
 * @param {string} winner - "Blue", "Orange" or "Draw".
 */
function showGameOver(winner: string): void {
  const themeData = getCurrentTheme();
  resetScreen();

  const screen = createEl("div", "screen");
  screen.append(buildGameOverContent());
  document.body.append(screen);

  if (themeData) {
    renderPlayers(themeData);
  }

  setTimeout(() => {
    showWinner(winner);
  }, 2000);
}

/**
 * Builds the Game Over layout with headline and player box.
 * @returns {HTMLElement} The finished layout.
 */
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

/**
 * Slides the winner or draw screen in from the top over the old screen.
 * @param {string} winner - "Blue", "Orange" or "Draw".
 */
function showWinner(winner: string): void {
  const themeData = getCurrentTheme();
  const screen = createEl("div", "screen screen--enter");

  maybeAddConfetti(screen, themeData, winner);
  screen.append(buildWinnerContent(winner, themeData));
  swapScreens(screen);
}

/**
 * Builds the winner layout with headline, image and back button.
 * @param {string} winner - "Blue", "Orange" or "Draw".
 * @param {ThemeData | undefined} themeData - Current theme for image and label.
 * @returns {HTMLElement} The finished layout.
 */
function buildWinnerContent(
  winner: string,
  themeData: ThemeData | undefined,
): HTMLElement {
  const center = createEl("div", `game-over-content ${winner.toLowerCase()}`);
  const box = createEl("div", "final-score-content");
  const finalBox = getWinnerText(winner, themeData);
  const title = createEl("p", "winner-title", finalBox.titleText);
  const headline = createEl("h2", "winner-headline", finalBox.headlineText);
  const playerSvg = buildWinnerSvg(finalBox.draw);
  const button = buildBackBtn(themeData?.backBtnLabel ?? "Back to start");

  box.append(title, headline);
  center.append(box, playerSvg, button);
  return center;
}

/**
 * Slides the old screen down and out while the next one slides in.
 * @param {HTMLElement} next - The screen that slides in.
 */
function swapScreens(next: HTMLElement): void {
  const old = document.querySelector(".screen");
  document.body.append(next);
  if (!old) return;

  old.classList.add("screen--leave");
  old.addEventListener("animationend", () => old.remove(), { once: true });
}

/**
 * Adds confetti to the screen if the theme supports it and it is no draw.
 * @param {HTMLElement} screen - The screen that receives the confetti.
 * @param {ThemeData | undefined} themeData - Current theme.
 * @param {string} winner - "Blue", "Orange" or "Draw".
 */
function maybeAddConfetti(
  screen: HTMLElement,
  themeData: ThemeData | undefined,
  winner: string,
): void {
  if (themeData?.confettiSvg && winner !== "Draw") {
    screen.append(addConfetti());
  }
}

/**
 * Creates a container holding the given SVG markup.
 * @param {string} svgText - The SVG markup.
 * @returns {HTMLElement} The container element.
 */
function buildWinnerSvg(svgText: string): HTMLElement {
  const el = createEl("div", "winner-svg");
  el.innerHTML = svgText;
  return el;
}

/** Removes the saved settings so the next visit starts fresh. */
function clearSavedSettings(): void {
  ["theme", "player", "board-size"].forEach((key) => {
    localStorage.removeItem(key);
  });
}

/**
 * Creates a button that clears the saved settings and returns to settings.
 * @param {string} label - The button text.
 * @returns {HTMLElement} The button element.
 */
function buildBackBtn(label: string): HTMLElement {
  const button = createEl("button", "backbutton", label);
  button.addEventListener("click", () => {
    clearSavedSettings();
    window.location.href = "settings.html";
  });
  return button;
}

/**
 * Returns title, headline and image for the winner or draw screen.
 * @param {string} winner - "Blue", "Orange" or "Draw".
 * @param {ThemeData | undefined} data - Current theme for the winner image.
 * @returns {FinalBox} Title text, headline text and SVG markup.
 */
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

/**
 * Creates the confetti element from three repeated SVGs.
 * @returns {HTMLElement} The confetti element.
 */
function addConfetti(): HTMLElement {
  const confetti = createEl("div", "confetti");
  confetti.innerHTML = confettiSvg.repeat(3);
  return confetti;
}

/** Clears the page and applies the game over screen class. */
function resetScreen(): void {
  document.body.innerHTML = "";
  document.body.classList.add("game-over-screen");
}
