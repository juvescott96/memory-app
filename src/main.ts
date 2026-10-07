import "./styles/main.scss";

const playButton = document.getElementById("play-button");

playButton?.addEventListener("click", () => {
  window.location.href = "settings.html";
});

const gameButton = document.getElementById("game-button");

gameButton?.addEventListener("click", () => {
  window.location.href = "game.html";
});
