class Car {
  constructor({ position, width, height, canvas }) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.canvas = canvas;
    this.center = this.position.subtract(
      new Vector(this.width / 2, this.height / 2)
    );
  }

  draw() {
    this.canvas.beginPath().rect(this.center, this.width, this.height).fill();
  }
}
