class Visualizer {
  static drawNetwork(canvas, network) {
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = canvas.width - margin * 2;
    const height = canvas.height - margin * 2;

    const levelsLength = network.levels.length;
    const levelHeight = height / levelsLength;

    for (let i = levelsLength - 1; i >= 0; i--) {
      const levelTop =
        top +
        lerp(
          height - levelHeight,
          0,
          levelsLength === 1 ? 0.5 : i / (levelsLength - 1)
        );

      Visualizer.drawLevel({
        canvas,
        level: network.levels[i],
        left,
        top: levelTop,
        width,
        height: levelHeight,
        labels: i === levelsLength - 1 ? ["⬆", "⬅", "➡", "⬇"] : [],
      });
    }
  }

  static drawLevel({ canvas, level, left, top, width, height, labels }) {
    const right = left + width;
    const bottom = top + height;

    const nodeRadius = 20;
    const { inputs, outputs, weights, biases } = level;

    const inputCount = inputs.length;
    const outputCount = outputs.length;

    // drawing connections
    for (let i = 0; i < inputCount; i++) {
      for (let j = 0; j < outputCount; j++) {
        canvas
          .beginPath()
          .line(
            {
              x: Visualizer.#getNodeX(inputCount, i, left, right),
              y: bottom,
            },
            {
              x: Visualizer.#getNodeX(outputCount, j, left, right),
              y: top,
            }
          )
          .stroke({
            color: getColor(weights[i][j]),
            width: 1,
            dash: [7, 3],
          })
          .closePath();
      }
    }

    // drawing input nodes
    for (let i = 0; i < inputCount; i++) {
      const x = Visualizer.#getNodeX(inputCount, i, left, right);
      canvas
        .beginPath()
        .circle(
          {
            x,
            y: bottom,
          },
          nodeRadius
        )
        .fill("#222")
        .closePath();

      canvas
        .beginPath()
        .circle(
          {
            x,
            y: bottom,
          },
          nodeRadius * 0.5
        )
        .fill(getColor(inputs[i]))
        .closePath();
    }

    // drawing output nodes
    for (let i = 0; i < outputCount; i++) {
      const x = Visualizer.#getNodeX(outputCount, i, left, right);
      canvas
        .beginPath()
        .circle(
          {
            x,
            y: top,
          },
          nodeRadius
        )
        .fill("#222")
        .closePath();

      canvas
        .beginPath()
        .circle(
          {
            x,
            y: top,
          },
          nodeRadius * 0.5
        )
        .fill(getColor(outputs[i]))
        .closePath();

      canvas
        .beginPath()
        .circle(
          {
            x,
            y: top,
          },
          nodeRadius * 0.8
        )
        .stroke({
          color: getColor(biases[i]),
          width: 2,
          dash: [3, 3],
        })
        .closePath();

      if (labels[i]) {
        canvas.lineWidth = 0.3;
        canvas.lineDash = [];
        canvas.text({
          text: labels[i],
          at: {
            x,
            y: top + nodeRadius * 0.4,
          },
          size: nodeRadius * 1.2,
          fillStyle: "#222",
          strokeStyle: "#ff0",
        });
      }
    }
  }

  static #getNodeX(nodesLength, index, left, right) {
    return lerp(
      left,
      right,
      nodesLength === 1 ? 0.5 : index / (nodesLength - 1)
    );
  }
}
