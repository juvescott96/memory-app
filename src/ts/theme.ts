export { themes, type ThemeData };

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
  },
};
