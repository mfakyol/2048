import { dispatchEvent } from "./Event.js";
import Grid from "./Grid.js";
import Tile from "./Tile.js";

let grid;
let board;
let score;

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });

  board.addEventListener(
    "touchstart",
    (e) => {
      board.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });

      const startX = e.changedTouches[0].pageX;
      const startY = e.changedTouches[0].pageY;
      board.addEventListener(
        "touchend",
        (e) => {
          board.removeEventListener("touchmove", handleTouchMove, {
            passive: false,
          });

          const endX = e.changedTouches[0].pageX;
          const endY = e.changedTouches[0].pageY;

          const diffX = endX - startX;
          const diffY = endY - startY;
          const absDiffX = Math.abs(diffX);
          const absDiffY = Math.abs(diffY);

          let key = "";

          if (absDiffX > 50 || absDiffY > 50) {
            if (absDiffX > absDiffY) {
              if (diffX > 0) key = "d";
              else key = "a";
            } else {
              if (diffY > 0) key = "s";
              else key = "w";
            }
          }

          window.dispatchEvent(new KeyboardEvent("keydown", { key: key }));
        },
        { once: true }
      );
    },
    { once: true }
  );
}

async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
    case "w":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
    case "s":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
    case "a":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
    case "d":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    default:
      setupInput();
      return;
  }

  grid.cells.forEach((cell) => cell.mergeTiles());

  const newTile = new Tile(board);
  grid.randomEmptyCell().tile = newTile;

  let tempLargestTile = 0;
  const currentGame = JSON.parse(localStorage.getItem("currentGame")) || {};
  currentGame.tiles = grid.cells
    .filter((cell) => cell.tile)
    .map((cell) => {
      if (cell.tile.value > tempLargestTile) tempLargestTile = cell.tile.value;
      return {
        x: cell.x,
        y: cell.y,
        value: cell.tile.value,
      };
    });

  if (!currentGame.startDate) currentGame.startDate = Date.now();
  const bestScore = localStorage.getItem("bestScore") || 0;
  if (score.value > bestScore) localStorage.setItem("bestScore", score.value);
  currentGame.score = score.value;
  currentGame.largestTile = tempLargestTile;
  const largestTile = localStorage.getItem("largestTile") || 0;
  if (tempLargestTile > largestTile) localStorage.setItem("largestTile", tempLargestTile);

  localStorage.setItem("currentGame", JSON.stringify(currentGame));

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      dispatchEvent("game-over");
    });

    return;
  }

  setupInput();
}

function handleTouchMove(e) {
  e.preventDefault();
}

function moveUp() {
  return slideTiles(grid.cellsByColumn);
}

function moveDown() {
  return slideTiles(
    grid.cellsByColumn.map((column) => {
      return [...column].reverse();
    })
  );
}
function moveLeft() {
  return slideTiles(grid.cellsByRow);
}

function moveRight() {
  return slideTiles(
    grid.cellsByRow.map((row) => {
      return [...row].reverse();
    })
  );
}

function slideTiles(cells) {
  return Promise.all(
    cells.flatMap((group) => {
      const promises = [];
      for (let i = 1; i < group.length; i++) {
        const cell = group[i];
        if (cell.tile == null) continue;
        let lastValidCell;
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j];
          if (!moveToCell.canAccept(cell.tile)) break;
          lastValidCell = moveToCell;
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition());
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile;
          } else {
            lastValidCell.tile = cell.tile;
          }
          cell.tile = null;
        }
      }
      return promises;
    })
  );
}

function canMoveUp() {
  return canMove(grid.cellsByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function canMoveLeft() {
  return canMove(grid.cellsByRow);
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
}

function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index === 0) return false;
      if (cell.tile == null) return false;
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
}

export default function initGame(scoreRef) {
  score = scoreRef;

  const GRID_SIZE = 4;
  const CELL_SIZE = 100 / (GRID_SIZE + Math.ceil(GRID_SIZE / 4));
  const CELL_GAP = CELL_SIZE / 11;

  board = document.querySelector("#board");

  grid = new Grid(board, GRID_SIZE, CELL_SIZE, CELL_GAP);
  let currentGame = JSON.parse(localStorage.getItem("currentGame"));

  if (currentGame) {
    currentGame?.tiles?.forEach((tile) => {
      grid.cellsByColumn[tile.x][tile.y].tile = new Tile(board, tile.value);
    });
    score.value = currentGame.score;
  } else {
    const cell1 = grid.randomEmptyCell();
    cell1.tile = new Tile(board);
    const cell2 = grid.randomEmptyCell();
    cell2.tile = new Tile(board);

    const newGame = {};
    newGame.tiles = [];
    newGame.startDate = Date.now();
    newGame.tiles.push({ x: cell1.x, y: cell1.y, value: cell1.tile.value });
    newGame.tiles.push({ x: cell2.x, y: cell2.y, value: cell2.tile.value });
    newGame.score = 0;
    newGame.streak = localStorage.getItem("streak") || 1;

    localStorage.setItem("currentGame", JSON.stringify(newGame));
  }

  setupInput();
}

export function newGame() {
  if (grid) {
    grid.cells.forEach((cell) => {
      if (cell.tile) {
        cell.tile.remove();
        cell.tile = null;
      }
    });

    const cell1 = grid.randomEmptyCell();
    cell1.tile = new Tile(board);
    const cell2 = grid.randomEmptyCell();
    cell2.tile = new Tile(board);

    const newGame = {};
    newGame.tiles = [];
    newGame.startDate = Date.now();
    newGame.tiles.push({ x: cell1.x, y: cell1.y, value: cell1.tile.value });
    newGame.tiles.push({ x: cell2.x, y: cell2.y, value: cell2.tile.value });
    newGame.score = 0;

    const streak = localStorage.getItem("streak");
    const newStreak = (Number(streak) || 1) + 1;

    newGame.streak = newStreak;
    localStorage.setItem("streak", newStreak);

    localStorage.setItem("currentGame", JSON.stringify(newGame));
    setupInput();
  }
}
