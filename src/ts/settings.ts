const settingsTargets: Record<string, string> = {
  theme: "game-theme",
  player: "player",
  "board-size": "board-size",
};

function updateChosenSetting(input: HTMLInputElement): void {
  const targetId = settingsTargets[input.name];
  if (!targetId) return;

  const target = document.getElementById(targetId);
  if (target) {
    target.textContent = input.value;
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
