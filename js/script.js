const canvas = new Canvas({
  id: "canvas",
  width: 200,
  height: innerHeight,
});

const road = new Road(canvas.center.x, canvas.width - 20);
const car = new Car({
  position: new Vector(road.getLaneCenter(1), canvas.height - 100),
  controlType: "KEYS",
});
const traffic = [
  new Car({
    position: new Vector(road.getLaneCenter(1), 0),
    controlType: "DUMMY",
  }),
];

// Rendering
animate();

function animate() {
  for (const car of traffic) car.update(road.borders);
  car.update(road.borders, traffic);

  canvas.clear();

  canvas.save().translate({
    x: 0,
    y: -car.position.y + canvas.height - car.width - 50,
  });
  road.draw(canvas);
  for (const car of traffic) car.draw(canvas);
  car.draw(canvas);

  canvas.restore();
  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  canvas.resize(canvas.width, innerHeight);
});
