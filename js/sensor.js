class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 9;
    this.rayLength = 150;
    this.raySpread = 135; // degrees

    this.rays = [];
    this.readings = [];
  }

  update(roadBorders) {
    this.#castRays();
    this.readings = [];
    for (const ray of this.rays) {
      this.readings.push(this.#getReading(ray, roadBorders));
    }
  }

  #getReading(ray, roadBorders) {
    let touches = [];
    for (const border of roadBorders) {
      const touch = ray.getIntersection(border);

      if (touch) touches.push(touch);
    }

    if (touches.length === 0) {
      return null;
    } else {
      const offsets = touches.map((touch) => touch.offset);
      const minOffset = Math.min(...offsets);
      return touches.find((touch) => touch.offset === minOffset);
    }
  }

  #castRays() {
    this.rays = [];

    for (let i = 0; i < this.rayCount; i++) {
      // rayAngle is in degrees
      const rayAngle = lerp(
        this.raySpread / 2,
        -this.raySpread / 2,
        this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
      );

      const radian = (rayAngle * Math.PI) / 180 + this.car.angleRadian;

      const start = this.car.position;
      const { x, y } = this.car.position;
      const end = new Vector(
        x - Math.sin(radian) * this.rayLength,
        y - Math.cos(radian) * this.rayLength
      );

      this.rays.push(new Segment(start, end));
    }
  }

  draw(canvas) {
    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];
      let end = ray.end;
      if (this.readings[i]) end = this.readings[i];

      canvas.beginPath().line(ray.start, end).stroke({
        color: "#ff0",
        width: 2,
      });

      canvas.beginPath().line(ray.end, end).stroke({ color: "#f00" });
    }
  }
}
