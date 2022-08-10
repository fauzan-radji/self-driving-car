const carCanvas = new Canvas({
  id: "carCanvas",
  width: 200,
  height: innerHeight,
});
const networkCanvas = new Canvas({
  id: "networkCanvas",
  width: innerWidth - carCanvas.width,
  height: innerHeight,
});

const road = new Road({
  x: carCanvas.center.x,
  width: carCanvas.width - 20,
  canvas: carCanvas,
});
const car = new Car({
  position: new Vector(road.getLaneCenter(1), carCanvas.height - 100),
  controlType: "AI",
  canvas: carCanvas,
});
const traffic = [
  new Car({
    position: new Vector(road.getLaneCenter(1), 0),
    controlType: "DUMMY",
    canvas: carCanvas,
  }),
];

// Rendering
animate();

function animate(time) {
  for (const car of traffic) car.update(road.borders);
  car.update(road.borders, traffic);

  carCanvas
    .clear()
    .save()
    .translate({
      x: 0,
      y: -car.position.y + carCanvas.height - car.width - 50,
    });

  road.draw();
  for (const car of traffic) car.draw();
  car.draw();

  carCanvas.restore();

  networkCanvas.clear();
  networkCanvas.lineDashOffset = time / -40;
  Visualizer.drawNetwork(networkCanvas, car.brain);
  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  carCanvas.resize(carCanvas.width, innerHeight);
  networkCanvas.resize(innerWidth - carCanvas.width, innerHeight);
});
