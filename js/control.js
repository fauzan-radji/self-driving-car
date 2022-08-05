class Control {
  constructor() {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;

    this.#addKeyboardListeners();
  }

  #addKeyboardListeners() {
    addEventListener("keydown", (e) => {
      if (!["ArrowUp", "ArrowLeft", "ArrowRight", "ArrowDown"].includes(e.key))
        return;

      switch (e.key) {
        case "ArrowUp":
          this.forward = true;
          break;

        case "ArrowLeft":
          this.left = true;
          break;

        case "ArrowRight":
          this.right = true;
          break;

        case "ArrowDown":
          this.reverse = true;
          break;
      }
    });

    addEventListener("keyup", (e) => {
      if (!["ArrowUp", "ArrowLeft", "ArrowRight", "ArrowDown"].includes(e.key))
        return;

      switch (e.key) {
        case "ArrowUp":
          this.forward = false;
          break;

        case "ArrowLeft":
          this.left = false;
          break;

        case "ArrowRight":
          this.right = false;
          break;

        case "ArrowDown":
          this.reverse = false;
          break;
      }
    });
  }
}
