import "./styles/main.scss";

const playButton = document.getElementById("play-button");

playButton?.addEventListener("click", () => {
  window.location.href = "settings.html";
});

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

const settingsRadios = document.querySelectorAll<HTMLInputElement>(
  'aside.left-side input[type="radio"]'
);

settingsRadios.forEach((radio) => {
  if (radio.checked) {
    updateChosenSetting(radio);
  }

  radio.addEventListener("change", () => {
    updateChosenSetting(radio);
  });
});
