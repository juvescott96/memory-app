import "./styles/main.scss";

/** Sends the user to the settings page when the play button is clicked. */
function initPlayButton(): void {
  const playButton = document.getElementById("play-button");

  playButton?.addEventListener("click", () => {
    window.location.href = "settings.html";
  });
}

document.addEventListener("DOMContentLoaded", initPlayButton);
