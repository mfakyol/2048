import "../styles/popup.scss";

function createPopup(title = "", children) {
  const popupOverlay = document.createElement("div");
  popupOverlay.classList.add("popup-overlay");

  const popupContainer = document.createElement("div");
  popupContainer.classList.add("popup-container");
  popupOverlay.appendChild(popupContainer);

  const popupHeader = document.createElement("div");
  popupHeader.classList.add("popup-header");
  popupContainer.appendChild(popupHeader);

  const popupTitle = document.createElement("h2");
  popupTitle.classList.add("popup-title");
  popupTitle.textContent = title;
  popupHeader.appendChild(popupTitle);

  const popupClose = document.createElement("img");
  popupClose.classList.add("popup-close");
  popupClose.src = "assets/close.svg";
  popupHeader.appendChild(popupClose);
  popupClose.addEventListener("click", (e) => {
    hidePopup();
  });

  const popupBody = document.createElement("div");
  popupBody.classList.add("popup-body");
  popupContainer.appendChild(popupBody);

  children.forEach((child) => {
    popupBody.appendChild(child);
  });

  function showPopup() {
    document.body.appendChild(popupOverlay);
  }

  function hidePopup() {
    popupOverlay.classList.add("closing");
    popupContainer.classList.add("closing");
    if (window.AnimationEvent) popupOverlay.addEventListener("animationend", (e) => popupOverlay.remove());
    else setTimeout(() => popupOverlay.remove(), 300);
  }

  return { showPopup, hidePopup };
}

export function showScorePopup(newGame) {
  const scoreContent = document.createElement("div") || {};
  scoreContent.classList.add("score-content") || {};

  const currentGame = JSON.parse(localStorage.getItem("currentGame"));
  const streak = localStorage.getItem("streak");
  const bestScore = JSON.parse(localStorage.getItem("bestScore"));
  const largestTile = JSON.parse(localStorage.getItem("largestTile"));
  const scoreItems = [
    { title: "Current Score", value: currentGame?.score || 0 },
    { title: "Current Streak", value: currentGame?.streak || 1 },
    { title: "Current Largest Tile", value: currentGame?.largestTile || 0 },
    { title: "High Score", value: bestScore || currentGame?.score || 0 },
    { title: "Max Streak", value: streak || currentGame?.streak || 1 },
    { title: "All Time Largest Tile", value: largestTile || currentGame?.largestTile || 0 },
  ];

  scoreItems.forEach((item) => {
    const scoreItem = document.createElement("div");
    scoreItem.classList.add("score-item");

    const scoreItemTitle = document.createElement("span");
    scoreItemTitle.classList.add("score-item-title");
    scoreItemTitle.textContent = item.title;
    scoreItem.appendChild(scoreItemTitle);

    const scoreItemValue = document.createElement("span");
    scoreItemValue.classList.add("score-item-value");
    scoreItemValue.textContent = item.value;
    scoreItem.appendChild(scoreItemValue);

    scoreContent.appendChild(scoreItem);
  });

  const newGameContent = document.createElement("div");
  newGameContent.classList.add("new-game-content");

  const newGameButton = document.createElement("button");
  newGameButton.classList.add("new-game-button");
  newGameButton.textContent = "New Game";

  newGameContent.appendChild(newGameButton);

  const { showPopup, hidePopup } = createPopup("Score", [scoreContent, newGameContent]);

  newGameButton.addEventListener("click", (e) => {
    hidePopup();
    newGame();
    const event = new CustomEvent("score", { detail: { type: "set", value: 0 } });
    window.dispatchEvent(event);
  });

  showPopup();
}
