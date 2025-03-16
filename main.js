import { n, setParticleCount} from "./config.js";
import { updateCanvas, canvasUpdateInterval } from "./canvas.js";
import { createParticles, updateSimulation, simulationUpdateInterval } from "./simulation.js";

let animationID;
let lastSimulationUpdate = 0;
let lastCanvasUpdate = 0;

// Main loop
function loop(timestamp) {
    // updates simulation
    if (timestamp - lastSimulationUpdate >= simulationUpdateInterval) {
      updateSimulation();
      lastSimulationUpdate = timestamp;
    }

    // updates canvas
    if (timestamp - lastCanvasUpdate >= canvasUpdateInterval) {
      updateCanvas();
      lastCanvasUpdate = timestamp;
    }

    // tell browser to call function at every frame
    animationID = requestAnimationFrame(loop);
}

// pause and unpause loop
function pauseLoop() {
  if (!animationID) {
    animationID = requestAnimationFrame(loop);
  } else {
    cancelAnimationFrame(animationID);
    animationID = null;
  }
}

// Stop loop
function stopLoop() {
  cancelAnimationFrame(animationID);
  animationID = null;
}

// Run the program
function runSimulation() {
  createParticles();
  loop();
}

runSimulation()