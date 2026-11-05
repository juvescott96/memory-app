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

/**
 * Fills the game field with shuffled cards for the theme and board size.
 * @param {ThemeData | undefined} themeData - Theme that provides the motifs.
 * @param {number} boardSize - Total number of cards (16, 24 or 36).
 */
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

/**
 * Returns each motif twice, one pair per two cards on the board.
 * @param {ThemeData} data - Theme that provides the motifs.
 * @param {number} boardSize - Total number of cards.
 * @returns {string[]} Motif names, each one twice.
 */
function pickMotifs(data: ThemeData, boardSize: number): string[] {
  const chosen = data.motifs.slice(0, boardSize / 2);
  return [...chosen, ...chosen];
}

/**
 * Sets the grid columns and gap on the field for the board size.
 * @param {HTMLElement} fieldRef - The game field element.
 * @param {number} boardSize - Total number of cards.
 */
function setGrid(fieldRef: HTMLElement, boardSize: number): void {
  fieldRef.style.setProperty("--grid-size", `${cardsNumber[boardSize]}`);
  fieldRef.style.setProperty("--grid-gap", `${cardsGap[boardSize]}px`);
}

/**
 * Shuffles the cards in place and returns them.
 * @param {string[]} cards - Motif names to shuffle.
 * @returns {string[]} The same array in random order.
 */
function shuffleCards(cards: string[]): string[] {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

/**
 * Creates a card button with a front and a back face for a motif.
 * @param {string} name - Motif name, also the image file name.
 * @param {ThemeData} data - Theme that provides the image folder.
 * @returns {HTMLButtonElement} The finished card.
 */
function buildCard(name: string, data: ThemeData): HTMLButtonElement {
  const card = createEl("button", "card") as HTMLButtonElement;
  card.dataset.motif = name;

  const inner = createEl("div", "card__inner") as HTMLDivElement;
  const front = createEl("div", "card__face") as HTMLDivElement;
  const back = createEl("div", "card__face card__face--back") as HTMLDivElement;

  back.style.backgroundImage = `url(./assets/${data.folder}/${name}.svg)`;

  inner.append(front, back);
  card.appendChild(inner);
  return card;
}

/**
 * Returns the clicked card element, or null if no card was clicked.
 * @param {MouseEvent} e - The click event.
 * @returns {HTMLButtonElement | null} The card or null.
 */
function getCard(e: MouseEvent): HTMLButtonElement | null {
  return (e.target as HTMLElement).closest<HTMLButtonElement>(".card");
}

/**
 * Returns true if the card can be flipped right now.
 * @param {HTMLButtonElement} card - The card to check.
 * @returns {boolean} True if the card can be flipped.
 */
function isClickable(card: HTMLButtonElement): boolean {
  return (
    !lockBoard && card !== flippedCard && !card.classList.contains(FLIPPED)
  );
}

/**
 * Returns true if both cards show the same motif.
 * @param {HTMLButtonElement} card1 - The first card.
 * @param {HTMLButtonElement} card2 - The second card.
 * @returns {boolean} True if the motifs are equal.
 */
function checkMatch(
  card1: HTMLButtonElement,
  card2: HTMLButtonElement,
): boolean {
  return card1.dataset.motif === card2.dataset.motif;
}

/**
 * Flips the clicked card and compares it with the first flipped card.
 * @param {MouseEvent} e - The click event.
 * @param {CardHandlers} handlers - Callbacks for a match and a mismatch.
 */
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

/**
 * Marks both cards as matched and calls the match handler.
 * @param {HTMLButtonElement} card - The second flipped card.
 * @param {CardHandlers} handlers - Callbacks for a match and a mismatch.
 */
function handlePair(card: HTMLButtonElement, handlers: CardHandlers): void {
  flippedCard?.classList.add("is-matched");
  card.classList.add("is-matched");
  flippedCard = null;
  handlers.onMatch();
}

/**
 * Flips both cards back after 1 second and calls the mismatch handler.
 * @param {HTMLButtonElement} card - The second flipped card.
 * @param {CardHandlers} handlers - Callbacks for a match and a mismatch.
 */
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

/**
 * Attaches the card click handler to the game field.
 * @param {HTMLElement | null} fieldRef - The game field element.
 * @param {CardHandlers} handlers - Callbacks for a match and a mismatch.
 */
function addClickListener(
  fieldRef: HTMLElement | null,
  handlers: CardHandlers,
): void {
  fieldRef?.addEventListener("click", (e) => handleCardClick(e, handlers));
}
