// define variables for simulation
let n = 5;
let nSpecies = 1;
let Particles = [];
let simulationFrequency = 30;
let simulationUpdateInterval = 1000 / simulationFrequency;
let lastSimulationUpdate = 0;

// visual canvas settings
let canvasFrequency = 30;
let canvasUpdateInterval = 1000 / canvasFrequency;
let lastCanvasUpdate = 0;

//setting up canvas
const canvas = document.getElementById('canvas');
canvas.style.backgroundColor = "#1a1a1a";
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// initial function for creating particles in an array.
function createParticles() {
  for (let i = 0; i < n; i++) {
    // Create a particle with random values
    let particle = {
      x: canvas.width*0.1 + Math.random() * canvas.width*0.8,
      y: canvas.height*0.1 + Math.random() * canvas.height*0.8,
      vx: 0, 
      vy: 0,
      type: 0, // particle type (unused)
      fSum: [0,0] // sum of forces, used for force calculation
    };
    
    Particles.push(particle);
  }
  return Particles;
}


function updateSimulation() {
  
  //calculate distance and vector for each particle
  for (let i = 0; i < n-1; i++) {
    for (let j = i+1; j < n; j++) {

      // calculate distance
      let dx = Particles[j].x - Particles[i].x;
      let dy = Particles[j].y - Particles[i].y;
      let d = Math.sqrt(dx**2 + dy**2);
      
      //calculate vector sum force
      // let f = (1/d)*(10**2); // force formula (**3.5)
      // f = (f < 0.05) ? 0 : Math.min(f, 1.2); //if f is less than 0.05, set it to 0. Cannot go bigger than 1.2

      let A = 10000;  // Depth of the potential well (controls strength of attraction/repulsion)
      let B = 100;    // Equilibrium distance (controls the distance where particles settle)
      f = Math.min(((A / Math.pow(d, 2)) - (B / Math.pow(d, 4))), 1.2) // force max = 1.2 based on Lennard-Jones potential
      //console.log(f)

      let vector = [(dx/d)*f, (dy/d)*f]; //normal vector is in bracket, then multiplied by force 
      
      Particles[i].fSum = Particles[i].fSum.map((value, index) => value + vector[index]);
      Particles[j].fSum = Particles[j].fSum.map((value, index) => value - vector[index]);
    }
  }

  // update particle coordinates. The fSum functions as inertia.
  for (let i = 0; i < n; i++) {
    Particles[i].x += Particles[i].fSum[0];
    Particles[i].y += Particles[i].fSum[1];
  };
}

// function for drawing a particle.
function drawParticle(particle) {
  let particleSize = 20;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
}

// debug function for visualizing force vectors
function drawForceVectors(Particles) {
  Particles.forEach((particle) => {
    let x = particle.x;
    let y = particle.y;

    // Draw the force vector as a line
    let multiplier = 5;
    ctx.beginPath();
    ctx.moveTo(x, y);  // Start the line from the particle's position
    ctx.lineTo(x + particle.fSum[0]*multiplier, y + particle.fSum[1]*multiplier);  // End the line at the force vector's end
    ctx.strokeStyle = 'red';  // Color of the force vector line
    ctx.lineWidth = 2;  // Line thickness
    ctx.stroke();
  });
}

// upates canvas
function updateCanvas() {
  //clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //draw particles
  for (let i = 0; i < n; i++) { drawParticle(Particles[i]) }
  
  //DEBUG: draw force vectors
  drawForceVectors(Particles);
}

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
      //return //to run loop only once
    }
  
    // tell browser to call function at every frame
    requestAnimationFrame(loop);
}

// run the program
createParticles();
loop();