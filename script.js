import { Grid, Cell } from "./grid.js";
const board = new Grid(document.querySelector("#gameboard"));
setupInput();

function checkLose(tile) {
  return new Promise((resolve) => {
    if (tile != null) {
      tile.tileElem.addEventListener(
        "animationend",
        () => {
          if (
            !(canMoveDown() || canMoveUp() || canMoveRight() || canMoveLeft())
          )
            alert("you lost");
          resolve();
        },
        { once: true }
      );
    }
  });
}
function setupInput() {
  document.addEventListener("keydown", makeMove, { once: true });
}
async function makeMove(e, swipe = null) {
  let switchArg = swipe ?? e.code;
  switch (switchArg) {
    case "ArrowDown":
      canMoveDown() && (await moveDown());
      break;
    case "ArrowUp":
      canMoveUp() && (await moveUp());
      break;
    case "ArrowRight":
      canMoveRight() && (await moveRight());
      break;
    case "ArrowLeft":
      canMoveLeft() && (await moveLeft());
      break;
    default:
      setupInput();
  }
  setupInput();
}

function canMoveUp() {
  return board.checkMov(board.cellsByColumn);
}
function canMoveDown() {
  return board.checkMov(
    board.cellsByColumn.map((column) => [...column].reverse())
  );
}
function canMoveLeft() {
  return board.checkMov(board.cellsByRow);
}
function canMoveRight() {
  return board.checkMov(board.cellsByRow.map((row) => [...row].reverse()));
}

async function moveUp() {
  await slideTides(board.cellsByColumn);
  const tile = board.showNewTile();
  return checkLose(tile);
}

async function moveDown() {
  await slideTides(board.cellsByColumn.map((column) => [...column].reverse()));
  const tile = board.showNewTile();
  return checkLose(tile);
}

async function moveLeft() {
  await slideTides(board.cellsByRow);
  const tile = board.showNewTile();
  return checkLose(tile);
}

async function moveRight() {
  await slideTides(board.cellsByRow.map((row) => [...row].reverse()));
  const tile = board.showNewTile();
  return checkLose(tile);
}

async function slideTides(boardCells) {
  return Promise.all(
    boardCells.flatMap((column) => {
      const promises = [];
      for (let i = 1; i < column.length; i++) {
        const cell = column[i];
        if (cell.tile == null) continue;
        let targetCell;
        for (let j = i - 1; j >= 0; j--) {
          const previousCell = column[j];
          if (!previousCell.canAcceptTile(cell.tile)) break;
          targetCell = previousCell;
        }
        if (targetCell != null) {
          promises.push(cell.tile.waitForTransition(targetCell.tile));
          if (targetCell.tile == null) {
            targetCell.tile = cell.tile;
          } else {
            targetCell.merge(cell.tile, board);
          }
          cell.tile = null;
        }
      }
      Cell.resetMergeTiles(column);
      return promises;
    })
  );
}

//mobile swiping
board.gridElem.addEventListener("touchstart", handleTouchStart, false);
board.gridElem.addEventListener("touchmove", handleTouchMove, false);

let xDown = null;
let yDown = null;

function getTouches(evt) {
  return (
    evt.touches || // browser API
    evt.originalEvent.touches
  ); // jQuery
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  let xUp = evt.touches[0].clientX;
  let yUp = evt.touches[0].clientY;

  let xDiff = xDown - xUp;
  let yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
      makeMove(evt, "ArrowLeft");
    } else {
      makeMove(evt, "ArrowRight");
    }
  } else {
    if (yDiff > 0) {
      makeMove(evt, "ArrowUp");
    } else {
      makeMove(evt, "ArrowDown");
    }
  }
  xDown = null;
  yDown = null;
}
