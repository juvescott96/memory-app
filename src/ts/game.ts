let boardNumber: string | null = localStorage.getItem("board-size");
const boardSize: number = boardNumber ? parseInt(boardNumber, 10) : 16;
const theme: string | null = localStorage.getItem("theme");

type ThemeData = {
  folder: string;
  back: string;
  motifs: string[];
};

const themes: Record<string, ThemeData> = {
  "Code vibes theme": {
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
  },
  "Gaming theme": {
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
  },
};

const cardsNumber: Record<number, number> = {
  16: 4,
  24: 6,
  36: 6,
};

function init() {
  const fieldRef = document.getElementById("field");

  if (fieldRef) {
    fieldRef.addEventListener("click", (e) => {
      const card = (e.target as HTMLElement).closest(
        ".card",
      ) as HTMLButtonElement;
      if (card) {
        card.classList.toggle("is-flipped");
      }
    });
  }
  createCards(theme, boardSize);
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

  cards.forEach((name) => {
    const card = document.createElement("button");
    card.classList.add("card");
    card.dataset.motif = name;

    const inner = document.createElement("div");
    inner.classList.add("card__inner");

    const front = document.createElement("div");
    front.classList.add("card__face");
    front.style.backgroundImage = `url(./public/assets/${data.folder}/${data.back}.png)`;

    const back = document.createElement("div");
    back.classList.add("card__face", "card__face--back");
    back.style.backgroundImage = `url(./public/assets/${data.folder}/${name}.png)`;

    inner.append(front, back);
    card.appendChild(inner);
    fieldRef.appendChild(card);
  });
}

init();
