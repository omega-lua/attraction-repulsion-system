import { updateCanvas, canvasUpdateInterval } from "./canvas.js";
import { createParticles, updateSimulation, simulationUpdateInterval } from "./simulation.js";

let animationID;
let lastSimulationUpdate = 0;
let lastCanvasUpdate = 0;

// Setting up UI element handles
const nSlider = document.getElementById("nSlider");
const nValue = document.getElementById("nValue");

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
  if (animationID) {
    cancelAnimationFrame(animationID);
    animationID = null;
  } else {
    animationID = requestAnimationFrame(loop);
  }
}

// Starts or restarts simulation
function startSimulation() {
  // Stop the current loop if there is one
  if (animationID) {cancelAnimationFrame(animationID)}; 
  
  createParticles();
  loop();
}

// Update the span when the slider moves
// nSlider.addEventListener("input", function () {
//   pauseLoop()
//   let newValue = nValue.textContent = nSlider.value
//   setParticleCount(newValue);
//   startSimulation();
// });

// Add eventlisteners
document.getElementById("resetButton").addEventListener("click", startSimulation);
document.getElementById("pauseButton").addEventListener("click", pauseLoop);

startSimulation()