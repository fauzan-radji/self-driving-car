class Car {
  #speed;
  #maxSpeed;
  #acceleration;
  #friction;

  constructor({ position, canvas }) {
    this.position = position;
    this.canvas = canvas;

    this.img = new Image();
    const { src, width } = Car.randomCar;
    this.img.src = src;
    this.width = width;
    this.height = 75;

    this.control = new Control();
    this.#maxSpeed = 10;
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
    this.canvas.save().translate(this.position).rotate(-this.angle);

    if (this.img.complete) {
      this.canvas.drawImage(
        this.img,
        {
          x: -this.width / 2,
          y: -this.height / 2,
        },
        this.width,
        this.height
      );
    } else {
      this.canvas
        .beginPath()
        .rect(
          {
            x: -this.width / 2,
            y: -this.height / 2,
          },
          this.width,
          this.height
        )
        .fill();
    }

    this.canvas.restore();
  }

  set speed(speed) {
    // Keep speed in range of (-maxspeed / 4) and maxspeed
    speed = Math.max(-this.#maxSpeed / 4, Math.min(this.#maxSpeed, speed));

    this.#speed = speed;
  }

  get speed() {
    return this.#speed;
  }

  get center() {
    return this.position.subtract(new Vector(this.width / 2, this.height / 2));
  }

  static get cars() {
    return [
      {
        src: "cars/car-1.png",
        width: 36.9,
      },
      {
        src: "cars/car-2.png",
        width: 36.9,
      },
      {
        src: "cars/car-3.png",
        width: 39,
      },
      {
        src: "cars/car-4.png",
        width: 38,
      },
    ];
  }

  static get randomCar() {
    const randomIndex = Math.floor(Math.random() * Car.cars.length);

    return Car.cars[randomIndex];
  }
}
