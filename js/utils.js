function lerp(A, B, t) {
  return A + (B - A) * t;
}

function getColor(value) {
  const alpha = Math.abs(value);
  const R = value < 0 ? 0 : 255;
  const G = 255;
  const B = value > 0 ? 0 : 255;
  return `rgb(${R},${G},${B},${alpha})`;
}
