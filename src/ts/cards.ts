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

/** Fills the game field with shuffled cards for the theme and board size. */
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

/** Returns each motif twice, one pair per two cards on the board. */
function pickMotifs(data: ThemeData, boardSize: number): string[] {
  const chosen = data.motifs.slice(0, boardSize / 2);
  return [...chosen, ...chosen];
}

/** Sets the grid columns and gap on the field for the board size. */
function setGrid(fieldRef: HTMLElement, boardSize: number): void {
  fieldRef.style.setProperty("--grid-size", `${cardsNumber[boardSize]}`);
  fieldRef.style.setProperty("--grid-gap", `${cardsGap[boardSize]}px`);
}

/** Shuffles the cards in place and returns them. */
function shuffleCards(cards: string[]): string[] {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

/** Creates a card button with a front and a back face for a motif. */
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

/** Returns the clicked card element, or null if no card was clicked. */
function getCard(e: MouseEvent): HTMLButtonElement | null {
  return (e.target as HTMLElement).closest<HTMLButtonElement>(".card");
}

/** Returns true if the card can be flipped right now. */
function isClickable(card: HTMLButtonElement): boolean {
  return (
    !lockBoard && card !== flippedCard && !card.classList.contains(FLIPPED)
  );
}

/** Returns true if both cards show the same motif. */
function checkMatch(
  card1: HTMLButtonElement,
  card2: HTMLButtonElement,
): boolean {
  return card1.dataset.motif === card2.dataset.motif;
}

/** Flips the clicked card and compares it with the first flipped card. */
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

/** Marks both cards as matched and calls the match handler. */
function handlePair(card: HTMLButtonElement, handlers: CardHandlers): void {
  flippedCard?.classList.add("is-matched");
  card.classList.add("is-matched");
  flippedCard = null;
  handlers.onMatch();
}

/** Flips both cards back after 1 second and calls the mismatch handler. */
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

/** Attaches the card click handler to the game field. */
function addClickListener(
  fieldRef: HTMLElement | null,
  handlers: CardHandlers,
): void {
  fieldRef?.addEventListener("click", (e) => handleCardClick(e, handlers));
}
