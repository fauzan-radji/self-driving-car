class Segment {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  getIntersection(other) {
    const tTop =
      (other.end.x - other.start.x) * (this.start.y - other.start.y) -
      (other.end.y - other.start.y) * (this.start.x - other.start.x);
    const uTop =
      (other.start.y - this.start.y) * (this.start.x - this.end.x) -
      (other.start.x - this.start.x) * (this.start.y - this.end.y);
    const bottom =
      (other.end.y - other.start.y) * (this.end.x - this.start.x) -
      (other.end.x - other.start.x) * (this.end.y - this.start.y);

    if (bottom === 0) return null;

    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(this.start.x, this.end.x, t),
        y: lerp(this.start.y, this.end.y, t),
        offset: t,
      };
    }
  }
}
