export { themes, type ThemeData, getCurrentTheme };

import themeCVT from "../styles/themes/svg/player-blue.svg?raw";
import themeGT from "../styles/themes/svg/player.svg?raw";
import winnerGt from "../styles/themes/svg/winner-gt.svg?raw";

interface ThemeData {
  id: string;
  folder: string;
  back: string;
  motifs: string[];
  showLabel: boolean;
  playerSvg: string;
  winnerSvg: string;
  confettiSvg: boolean;
  backBtnLabel: string;
}

const themes: Record<string, ThemeData> = {
  "Code vibes theme": {
    id: "code-vibes",
    folder: "code-vibes-theme-card",
    back: "cvt-card",
    motifs: [
      "angular",
      "bootstrap",
      "css",
      "django",
      "firebase",
      "git",
      "github",
      "html",
      "js",
      "nodejs",
      "python",
      "react",
      "sass",
      "sql",
      "terminal",
      "ts",
      "vsc",
      "vuejs",
    ],
    showLabel: true,
    playerSvg: themeCVT,
    winnerSvg: themeGT,
    confettiSvg: true,
    backBtnLabel: "Back to start",
  },
  "Gaming theme": {
    id: "games-theme",
    folder: "games-theme-cards",
    back: "gt-card",
    motifs: [
      "banana",
      "champions",
      "coin",
      "controller",
      "dice",
      "gameboy",
      "labyrinth",
      "medal",
      "minecraft",
      "pacman",
      "pacmanface",
      "play",
      "puzzle",
      "snake",
      "sq3",
      "sq4",
      "sqo",
      "acard",
    ],
    showLabel: false,
    playerSvg: themeGT,
    winnerSvg: winnerGt,
    confettiSvg: false,
    backBtnLabel: "Home",
  },
};

/**
 * Returns the theme saved in localStorage, or undefined if none is saved.
 * @returns {ThemeData | undefined} The current theme or undefined.
 */
function getCurrentTheme(): ThemeData | undefined {
  const theme = localStorage.getItem("theme");
  return theme ? themes[theme] : undefined;
}
