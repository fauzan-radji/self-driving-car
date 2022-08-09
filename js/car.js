class Car {
  #speed;
  #maxSpeed;
  #acceleration;
  #friction;

  constructor({ position, controlType }) {
    this.position = position;

    this.img = new Image();
    if (controlType !== "DUMMY") {
      const playerCar = Car.player;
      this.img.src = playerCar.src;
      this.width = playerCar.width;
      this.height = playerCar.height;

      this.damagedCar = Car.damaged;
      this.damagedCar.img = new Image();
      this.damagedCar.img.src = this.damagedCar.src;
    } else {
      const { src, width, height } = Car.randomCar;
      this.img.src = src;
      this.width = width;
      this.height = height;
    }

    this.#maxSpeed = controlType !== "DUMMY" ? 3 : 2;
    this.#acceleration = 0.1;
    this.#friction = 0.05;

    this.speed = 0;
    this.angle = 0;
    this.damaged = false;

    this.control = new Control(controlType);

    if (controlType !== "DUMMY") this.sensor = new Sensor(this);
  }

  update(roadBorders, traffic = []) {
    if (!this.damaged) {
      this.#move();
      this.segments = this.#createSegments();
      this.damaged = this.#assesDamage(roadBorders, traffic);
    }

    if (this.sensor) this.sensor.update(roadBorders, traffic);
  }

  #assesDamage(roadBorders, traffic) {
    for (const roadBorder of roadBorders) {
      for (const segment of this.segments) {
        const touch = segment.getIntersection(roadBorder);

        if (touch) return true;
      }
    }

    for (const car of traffic) {
      for (const trafficSegment of car.segments) {
        for (const segment of this.segments) {
          const touch = segment.getIntersection(trafficSegment);

          if (touch) return true;
        }
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
    if (this.sensor) this.sensor.draw(canvas);

    // if damaged, change image
    const car = this.damaged ? this.damagedCar : this;

    canvas.save().translate(this.position).rotate(-this.angleRadian);
    if (car.img.complete) {
      // draw the car
      canvas.drawImage(
        car.img,
        {
          x: -car.width / 2,
          y: -car.height / 2,
        },
        car.width,
        car.height
      );
    } else {
      // ohterwise, draw a placeholder
      canvas
        .beginPath()
        .rect(
          {
            x: -car.width / 2,
            y: -car.height / 2,
          },
          car.width,
          car.height
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
        height: 75,
      },
      {
        src: "cars/car-2.png",
        width: 38,
        height: 75,
      },
      {
        src: "cars/car-3.png",
        width: 39,
        height: 75,
      },
    ];
  }

  static get randomCar() {
    const randomIndex = Math.floor(Math.random() * Car.cars.length);

    return Car.cars[randomIndex];
  }

  static get player() {
    return {
      src: "cars/car-player.png",
      width: 36.9,
      height: 75,
    };
  }

  static get damaged() {
    return {
      src: "cars/car-damaged.png",
      width: 36.9,
      height: 75,
    };
  }
}
