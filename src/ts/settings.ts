const settingsTargets: Record<string, string> = {
  theme: "game-theme",
  player: "player",
  "board-size": "board-size",
};

const themeImages: Record<string, string> = {
  "Code vibes theme":
    "./public/assets/code-vibes-theme-card/code-vibes-theme.png",
  "Gaming theme": "./public/assets/games-theme-cards/game-theme.png",
};

function updateThemeImage(input: HTMLInputElement): void {
  const image = document.getElementById("theme-visual") as HTMLImageElement | null;
  const src = themeImages[input.value];
  if (image && src) {
    image.src = src;
  }
}

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

const settingsGroups = ["theme", "player", "board-size"];

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

checkAllSelected();
