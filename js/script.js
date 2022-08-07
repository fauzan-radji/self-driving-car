const canvas = new Canvas({
  id: "canvas",
  width: 200,
  height: innerHeight,
});

const road = new Road(canvas.center.x, canvas.width - 20);
const car = new Car({
  position: new Vector(road.getLaneCenter(1), 100),
  canvas,
});

// Rendering
animate();

function animate() {
  car.update();

  canvas.clear();

  canvas.save().translate({
    x: 0,
    y: -car.position.y + canvas.height - car.width - 50,
  });
  road.draw();
  car.draw();

  canvas.restore();
  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  canvas.resize(canvas.width, innerHeight);
});
