export { exitDialog };

interface DialogElements {
  exitBtn: HTMLButtonElement;
  backBtn: HTMLButtonElement;
  exitGameBtn: HTMLButtonElement;
  dialog: HTMLDialogElement;
}

function exitDialog(): void {
  const elements = getDialogElements();
  if (!elements) return;
  addDialogListeners(elements.dialog);
  addButtonListeners(elements);
}

function getDialogElements(): DialogElements | null {
  const exitBtn = getButton("exit-btn");
  const backBtn = getButton("back-btn");
  const exitGameBtn = getButton("exit-game-btn");
  const dialog = document.querySelector("dialog") as HTMLDialogElement | null;

  if (!exitBtn || !backBtn || !exitGameBtn || !dialog) return null;
  return { exitBtn, backBtn, exitGameBtn, dialog };
}

function getButton(id: string): HTMLButtonElement | null {
  return document.getElementById(id) as HTMLButtonElement | null;
}

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
