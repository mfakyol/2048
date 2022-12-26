import initGame from "./Game.js";
import "./style.scss";

let score = { value: 0 };

const scoreElement = document.getElementById("score");
const scoreWrapperElement = document.getElementById("score-wrapper");

let timeout;

initGame(score);

scoreElement.textContent = score.value;
scoreElement.classList.add("pop");
timeout = setTimeout(() => {
  scoreElement.classList.remove("pop");
  timeout = null;
}, 100);

window.addEventListener("score", (e) => {
  const { value, type } = e.detail;
  if (type == "add") score.value += value;
  if (type == "set") score.value = value;

  scoreElement.textContent = score.value;
  scoreElement.classList.add("pop");

  const addedScoreSpan = document.createElement("span");
  addedScoreSpan.textContent = `+${value}`;
  scoreWrapperElement.appendChild(addedScoreSpan);
  addedScoreSpan.classList.add("added-score");

  let startX = -20 + Math.random() * 40 + 50;
  let startY = Math.random() * 10 + 50;
  let endX = startX + (Math.random() < 0.5 ? 1 : -1) * (Math.random() * 50);
  let endY = startY + Math.random() * 50 + 50;
  addedScoreSpan.style.setProperty("--start-x", `${startX}%`);
  addedScoreSpan.style.setProperty("--start-y", `${startY}%`);
  addedScoreSpan.style.setProperty("--end-x", `${endX}%`);
  addedScoreSpan.style.setProperty("--end-y", `${endY}%`);

  setTimeout(() => {
    addedScoreSpan.remove();
  }, 500);

  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  timeout = setTimeout(() => {
    scoreElement.classList.remove("pop");
    timeout = null;
  }, 100);
});

window.addEventListener("game-over", (e) => {});
