const buttonsContainerHeight = 50;
document.body.style.setProperty(
  "--buttons-container-height",
  `${buttonsContainerHeight}px`
);
let requestFrameId = 0;

const carCanvas = new Canvas({
  id: "carCanvas",
  width: 200,
  height: innerHeight - buttonsContainerHeight,
});
const networkCanvas = new Canvas({
  id: "networkCanvas",
  width: innerWidth - carCanvas.width,
  height: innerHeight - buttonsContainerHeight,
});

const road = new Road({
  x: carCanvas.center.x,
  width: carCanvas.width - 20,
  canvas: carCanvas,
});
const cars = generateCars(1000);
// const cars = generateCars(1);
const mutation = 0.1;
let bestCar = cars[0];
if (localStorage.bestBrain) {
  cars[0].brain = NeuralNetwork.load();

  for (let i = 1; i < cars.length; i++) {
    cars[i].brain = NeuralNetwork.load();
    NeuralNetwork.mutate(cars[i].brain, mutation);
  }
}

const useAI = false;
const traffic = generateTraffic(11, 100, useAI);
if (useAI)
  for (let i = 0; i < traffic.length; i++)
    traffic[i].brain = NeuralNetwork.load();

// Rendering
animate();

function animate(time) {
  for (const car of traffic) car.update(road.borders);
  for (let i = 0; i < cars.length; i++) {
    if (cars[i].damaged && cars[i] !== bestCar) {
      cars.splice(i, 1);
      continue;
    }
    cars[i].update(road.borders, traffic);
  }
  const minY = Math.min(...cars.map((car) => car.position.y));
  bestCar = cars.find((car) => car.position.y === minY);

  carCanvas
    .clear()
    .save()
    .translate({
      x: 0,
      y: -bestCar.position.y + carCanvas.height * 0.8,
    });

  road.draw();
  for (const car of traffic) car.draw();

  carCanvas.globalAlpha = 0.05;
  for (const car of cars) car.draw();

  carCanvas.globalAlpha = 1;
  bestCar.draw({ drawSensor: true });

  carCanvas.restore();

  networkCanvas.clear();
  networkCanvas.lineDashOffset = time / -40;
  Visualizer.drawNetwork(networkCanvas, bestCar.brain);
  requestFrameId = requestAnimationFrame(animate);
}

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function play() {
  animate();
}

function pause() {
  cancelAnimationFrame(requestFrameId);
}

function generateCars(n) {
  const cars = [];
  for (let i = 0; i < n; i++) {
    cars.push(
      new Car({
        position: new Vector(road.getLaneCenter(1), carCanvas.height - 100),
        controlType: "AI",
        canvas: carCanvas,
      })
    );
  }
  return cars;
}

function generateTraffic(rowCount, start, useAI = false) {
  const traffic = [];
  const maxCarsInARow = road.laneCount - 1;
  let row = start;
  // for every row
  for (let i = 0; i < rowCount; i++) {
    const usedLane = [];
    const carsInThisRow = Math.floor(Math.random() * maxCarsInARow) + 1;
    for (let j = 0; j < carsInThisRow; j++) {
      let lane = Math.floor(Math.random() * road.laneCount);
      while (usedLane.includes(lane))
        lane = Math.floor(Math.random() * road.laneCount);
      usedLane.push(lane);
      traffic.push(
        new Car({
          position: new Vector(road.getLaneCenter(lane), row),
          controlType: useAI ? "AI" : "DUMMY",
          canvas: carCanvas,
        })
      );
    }

    row -= Math.random() * 250 + 250;
  }
  return traffic;
}

window.addEventListener("resize", () => {
  carCanvas.resize(carCanvas.width, innerHeight - buttonsContainerHeight);
  networkCanvas.resize(
    innerWidth - carCanvas.width,
    innerHeight - buttonsContainerHeight
  );
});
