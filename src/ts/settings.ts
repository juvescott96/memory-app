/** Maps each setting group to the element that shows its chosen value. */
const settingsTargets: Record<string, string> = {
  theme: "game-theme",
  player: "player",
  "board-size": "board-size",
};

/** Maps each theme name to its preview image. */
const themeImages: Record<string, string> = {
  "Code vibes theme": "./assets/code-vibes-theme-card/cb-theme.svg",
  "Gaming theme": "./assets/games-theme-cards/g-theme.svg",
};

/** Shows the preview image of the selected theme. */
function updateThemeImage(input: HTMLInputElement): void {
  const image = document.getElementById(
    "theme-visual",
  ) as HTMLImageElement | null;
  const src = themeImages[input.value];
  if (image && src) {
    image.src = src;
  }
}

/** Displays the selected value in the settings summary. */
function updateChosenSetting(input: HTMLInputElement): void {
  const targetId = settingsTargets[input.name];
  if (!targetId) return;

  const target = document.getElementById(targetId);
  if (target) {
    target.textContent = input.value;
  }

  if (input.name === "theme") {
    updateThemeImage(input);
  }
}

/** Names of all radio groups that must be selected before the game starts. */
const settingsGroups = ["theme", "player", "board-size"];

/** Enables the start button once every setting group has a selection. */
function checkAllSelected(): void {
  const chosenSettings = document.querySelector(".chosen-settings");
  const startButton = document.querySelector(".disabledbtn");

  const allSelected = settingsGroups.every((groupName) => {
    return (
      document.querySelector(`input[name="${groupName}"]:checked`) !== null
    );
  });

  chosenSettings?.classList.toggle("chosen-settings--complete", allSelected);

  if (allSelected) {
    startButton?.classList.remove("disabledbtn");
  }
}

/** Shows preselected settings and updates the summary on every change. */
function initSettingsRadios(): void {
  const settingsRadios = document.querySelectorAll<HTMLInputElement>(
    'aside.left-side input[type="radio"]',
  );

  settingsRadios.forEach((radio) => {
    if (radio.checked) {
      updateChosenSetting(radio);
    }

    radio.addEventListener("change", () => {
      updateChosenSetting(radio);
      checkAllSelected();
    });
  });
}

/** Saves the chosen settings to localStorage and opens the game page. */
function saveSettingsAndStart(): void {
  localStorage.setItem(
    "theme",
    document.querySelector<HTMLInputElement>('input[name="theme"]:checked')
      ?.value || "",
  );
  localStorage.setItem(
    "player",
    document.querySelector<HTMLInputElement>('input[name="player"]:checked')
      ?.value || "",
  );
  localStorage.setItem(
    "board-size",
    document.querySelector<HTMLInputElement>('input[name="board-size"]:checked')
      ?.value || "",
  );
  window.location.href = "game.html";
}

initSettingsRadios();
checkAllSelected();

document
  .getElementById("game-button")
  ?.addEventListener("click", saveSettingsAndStart);
