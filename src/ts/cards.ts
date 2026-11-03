export { addClickListener, createCards };
import { type ThemeData } from "./theme";
import { createEl } from "./dom";

let lockBoard: boolean = false;
let flippedCard: HTMLButtonElement | null = null;
const FLIPPED: string = "is-flipped";

interface CardHandlers {
  onMatch: () => void;
  onMismatch: () => void;
}

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

function createCards(
  themeData: ThemeData | undefined,
  boardSize: number,
): void {
  const fieldRef = document.getElementById("field");
  if (!fieldRef || !themeData) return;

  const cards = pickMotifs(themeData, boardSize);
  const deck = shuffleCards(cards);

  fieldRef.innerHTML = "";
  setGrid(fieldRef, boardSize);
  deck.forEach((name) => {
    fieldRef.appendChild(buildCard(name, themeData));
  });
}

function pickMotifs(data: ThemeData, boardSize: number): string[] {
  const chosen = data.motifs.slice(0, boardSize / 2);
  return [...chosen, ...chosen];
}

function setGrid(fieldRef: HTMLElement, boardSize: number): void {
  fieldRef.style.setProperty("--grid-size", `${cardsNumber[boardSize]}`);
  fieldRef.style.setProperty("--grid-gap", `${cardsGap[boardSize]}px`);
}

function shuffleCards(cards: string[]): string[] {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function buildCard(name: string, data: ThemeData): HTMLButtonElement {
  const card = createEl("button", "card") as HTMLButtonElement;
  card.dataset.motif = name;

  const inner = createEl("div", "card__inner") as HTMLDivElement;
  const front = createEl("div", "card__face") as HTMLDivElement;
  const back = createEl("div", "card__face card__face--back") as HTMLDivElement;

  back.style.backgroundImage = `url(./public/assets/${data.folder}/${name}.svg)`;

  inner.append(front, back);
  card.appendChild(inner);
  return card;
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

function handleCardClick(e: MouseEvent, handlers: CardHandlers): void {
  const card = getCard(e);
  if (!card || !isClickable(card)) return;

  card.classList.add(FLIPPED);
  if (!flippedCard) {
    flippedCard = card;
    return;
  }
  if (checkMatch(flippedCard, card)) {
    handlePair(card, handlers);
    return;
  }
  handleMismatch(card, handlers);
}

function handlePair(card: HTMLButtonElement, handlers: CardHandlers): void {
  flippedCard?.classList.add("is-matched");
  card.classList.add("is-matched");
  flippedCard = null;
  handlers.onMatch();
}

function handleMismatch(card: HTMLButtonElement, handlers: CardHandlers): void {
  lockBoard = true;
  setTimeout(() => {
    card.classList.remove(FLIPPED);
    flippedCard?.classList.remove(FLIPPED);
    flippedCard = null;
    lockBoard = false;
    handlers.onMismatch();
  }, 1000);
}

function addClickListener(
  fieldRef: HTMLElement | null,
  handlers: CardHandlers,
): void {
  fieldRef?.addEventListener("click", (e) => handleCardClick(e, handlers));
}
