// define variables for simulation
let n = 10;
let nSpecies = 1;
let Particles = [];
let simulationFrequency = 60;
let simulationUpdateInterval = 1000 / simulationFrequency;
let lastSimulationUpdate = 0;
2
// visual canvas settings
let canvasFrequency = 60;
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
      type: 0, // particle type
    };
    
    Particles.push(particle);
  }
  return Particles;
}


function updateSimulation() {
  
  //create forceVectors array
  let [fx, fy] = [0,0]
  let forceVectors = [];
  for (let i = 0; i < n; i++) { forceVectors.push([0,0]) };

  //calculate distance and force vector for each particle
  for (let i = 0; i < n-1; i++) {
    for (let j = i+1; j < n; j++) {

      // calculate distance
      let dx = Particles[j].x - Particles[i].x;
      let dy = Particles[j].y - Particles[i].y;
      let d = Math.sqrt(dx**2 + dy**2);
 
      //attraction and repulsion logic
      let m = 0.3 // multiplier
      if (d < 200) { m *= -0.3 } //50 is a good value

      //calculate force vectors
      let f = 1/(d+1e-8)*m;  // Add a small value to prevent division by zero
      f = Math.min(f, 0.01);

      //add force vectors
      fx = (dx/d)*f
      fy = (dy/d)*f
      forceVectors[i][0] += fx
      forceVectors[i][1] += fy
      forceVectors[j][0] -= fx
      forceVectors[j][1] -= fy
    };
  };

  //update particles
  let t = simulationUpdateInterval
  tSquared = t**2
  Particles.forEach((p, i) => {
    // update particle coordinates (using fomrula x(t)= 0.5*a*t^2 + v0*t + x0)
    p.x += 0.5 * (forceVectors[i][0] * tSquared) + p.vx * t;
    p.y += 0.5 * (forceVectors[i][1] * tSquared) + p.vy * t;

    //update velocities
    p.vx += forceVectors[i][0] * t;
    p.vy += forceVectors[i][1] * t;

    //introduce friction (1 means no friction, <1 means friction)
    const friction = 0.80
    p.vx *= friction
    p.vy *= friction

    // constrain particles to within visible canvas
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
    let multiplier = 50;
    ctx.beginPath();
    ctx.moveTo(x, y);  // Start the line from the particle's position
    ctx.lineTo(x + particle.vx * multiplier, y + particle.vy * multiplier);  // End the line at the force vector's end
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
  //drawForceVectors(Particles);
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