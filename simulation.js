// define variables for simulation
let n = 3;
let nSpecies = 2;
let particle = [null, null, null, null, null] //[x, y, vx, vy, s(pecies)]
let Particles = []

// visual canvas settings
let lastUpdate = 0;
let updateInterval = 1000 / 1; // 30 updates per second
let particleSize = 50

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
      x: Math.random() * 100, // Random x position between 0 and 100
      y: Math.random() * 100, // Random y position between 0 and 100
      vx: Math.random() * 10 - 5, // Random velocity between -5 and 5
      vy: Math.random() * 10 - 5, // Random velocity between -5 and 5
      t: Math.random() // Not good code
    };
    
    Particles.push(particle);
  }

  return Particles;
}


function updateSimulation() {
  
  //calculate distances between each particle
  let distances = []
  let vectors = []
  for (let i = 0; i < n-1; i++) {
    for (let j = i+1; j < n; j++) {
      // calculate distance
      let dx = Particles[i].x - Particles[j].x;
      let dy = Particles[i].y - Particles[j].y;
      let d = Math.sqrt(dx**2 + dy**2);
      
      //calculate force vector
      let vector = [dx, dy]
      let nVector = [(dx/d), (dy/d)]
      
      //calculate force
      // ...
      
      distances.push(d)
    }
  }
  
  //calculate force between each particle
  function gravitationalForce(d) {
  	let f = 1/d
    return f
  }
  
  console.log(distances);
  return distances
}

// function for drawing a particle.
function drawParticle(particle) {
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
}

// upates visuals at every frame
function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas

  for (let i = 0; i < n; i++) { //draw particles
    drawParticle(Particles[i])
  }
}

function loopSimulation(timestamp) {
    // updates simulation after a certain period of time.
    if (timestamp - lastUpdate >= updateInterval) {
      
      // update simulation
      updateSimulation()

      // update canvas
      updateCanvas()

      lastUpdate = timestamp;
    }
  
    // tell browser to call function at every frame
    requestAnimationFrame(loopSimulation);
}


// run the program
createParticles()
loopSimulation()

// log
console.log(Particles);
