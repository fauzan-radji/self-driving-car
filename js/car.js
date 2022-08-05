class Car {
  #speed;
  #maxSpeed;
  #acceleration;
  #friction;

  constructor({ position, width, height, canvas }) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.canvas = canvas;

    this.control = new Control();
    this.#maxSpeed = 3;
    this.#acceleration = 0.1;
    this.#friction = 0.05;

    this.speed = 0;
    this.angle = 0;
  }

  update() {
    this.#move();
  }

  #move() {
    const control = this.control;

    if (control.forward) this.speed += this.#acceleration;
    if (control.reverse) this.speed -= this.#acceleration;

    if (this.speed > 0) this.speed -= this.#friction;
    if (this.speed < 0) this.speed += this.#friction;

    if (Math.abs(this.speed) < this.#friction) this.speed = 0;

    if (this.speed !== 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (control.left) this.angle += flip;
      if (control.right) this.angle -= flip;
    }

    const radian = (this.angle * Math.PI) / 180;

    this.position.x -= Math.sin(radian) * this.speed;
    this.position.y -= Math.cos(radian) * this.speed;
  }

  draw() {
    this.canvas
      .clear()
      .save()
      .translate(this.position)
      .rotate(-this.angle)
      .beginPath()
      .rect(
        {
          x: -this.width / 2,
          y: -this.height / 2,
        },
        this.width,
        this.height
      )
      .fill()
      .restore();
  }

  set speed(speed) {
    // Keep speed in range of (-maxspeed / 2) and maxspeed
    speed = Math.max(-this.#maxSpeed / 2, Math.min(this.#maxSpeed, speed));

    this.#speed = speed;
  }

  get speed() {
    return this.#speed;
  }

  get center() {
    return this.position.subtract(new Vector(this.width / 2, this.height / 2));
  }
}
