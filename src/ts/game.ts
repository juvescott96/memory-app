import themeCVT from "../styles/themes/svg/player-blue.svg?raw";
import themeGT from "../styles/themes/svg/player.svg?raw";

let boardNumber: string | null = localStorage.getItem("board-size");
const boardSize: number = boardNumber ? parseInt(boardNumber, 10) : 16;
const theme: string | null = localStorage.getItem("theme");
const FLIPPED: string = "is-flipped";

let flippedCard: HTMLButtonElement | null = null;
let lockBoard: boolean = false;
let currentPlayer: string = localStorage.getItem("player") || "Blue";

const scores: Record<string, number> = {
  Blue: 0,
  Orange: 0,
};

interface ThemeData {
  id: string;
  folder: string;
  back: string;
  motifs: string[];
  showLabel: boolean;
  playerSvg: string;
}

interface Player {
  color: "Blue" | "Orange";
  label?: string;
  score: number;
  svg: string;
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
  },
};

const cardsNumber: Record<number, number> = {
  16: 4,
  24: 6,
  36: 6,
};

const cardsGap: Record<number, number> = {
  16: 12,
  24: 6,
  36: 6,
};

function init() {
  const fieldRef = document.getElementById("field");
  const themeData = theme ? themes[theme] : undefined;
  setTheme(themeData);
  if (themeData) {
    renderPlayers(themeData);
    currentPlayers(themeData);
  }
  addClickListener(fieldRef);
  createCards(theme, boardSize);
}

function setTheme(themeData?: ThemeData): void {
  if (themeData) {
    document.body.dataset.theme = themeData.id;
  }
}

function handleCardClick(e: MouseEvent): void {
  const card = getCard(e);
  if (!card || !isClickable(card)) return;

  card.classList.add(FLIPPED);
  if (!flippedCard) {
    flippedCard = card;
    return;
  }
  if (checkMatch(flippedCard, card)) {
    flippedCard?.classList.add("is-matched");
    card.classList.add("is-matched");
    flippedCard = null;
    scores[currentPlayer] += 1;
    updateScore();
    if (isGameOver()) {
      const winner = getWinner();
      console.log(winner);
    }
    return;
  }
  handleMismatch(card);
}

function updateScore(): void {
  const scoreRef = document.querySelector(
    `.${currentPlayer.toLowerCase()} .score`,
  );
  if (!scoreRef) return;

  scoreRef.textContent = String(scores[currentPlayer]);
}

function getCard(e: MouseEvent): HTMLButtonElement | null {
  return (e.target as HTMLElement).closest<HTMLButtonElement>(".card");
}

function isClickable(card: HTMLButtonElement): boolean {
  return (
    !lockBoard && card !== flippedCard && !card.classList.contains(FLIPPED)
  );
}

function addClickListener(fieldRef: HTMLElement | null): void {
  fieldRef?.addEventListener("click", handleCardClick);
}

function handleMismatch(card: HTMLButtonElement): void {
  lockBoard = true;
  setTimeout(() => {
    card.classList.remove(FLIPPED);
    flippedCard?.classList.remove(FLIPPED);
    flippedCard = null;
    lockBoard = false;
    switchPlayer();
  }, 1000);
}

function checkMatch(
  card1: HTMLButtonElement,
  card2: HTMLButtonElement,
): boolean {
  return card1.dataset.motif === card2.dataset.motif;
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

function createCards(theme: string | null, boardSize: number): void {
  const fieldRef = document.getElementById("field");
  const data = theme ? themes[theme] : undefined;
  if (!fieldRef || !data) return;

  const chosen = data.motifs.slice(0, boardSize / 2);
  const cards = [...chosen, ...chosen];

  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  fieldRef.innerHTML = "";
  fieldRef.style.setProperty("--grid-size", `${cardsNumber[boardSize]}`);
  fieldRef.style.setProperty("--grid-gap", `${cardsGap[boardSize]}px`);

  cards.forEach((name) => {
    const card = document.createElement("button");
    card.classList.add("card");
    card.dataset.motif = name;

    const inner = document.createElement("div");
    inner.classList.add("card__inner");

    const front = document.createElement("div");
    front.classList.add("card__face");

    const back = document.createElement("div");
    back.classList.add("card__face", "card__face--back");
    back.style.backgroundImage = `url(./public/assets/${data.folder}/${name}.svg)`;

    inner.append(front, back);
    card.appendChild(inner);
    fieldRef.appendChild(card);
  });
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
    score: 0,
    svg: themeData.playerSvg,
  };
  const orange: Player = {
    color: "Orange",
    label: themeData.showLabel ? "Orange" : undefined,
    score: 0,
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

init();
