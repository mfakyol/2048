import Grid from "./Grid.js";
import Tile from "./Tile.js";

export default function initGame(score) {
  const GRID_SIZE = 4;
  const CELL_SIZE = 100 / (GRID_SIZE + Math.ceil(GRID_SIZE / 10));
  const CELL_GAP = CELL_SIZE / 11;

  const board = document.querySelector("#board");

  const grid = new Grid(board, GRID_SIZE, CELL_SIZE, CELL_GAP);
  let currentGame = JSON.parse(localStorage.getItem("currentGame"));
  const today = new Date();
  const date = new Date(currentGame?.startDate);

  const isSameDay =
    today.getFullYear() == date.getFullYear() &&
    today.getMonth() == date.getMonth() &&
    today.getDate() == date.getDate();

  if (currentGame && isSameDay) {
    currentGame.tiles.forEach((tile) => {
      grid.cellsByColumn[tile.x][tile.y].tile = new Tile(board, tile.value);
    });
    score.value = currentGame.score
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

    localStorage.setItem("currentGame", JSON.stringify(newGame));
  }

  setupInput();

  function setupInput() {
    window.addEventListener("keydown", handleInput, { once: true });
  }
  async function handleInput(e) {
    switch (e.key) {
      case "ArrowUp":
        if (!canMoveUp()) {
          setupInput();
          return;
        }
        await moveUp();
        break;
      case "ArrowDown":
        if (!canMoveDown()) {
          setupInput();
          return;
        }
        await moveDown();
        break;
      case "ArrowLeft":
        if (!canMoveLeft()) {
          setupInput();
          return;
        }
        await moveLeft();
        break;
      case "ArrowRight":
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

    const currentGame = JSON.parse(localStorage.getItem("currentGame")) || {};
    currentGame.tiles = grid.cells
      .filter((cell) => cell.tile)
      .map((cell) => {
        return {
          x: cell.x,
          y: cell.y,
          value: cell.tile.value,
        };
      });

    if (!currentGame.startDate) currentGame.startDate = Date.now();
    currentGame.score = score.value;

    localStorage.setItem("currentGame", JSON.stringify(currentGame));

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
      newTile.waitForTransition(true).then(() => {
        const date = Date.now();
        const score = score;
      });
      const event = CustomEvent("game-over");
      window.dispatchEvent(event);
      return;
    }

    setupInput();
  }

  function moveUp() {
    slideTiles(grid.cellsByColumn);
  }

  function moveDown() {
    slideTiles(
      grid.cellsByColumn.map((column) => {
        return [...column].reverse();
      })
    );
  }
  function moveLeft() {
    slideTiles(grid.cellsByRow);
  }

  function moveRight() {
    slideTiles(
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

  window.addEventListener("score", (e) => console.log(e));
}
