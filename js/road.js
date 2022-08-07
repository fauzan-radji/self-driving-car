class Road {
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinity = 100000;
    this.top = -infinity;
    this.bottom = canvas.height;

    const topLeft = new Vector(this.left, this.top);
    const topRight = new Vector(this.right, this.top);
    const bottomLeft = new Vector(this.left, this.bottom);
    const bottomRight = new Vector(this.right, this.bottom);
    this.borders = [
      new Segment(topLeft, bottomLeft),
      new Segment(topRight, bottomRight),
    ];
  }

  getLaneCenter(laneIndex) {
    const laneWidth = this.width / this.laneCount;
    return (
      this.left +
      laneWidth / 2 +
      laneWidth * Math.min(laneIndex, this.laneCount - 1)
    );
  }

  draw(canvas) {
    canvas.lineWidth = 5;
    canvas.strokeStyle = "#fff";
    canvas.beginPath();
    for (let i = 1; i < this.laneCount; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount);

      canvas.line(
        {
          x,
          y: this.top,
        },
        {
          x,
          y: this.bottom,
        }
      );
    }
    canvas.stroke({ dash: [20, 20] });

    canvas.beginPath();
    for (const border of this.borders) canvas.line(border.start, border.end);
    canvas.stroke({ dash: [] });
  }
}
