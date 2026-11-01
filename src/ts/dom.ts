export { createEl };

function createEl(tag: string, className: string, text?: string): HTMLElement {
  const el = document.createElement(tag);
  el.classList.add(className);
  if (text) el.textContent = text;
  return el;
}
