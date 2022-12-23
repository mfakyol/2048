import Grid from "./Grid.js";
import Tile from "./Tile.js";
import Cell from "./Cell.js";

const GRID_SIZE = 4;
const CELL_SIZE = 100 / (GRID_SIZE + Math.ceil(GRID_SIZE / 10));
const CELL_GAP = CELL_SIZE / 11;

const board = document.querySelector("#board");

const grid = new Grid(board, Cell, GRID_SIZE, CELL_SIZE, CELL_GAP);

grid.randomEmptyCell().tile = new Tile(board);
grid.randomEmptyCell().tile = new Tile(board);
setupInput();

function setupInput() {
  window.addEventListener("keydown", handleKeyDown, { once: true });
}

function handleKeyDown(e) {
  switch (e.key) {
    case "ArrowUp":
      moveUp();
      break;

    case "ArrowDown":
      moveDown();
      break;

    case "ArrowLeft":
      moveLeft();
      break;

    case "ArrowRight":
      moveRight();
      break;

    default:
      setupInput();
      break;
  }
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
