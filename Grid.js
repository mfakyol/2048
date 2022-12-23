export default class Grid {
  #cells;
  constructor(gridElement, CellClass, gridSize, cellSize, cellGap) {
    gridElement.style.setProperty("--grid-size", gridSize);
    gridElement.style.setProperty("--cell-size", `${cellSize}vmin`);
    gridElement.style.setProperty("--cell-gap", `${cellGap}vmin`);
    gridElement.classList.add("grid");
    this.#cells = createCells(gridElement, CellClass, gridSize);
  }

  get #emptyCells() {
    return this.#cells.filter((cell) => !cell.tile);
  }

  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
    return this.#emptyCells[randomIndex];
  }

  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, []);
  }

  get cellsByRow() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;
      return cellGrid;
    }, []);
  }
}

function createCells(gridElement, CellClass, gridSize) {
  const cells = [];
  for (let i = 0; i < Math.pow(gridSize, 2); i++) {
    const cell = new CellClass(i % gridSize, Math.floor(i / gridSize));
    cells.push(cell);
    gridElement.append(cell.cellElement);
  }
  return cells;
}
