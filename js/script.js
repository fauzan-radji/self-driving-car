const canvas = new Canvas({
  id: "canvas",
  width: 200,
  height: innerHeight,
});

const car = new Car({
  position: new Vector(100, 100),
  width: 30,
  height: 50,
  canvas,
});

car.draw();

// Rendering
animate();

function animate() {
  car.update();
  car.draw();

  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  canvas.resize(200, innerHeight);
});
