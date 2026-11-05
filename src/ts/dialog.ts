export { exitDialog };

interface DialogElements {
  exitBtn: HTMLButtonElement;
  backBtn: HTMLButtonElement;
  exitGameBtn: HTMLButtonElement;
  dialog: HTMLDialogElement;
}

/** Sets up the exit dialog and wires its buttons. */
function exitDialog(): void {
  const elements = getDialogElements();
  if (!elements) return;
  addDialogListeners(elements.dialog);
  addButtonListeners(elements);
}

/**
 * Returns the dialog and its buttons, or null if one is missing.
 * @returns {DialogElements | null} The dialog elements or null.
 */
function getDialogElements(): DialogElements | null {
  const exitBtn = getButton("exit-btn");
  const backBtn = getButton("back-btn");
  const exitGameBtn = getButton("exit-game-btn");
  const dialog = document.querySelector("dialog") as HTMLDialogElement | null;

  if (!exitBtn || !backBtn || !exitGameBtn || !dialog) return null;
  return { exitBtn, backBtn, exitGameBtn, dialog };
}

/**
 * Returns the button with the given id, or null if not found.
 * @param {string} id - The id of the button.
 * @returns {HTMLButtonElement | null} The button or null.
 */
function getButton(id: string): HTMLButtonElement | null {
  return document.getElementById(id) as HTMLButtonElement | null;
}

/**
 * Closes the dialog on a backdrop click or the Escape key.
 * @param {HTMLDialogElement} dialog - The exit dialog.
 */
function addDialogListeners(dialog: HTMLDialogElement): void {
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      closeDialog(dialog);
    }
  });

  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeDialog(dialog);
  });
}

/**
 * Wires the exit, back and exit game buttons.
 * @param {DialogElements} elements - The dialog and its buttons.
 */
function addButtonListeners(elements: DialogElements): void {
  elements.exitBtn.addEventListener("click", () => {
    elements.dialog.showModal();
  });
  elements.backBtn.addEventListener("click", () => {
    closeDialog(elements.dialog);
  });

  elements.exitGameBtn.addEventListener("click", () => {
    window.location.href = "settings.html";
  });
}

/**
 * Plays the closing animation, then closes the dialog.
 * @param {HTMLDialogElement} dialog - The exit dialog.
 */
function closeDialog(dialog: HTMLDialogElement): void {
  dialog.classList.add("closing");

  dialog.addEventListener(
    "animationend",
    () => {
      dialog.close();
      dialog.classList.remove("closing");
    },
    { once: true },
  );
}
