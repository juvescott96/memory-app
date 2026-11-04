export { createEl };

/** Creates an element with space-separated classes and optional text. */
function createEl(tag: string, className: string, text?: string): HTMLElement {
  const el = document.createElement(tag);
  el.classList.add(...className.split(" "));
  if (text) el.textContent = text;
  return el;
}
