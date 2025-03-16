// Variables for particles
let n = 20;
let Particles = [];

// Variables for types
let nTypes = 3;
let Types = [];

// Simulation settings
let simulationSpeed = 1 //should stay on value 1
let simulationFrequency = 30;
let simulationUpdateInterval = 1000 / simulationFrequency;
let lastSimulationUpdate = 0;
let animationID;

// Visual canvas settings
let canvasFrequency = 30;
let canvasUpdateInterval = 1000 / canvasFrequency;
let lastCanvasUpdate = 0;
let showForceVectors = false;
let typeColours = ["#A04747", "#D8A25E", "#EEDF7A", "indigo", "lime", "magenta", "maroon", "navy", "orange", "pink", "purple", "silver", "white", "yellow"]

// Setting up canvas
const canvas = document.getElementById('canvas');
canvas.style.backgroundColor = "#343131";
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ------------------------------------------------- //

// Initial function for creating particles in an array.
function createParticles() {
  for (let i = 0; i < n; i++) {
    
    // Create a particle with random values
    let particle = {
      x: canvas.width*0.1 + Math.random() * canvas.width*0.8,
      y: canvas.height*0.1 + Math.random() * canvas.height*0.8,
      vx: 0, 
      vy: 0,
      type: Math.floor(Math.random()*nTypes), // particle type
    };
    
    Particles.push(particle);
  }

  // Create particle types
  for (let i = 0; i < nTypes; i++) {
    let array = []
    for (let j = 0; j < nTypes; j++) {
      let relation = Math.floor(Math.random()*3)-1
      array.push(relation)
    }
    Types.push(array)
  }

  return Particles;
}

function updateSimulation() {
  
  // create forceVectors array
  let [fx, fy] = [0,0]
  let forceVectors = [];
  for (let i = 0; i < n; i++) { forceVectors.push([0,0]) };

  // Calculate distance and force vector for each particle
  for (let i = 0; i < n-1; i++) {
    for (let j = i+1; j < n; j++) {

      // Calculate distance
      let dx = Particles[j].x - Particles[i].x;
      let dy = Particles[j].y - Particles[i].y;
      let d = Math.sqrt(dx**2 + dy**2);
 
      // only near particles influence each other
      if (d > 300) { continue }

      // Equillibiurm logic
      let m = 0.3 // multiplier
      if (d < 100) { m *= -0.3 } //50 is a good value

      // Calculate force vectors
      let f = 1/(d+1e-8)*m;  // Add a small value to prevent division by zero
      f = Math.min(f, 0.005);

      // Add force vectors
      fx = (dx/d)*f
      fy = (dy/d)*f

      // Attraction and repulsion logic
      let iType = Particles[i].type
      let jType = Particles[j].type
      let iModifier = Types[iType][jType]
      let jModifier = Types[jType][iType]

      forceVectors[i][0] += fx * iModifier
      forceVectors[i][1] += fy * iModifier

      forceVectors[j][0] -= fx * jModifier
      forceVectors[j][1] -= fy * jModifier
    };
  };

  // Update particles
  let t = simulationUpdateInterval * simulationSpeed
  tSquared = t**2
  Particles.forEach((p, i) => {
    // Update particle coordinates (using fomrula x(t)= 0.5*a*t^2 + v0*t + x0)
    p.x += 0.5 * (forceVectors[i][0] * tSquared) + p.vx * t;
    p.y += 0.5 * (forceVectors[i][1] * tSquared) + p.vy * t;

    // Update velocities
    p.vx += forceVectors[i][0] * t;
    p.vy += forceVectors[i][1] * t;

    // Introduce friction (1 means no friction, <1 means friction)
    const friction = 0.20 // low value prevents oscillating in stable arrangments.
    p.vx *= friction
    p.vy *= friction

    // Constrain particles to within visible canvas
    if (p.x < 0 || p.x > canvas.width) {
      p.x = p.x < 0 ? 0 : canvas.width;
      p.vx *= -0.2;
    }
    if (p.y < 0 || p.y > canvas.height) {
      p.y = p.y < 0 ? 0 : canvas.height;
      p.vy *= -0.2;
    }
  });
}

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

// Start loop
function startLoop() {
  if (!animationID) { animationID = requestAnimationFrame(loop) }
}

// Stop loop
function stopLoop() {
  cancelAnimationFrame(animationID);
  animationID = null;
}

function toggleForceVectors() {
  showForceVectors = !showForceVectors;
}

// Update n value when slider is changed
// const nSlider = document.getElementById('nSlider');
// nSlider.addEventListener('input', () => {
//   n = nSlider.value;
//   nValue.textContent = n;  // Update the displayed value
// });

// Run the program
function runSimulation() {
  createParticles();
  loop();
}

runSimulation()