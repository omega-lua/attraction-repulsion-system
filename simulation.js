// define variables for simulation
let n = 10;
let nSpecies = 2;
let Particles = []

// visual canvas settings
let lastUpdate = 0;
let updateInterval = 1000 / 1; // 30 updates per second
let particleSize = 25

//setting up canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// initial function for creating particles in an array.
function createParticles() {
  for (let i = 0; i < n; i++) {
    // Create a particle with random values
    let particle = {
      x: canvas.width*0.25 + Math.random() * canvas.width*0.5,
      y: canvas.height*0.25 + Math.random() * canvas.height*0.5,
      vx: 0, 
      vy: 0,
      type: 0, // Type (unused)
      fSum: [0,0] // used for force calculation
    };
    
    Particles.push(particle);
  }

  return Particles;
}


function updateSimulation() {
  
  //calculate for each particle
  for (let i = 0; i < n-1; i++) {
    for (let j = i+1; j < n; j++) {
      // calculate distance
      let dx = Particles[j].x - Particles[i].x;
      let dy = Particles[j].y - Particles[i].y;
      let d = Math.sqrt(dx**2 + dy**2);
      
      //calculate vector sum fo
      let f = (1/d)*(10**3.5); // force formula
      let vector = [(dx/d)*f, (dy/d)*f]; //normal vector is in bracket, then multiplied by force 
      
      Particles[i].fSum = Particles[i].fSum.map((value, index) => value + vector[index]);
      Particles[j].fSum = Particles[j].fSum.map((value, index) => value - vector[index]);
      
    }
  }
  console.log(Particles)
}

// function for drawing a particle.
function drawParticle(particle) {
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();
}

// debug function for visualizing force vectors
function drawForceVectors(Particles) {
  Particles.forEach((particle) => {
    let x = particle.x;
    let y = particle.y;

    // Draw the force vector as a line
    console.log(particle.fSum)
    ctx.beginPath();
    ctx.moveTo(x, y);  // Start the line from the particle's position
    ctx.lineTo(x + particle.fSum[0], y + particle.fSum[1]);  // End the line at the force vector's end
    ctx.strokeStyle = 'red';  // Color of the force vector line
    ctx.lineWidth = 2;  // Line thickness
    ctx.stroke();
  });
}

// upates visuals at every frame
function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas

  for (let i = 0; i < n; i++) { //draw particles
    drawParticle(Particles[i])
  }
  drawForceVectors(Particles)
}

function loopSimulation(timestamp) {
    // updates simulation after a certain period of time.
    if (timestamp - lastUpdate >= updateInterval) {
      
      // update simulation
      updateSimulation();

      // update canvas
      updateCanvas();

      throw new Error("DEBUG: Stops after 1 simulation loop."); // DEBUG
      lastUpdate = timestamp;
    }
  
    // tell browser to call function at every frame
    requestAnimationFrame(loopSimulation);
}


// run the program
createParticles()
loopSimulation()