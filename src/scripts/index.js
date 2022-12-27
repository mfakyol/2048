import "../styles/main.scss";
import initScore from "./Score.js";
import { showScorePopup } from "./Popup.js";
import initGame, { newGame } from "./Game.js";

let score = { value: 0 };
const stats = document.getElementById("stats");

initGame(score);
initScore(score);

stats.addEventListener("click", (e) => {
  showScorePopup(newGame);
});

window.addEventListener("game-over", (e) => {
  showScorePopup(newGame);
});
