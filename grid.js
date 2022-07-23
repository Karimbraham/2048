import { Tile } from "./Tile.js";
const GRID_SIZE = 4;

export class Grid {
  #gridSize = GRID_SIZE;
  #gridElem;
  #emptyCells;
  #cells;
  #score = 0;
  constructor(gridElem) {
    this.#gridElem = gridElem;
    this.makeBoard();
    this.showNewTile();
  }
  get gridElem() {
    return this.#gridElem;
  }
  get gridSize() {
    return this.#gridSize;
  }
  set gridSize(value) {
    document
      .querySelector("#gameboard")
      .style.setProperty("--grid_size", this.#gridSize);
  }
  get score() {
    return this.#score;
  }
  set score(value) {
    let scoreElem = document.querySelector("[data-score]");
    this.#score += value;
    scoreElem.children[0].innerText = this.#score;
    const scorePlus = document.createElement("div");
    scorePlus.dataset.plusScore = value;
    scorePlus.innerText = `+${value}`;
    scoreElem.appendChild(scorePlus);
    setTimeout(() => {
      scorePlus.remove();
    }, 1000);
  }
  get cells() {
    return this.#cells;
  }
  get emptyCells() {
    return this.#cells.filter((cell) => {
      if (cell.tile != null) return false;
      return true;
    });
  }
  get cellsByColumn() {
    return this.#cells.reduce((gridColumn, cell) => {
      gridColumn[cell.x] = gridColumn[cell.x] || [];
      gridColumn[cell.x][cell.y] = cell;
      return gridColumn;
    }, []);
  }
  get cellsByRow() {
    return this.#cells.reduce((gridColumn, cell) => {
      gridColumn[cell.y] = gridColumn[cell.y] || [];
      gridColumn[cell.y][cell.x] = cell;
      return gridColumn;
    }, []);
  }

  makeBoard() {
    this.#cells = [];
    this.gridSize = this.#gridSize;
    for (let i = 0; i < this.#gridSize * this.#gridSize; i++) {
      const cellElem = Cell.makeCell();
      const cell = new Cell(
        cellElem,
        i % this.#gridSize,
        Math.floor(i / this.#gridSize)
      );
      this.#gridElem.append(cellElem);
      this.#cells.push(cell);
    }
  }
  showNewTile(tileNumber = 1) {
    for (let i = 0; i < tileNumber; i++) {
      const index = Math.floor(Math.random() * this.emptyCells.length);
      const chosenCell = this.emptyCells[index];
      const newTile = Tile.makeTile();
      if (chosenCell != null) {
        chosenCell.tile = newTile;
        this.#gridElem.append(chosenCell.tile.tileElem);
      }
      return newTile;
    }
  }
  checkMov(cells) {
    return cells.some((column) => {
      for (let i = 1; i < cells.length; i++) {
        const cell = column[i];
        if (cell.tile == null) continue;
        for (let j = i - 1; j >= 0; j--) {
          const previousCell = column[j];
          if (previousCell.canAcceptTile(cell.tile)) return true;
          break;
        }
      }
      return false;
    });
  }
}

export class Cell {
  #cellElem;
  #x;
  #y;
  #tile = null;
  #mergedTile = null;
  constructor(cellElem, x, y) {
    this.#cellElem = cellElem;
    this.#x = x;
    this.#y = y;
  }
  get x() {
    return this.#x;
  }
  get y() {
    return this.#y;
  }
  get tile() {
    return this.#tile;
  }
  set tile(tile = null) {
    this.#tile = tile;
    if (this.#tile == null) return;
    tile.x = this.#x;
    tile.y = this.#y;
  }
  get mergeTiles() {
    return this.#mergedTile;
  }
  set mergeTiles(value) {
    this.#mergedTile = value;
    if (value == null) return;
    this.#mergedTile.x = this.#x;
    this.#mergedTile.y = this.#y;
  }

  canAcceptTile(tile) {
    return (
      (this.#mergedTile == null && this.#tile?.value == tile.value) ||
      this.#tile == null
    );
  }

  async merge(tile, board) {
    const currentTileElem = this.#tile;
    this.mergeTiles = tile;
    this.tile = tile;
    board.score = tile.value * 2;
    // currentTileElem.remove();
    // this.#tile.value += tile.value;
  }

  static resetMergeTiles(cellsArr) {
    cellsArr.forEach((cell) => {
      cell.mergeTiles = null;
    });
  }

  static makeCell() {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    return cell;
  }
}
