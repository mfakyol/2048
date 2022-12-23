export default class Cell {
  #cellElement;
  #x;
  #y;
  #tile;
  #mergeTile;

  constructor(x, y) {
    this.#cellElement = document.createElement("div");
    this.#cellElement.classList.add("cell");
    this.#x = x;
    this.#y = y;
  }

  get cellElement() {
    return this.#cellElement;
  }

  get tile() {
    return this.#tile;
  }

  set tile(value) {
    this.#tile = value;
    if (value == null) return;
    this.#tile.x = this.#x;
    this.#tile.y = this.#y;
    this;
  }

  get x() {
    return this.#x;
  }
  
  get y() {
    return this.#y;
  }

  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(value) {
    this.#mergeTile = value;
    if (value == null) return;
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }

  canAccept(tile) {
    return this.tile == null || (this.mergeTile == null && this.tile.value == tile.value);
  }
}
