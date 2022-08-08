class Car {
  #speed;
  #maxSpeed;
  #acceleration;
  #friction;

  constructor(position) {
    this.position = position;

    this.img = new Image();
    // const { src, width } = Car.randomCar;
    const { src, width } = Car.cars[1];
    this.img.src = src;
    this.width = width;
    this.height = 75;

    this.#maxSpeed = 5;
    this.#acceleration = 0.1;
    this.#friction = 0.05;

    this.speed = 0;
    this.angle = 0;
    this.damaged = false;

    this.control = new Control();
    this.sensor = new Sensor(this);
  }

  update(roadBorders) {
    if (!this.damaged) {
      this.#move();
      this.segments = this.#createSegments();
      this.damaged = this.#assesDamage(roadBorders);
    }

    this.sensor.update(roadBorders);
  }

  #assesDamage(roadBorders) {
    for (const roadBorder of roadBorders) {
      for (const segment of this.segments) {
        const touch = segment.getIntersection(roadBorder);

        if (touch) return true;
      }
    }

    return false;
  }

  #createSegments() {
    const points = [];
    const { width, height, position, angleRadian: angle } = this;
    const { x, y } = position;
    const radius = Math.hypot(width, height) / 2;
    const alpha = Math.atan2(width, height);

    const topLeft = new Vector(
      x - Math.sin(angle - alpha) * radius,
      y - Math.cos(angle - alpha) * radius
    );
    const topRight = new Vector(
      x - Math.sin(angle + alpha) * radius,
      y - Math.cos(angle + alpha) * radius
    );
    const bottomRight = new Vector(
      x - Math.sin(Math.PI + angle - alpha) * radius,
      y - Math.cos(Math.PI + angle - alpha) * radius
    );
    const bottomLeft = new Vector(
      x - Math.sin(Math.PI + angle + alpha) * radius,
      y - Math.cos(Math.PI + angle + alpha) * radius
    );

    const top = new Segment(topLeft, topRight);
    const right = new Segment(topRight, bottomRight);
    const bottom = new Segment(bottomRight, bottomLeft);
    const left = new Segment(bottomLeft, topLeft);

    return [top, right, bottom, left];
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

    const radian = this.angleRadian;

    this.position.x -= Math.sin(radian) * this.speed;
    this.position.y -= Math.cos(radian) * this.speed;
  }

  draw(canvas) {
    this.sensor.draw(canvas);

    // if damaged, change image
    if (this.damaged) this.img.src = Car.damaged.src;

    canvas.save().translate(this.position).rotate(-this.angleRadian);
    if (this.img.complete) {
      // draw the car
      canvas.drawImage(
        this.img,
        {
          x: -this.width / 2,
          y: -this.height / 2,
        },
        this.width,
        this.height
      );
    } else {
      // ohterwise, draw a placeholder
      canvas
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

    canvas.restore();
  }

  set speed(speed) {
    // Keep speed in range of (-maxspeed / 4) and maxspeed
    speed = Math.max(-this.#maxSpeed / 4, Math.min(this.#maxSpeed, speed));

    this.#speed = speed;
  }

  get angleRadian() {
    return (this.angle * Math.PI) / 180;
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

  static get damaged() {
    return {
      src: "cars/car-damaged.png",
      width: 36.9,
    };
  }
}
