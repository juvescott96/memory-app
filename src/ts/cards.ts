export { addClickListener, createCards };
import { themes } from "./theme";

let lockBoard: boolean = false;
let flippedCard: HTMLButtonElement | null = null;
const FLIPPED: string = "is-flipped";

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

function getCard(e: MouseEvent): HTMLButtonElement | null {
  return (e.target as HTMLElement).closest<HTMLButtonElement>(".card");
}

function isClickable(card: HTMLButtonElement): boolean {
  return (
    !lockBoard && card !== flippedCard && !card.classList.contains(FLIPPED)
  );
}

function checkMatch(
  card1: HTMLButtonElement,
  card2: HTMLButtonElement,
): boolean {
  return card1.dataset.motif === card2.dataset.motif;
}

function handleCardClick(
  e: MouseEvent,
  onMatch: () => void,
  onMismatch: () => void,
): void {
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
    onMatch();
    return;
  }
  handleMismatch(card, onMismatch);
}

function handleMismatch(card: HTMLButtonElement, onMismatch: () => void): void {
  lockBoard = true;
  setTimeout(() => {
    card.classList.remove(FLIPPED);
    flippedCard?.classList.remove(FLIPPED);
    flippedCard = null;
    lockBoard = false;
    onMismatch();
  }, 1000);
}

function addClickListener(
  fieldRef: HTMLElement | null,
  onMatch: () => void,
  onMismatch: () => void,
): void {
  fieldRef?.addEventListener("click", (e) =>
    handleCardClick(e, onMatch, onMismatch),
  );
}
