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

/** Names of all radio groups that must be selected before the game starts. */
const settingsGroups = ["theme", "player", "board-size"];

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
  settingsGroups.forEach((name) => {
    localStorage.setItem(name, getCheckedValue(name));
  });
  window.location.href = "game.html";
}

/** Returns the value of the checked radio in the given group, or "". */
function getCheckedValue(name: string): string {
  return (
    document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)
      ?.value ?? ""
  );
}

/** Enables the hover preview for every theme option. */
function initThemeHover(): void {
  const hoverTheme = document.querySelectorAll<HTMLInputElement>(
    'input[name="theme"]',
  );
  hoverTheme.forEach(addHoverPreview);
}

/** Previews the theme image on hover and restores the checked one on leave. */
function addHoverPreview(radio: HTMLInputElement): void {
  const label = radio.closest("label");
  if (!label) return;

  label.addEventListener("mouseenter", () => {
    updateThemeImage(radio);
  });

  label.addEventListener("mouseleave", () => {
    const checked = getCheckedTheme();
    if (checked) updateThemeImage(checked);
  });
}

/** Returns the currently selected theme input, or null if none is selected. */
function getCheckedTheme(): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>(
    'input[name="theme"]:checked',
  );
}

initSettingsRadios();
initThemeHover();
checkAllSelected();

document
  .getElementById("game-button")
  ?.addEventListener("click", saveSettingsAndStart);
