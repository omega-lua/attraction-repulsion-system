import { n, setParticleCount} from "./config.js";
import { Particles  } from "./simulation.js";

// canvas settings
let canvasFrequency = 30;
let showForceVectors = false;
let canvasUpdateInterval = 1000 / canvasFrequency;
const typeColours = ["#A04747", "#D8A25E", "#EEDF7A", "indigo", "lime", "magenta", "maroon", "navy", "orange", "pink", "purple", "silver", "white", "yellow"]

// canvas configuration
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const controls = document.getElementById("controls");
canvas.style.backgroundColor = "#343131";
canvas.width = window.innerWidth; //DEBUG: Are these necessary?
canvas.height = window.innerHeight;

// Setting up UI element handles
const nSlider = document.getElementById("nSlider");
const nValue = document.getElementById("nValue");

// Set canvas size dynamically
function resizeCanvas() {
  canvas.width = window.innerWidth - controls.offsetWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Call on load

// Update the span when the slider moves
nSlider.addEventListener("input", function () {
  pauseLoop()
  n = nValue.textContent = nSlider.value;
  location.reload()
});

// Function for drawing a particle.
function drawParticle(particle) {
  let particleSize = 15;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2);
  ctx.fillStyle = typeColours[particle.type];
  ctx.fill();
}

// Debug function for visualizing force vectors
function drawForceVectors(Particles) {
  Particles.forEach((particle) => {
    let x = particle.x;
    let y = particle.y;

    // Draw the force vector as a line
    let multiplier = 80;
    ctx.beginPath();
    ctx.moveTo(x, y);  // Start the line from the particle's position
    ctx.lineTo(x + particle.vx * multiplier, y + particle.vy * multiplier);  // End the line at the force vector's end
    ctx.strokeStyle = 'red';  // Color of the force vector line
    ctx.lineWidth = 2;  // Line thickness
    ctx.stroke();
  });
}

// Updates canvas
function updateCanvas() {
  //clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //draw particles
  for (let i = 0; i < n; i++) { drawParticle(Particles[i]) }
  
  //DEBUG: draw force vectors
  if (showForceVectors) { drawForceVectors(Particles) }
}

function toggleForceVectors() {
  showForceVectors = !showForceVectors;
}

export { updateCanvas, canvasUpdateInterval  };