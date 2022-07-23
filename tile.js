export class Tile {
  #tileElem;
  #x;
  #y;
  #value;
  constructor(tileElem, value = Math.random() > 0.5 ? 2 : 4) {
    this.#tileElem = tileElem;
    this.value = value;
  }
  get tileElem() {
    return this.#tileElem;
  }
  get x() {
    return this.#x;
  }
  set x(value) {
    this.#x = value;
    this.#tileElem.style.setProperty("--x", this.#x);
  }
  get y() {
    return this.#y;
  }
  set y(value) {
    this.#y = value;
    this.#tileElem.style.setProperty("--y", this.#y);
  }
  get value() {
    return this.#value;
  }
  set value(value) {
    this.#value = value;
    this.#tileElem.innerText = value;
    const power = Math.log2(value);
    const lightness = 100 - power * 9;
    this.#tileElem.style.setProperty("--tile_lightness", `${lightness}%`);
    this.#tileElem.style.setProperty(
      "--text_lightness",
      `${lightness <= 50 ? 90 : 10}%`
    );
  }
  remove() {
    this.#tileElem.remove();
  }
  waitForTransition(tile) {
    return new Promise((resolve) => {
      this.#tileElem.addEventListener(
        "transitionend",
        () => {
          if (tile != null) {
            tile.remove();
            this.value += tile.value;
          }
          resolve();
        },
        { once: true }
      );
    });
  }
  static makeTile() {
    const tileElem = document.createElement("div");
    tileElem.classList.add("tile");
    return new Tile(tileElem);
  }
}
