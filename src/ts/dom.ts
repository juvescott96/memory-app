export { createEl };

/**
 * Creates an element with space-separated classes and optional text.
 * @param {string} tag - The HTML tag name, e.g. "div".
 * @param {string} className - One or more classes separated by spaces.
 * @param {string} [text] - Optional text content.
 * @returns {HTMLElement} The new element.
 */
function createEl(tag: string, className: string, text?: string): HTMLElement {
  const el = document.createElement(tag);
  el.classList.add(...className.split(" "));
  if (text) el.textContent = text;
  return el;
}
