class Canvas {
  constructor({ id, width, height }) {
    this.id = id;
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");
    this.fillStyle = "#fff";
    this.strokeStyle = "#fff";
    this.strokeWidth = 1;

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

  stroke(color = "#000") {
    this.strokeStyle = color;
    this.ctx.stroke();

    return this;
  }

  fill(color = "#fff") {
    this.fillStyle = color;
    this.ctx.fill();

    return this;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    return this;
  }

  translate(point) {
    this.ctx.translate(point.x, point.y);

    return this;
  }

  /**
   * Rotate the canvas around the center
   * @param {number} angle angle in degrees
   */
  rotate(angle) {
    // angle from degrees to radians
    angle = (angle * Math.PI) / 180;
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
    this.fillStyle_ = color;
    this.ctx.fillStyle = color;
  }

  set strokeStyle(color) {
    this.strokeStyle_ = color;
    this.ctx.strokeStyle = color;
  }

  set strokeWidth(width) {
    this.strokeWidth_ = width;
    this.ctx.strokeWidth = width;
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
    this.fillStyle_;
  }

  get strokeStyle() {
    this.strokeStyle_;
  }

  get strokeWidth() {
    this.strokeWidth_;
  }
}
