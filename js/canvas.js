class Canvas {
  #fillStyle;
  #strokeStyle;
  #lineWidth;
  #lineDash;

  constructor({ id, width, height }) {
    this.id = id;
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");
    this.fillStyle = "#fff";
    this.strokeStyle = "#fff";
    this.lineWidth = 1;

    this.resize(width, height);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;

    this.center = new Vector(
      Math.round(this.width / 2),
      Math.round(this.height / 2)
    );

    return this;
  }

  drawImage(image, point, width, height) {
    this.ctx.drawImage(image, point.x, point.y, width, height);

    return this;
  }

  // angle in radian
  rotateAndDrawImage(image, point, width, height, angle) {
    this.save()
      .translate(point)
      .rotate(-angle)
      .drawImage(
        image,
        {
          x: -width / 2,
          y: -height / 2,
        },
        width,
        height
      )
      .restore();

    return this;
  }

  circle(point, radius) {
    this.ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);

    return this;
  }

  rect(point, width, height) {
    this.ctx.rect(point.x, point.y, width, height);

    return this;
  }

  line(point1, point2) {
    this.ctx.moveTo(point1.x, point1.y);
    this.ctx.lineTo(point2.x, point2.y);

    return this;
  }

  moveTo(point) {
    this.ctx.moveTo(point.x, point.y);

    return this;
  }

  lineTo(point) {
    this.ctx.lineTo(point.x, point.y);

    return this;
  }

  beginPath() {
    this.ctx.beginPath();

    return this;
  }

  closePath() {
    this.ctx.closePath();

    return this;
  }

  stroke({
    color = this.#strokeStyle,
    width = this.#lineWidth,
    dash = this.#lineDash,
  } = {}) {
    this.strokeStyle = color;
    this.lineWidth = width;
    this.lineDash = dash;
    this.ctx.stroke();

    return this;
  }

  fill(color = "#fff") {
    this.fillStyle = color;
    this.ctx.fill();

    return this;
  }

  clear() {
    this.canvas.height = this.height;

    return this;
  }

  translate(point) {
    this.ctx.translate(point.x, point.y);

    return this;
  }

  /**
   * Rotate the canvas around the center
   * @param {number} angle angle in radian
   */
  rotate(angle) {
    this.ctx.rotate(angle);

    return this;
  }

  save() {
    this.ctx.save();

    return this;
  }

  restore() {
    this.ctx.restore();

    return this;
  }

  set fillStyle(color) {
    this.#fillStyle = color;
    this.ctx.fillStyle = color;
  }

  set strokeStyle(color) {
    this.#strokeStyle = color;
    this.ctx.strokeStyle = color;
  }

  set lineWidth(width) {
    this.#lineWidth = width;
    this.ctx.lineWidth = width;
  }

  set lineDash(dash) {
    this.#lineDash = dash;
    this.ctx.setLineDash(dash);
  }

  set width(width) {
    this.canvas.width = width;
  }

  set height(height) {
    this.canvas.height = height;
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  get fillStyle() {
    return this.#fillStyle;
  }

  get strokeStyle() {
    return this.#strokeStyle;
  }

  get lineWidth() {
    return this.#lineWidth;
  }

  get lineDash() {
    return this.#lineDash;
  }
}
