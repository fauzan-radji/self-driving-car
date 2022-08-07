const canvas = new Canvas({
  id: "canvas",
  width: 200,
  height: innerHeight,
});

const road = new Road(canvas.center.x, canvas.width - 20);
const car = new Car(new Vector(road.getLaneCenter(1), canvas.height - 100));

// Rendering
animate();

function animate() {
  car.update(road.borders);

  canvas.clear();

  canvas.save().translate({
    x: 0,
    y: -car.position.y + canvas.height - car.width - 50,
  });
  road.draw(canvas);
  car.draw(canvas);

  canvas.restore();
  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  canvas.resize(canvas.width, innerHeight);
});
