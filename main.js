const SPIN_MULTIPLIER = 45;
const MIN_PARTICLE_COUNT = 200;
const MAX_PARTICLE_COUNT = 700;
const MIN_PARTICLE_SIZE = 12;
const MAX_PARTICLE_SIZE = 50;
const MIN_FORCE = 0.01;
const MAX_FORCE = 0.02;
const REPULSION_RADIUS = 100;
const REPULSION_STRENGTH = 0.2;

let particles = [];
let particleCount = 500;
let maxSize = 50;
let SCORE = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.canvas.oncontextmenu = () => false;
  spawnParticles();
}

function draw() {
  background(160, 0, 0);

  fill(255);
  noStroke();

  push();

  rectMode(CENTER);

  noFill(0, 0, 0);
  strokeWeight(1);
  stroke(255, 255, 255);
  rect(mouseX, mouseY, REPULSION_RADIUS, REPULSION_RADIUS);

  particles.forEach((particle) => {
    particle.move();
    particle.draw();
  });

  pop();

  rectMode(CORNER);
}

function keyPressed() {
  if (key == "+") {
    particleCount = min(particleCount + 50, MAX_PARTICLE_COUNT);
    spawnParticles();
  }

  if (key == "-") {
    particleCount = max(particleCount - 50, MIN_PARTICLE_COUNT);
    spawnParticles();
  }

  if (key == " ") {
    particleCount = max(particleCount - 50, MIN_PARTICLE_COUNT);
    spawnParticles();
  }
}

function mousePressed() {
  // spawnParticles();
}

function spawnParticles() {
  particles = [];
  maxSize = map(
    particleCount,
    MIN_PARTICLE_COUNT,
    MAX_PARTICLE_COUNT,
    MAX_PARTICLE_SIZE,
    MIN_PARTICLE_SIZE
  );

  for (let i = 0; i < particleCount; i++) {
    let max_attempts = 40;
    let attempts = 0;
    let newParticle = null;

    // Pick a random pos from the active image and attempt to spawn a valid particle.
    while (newParticle == null) {
      let x = random(width);
      let y = random(height);

      if (particles.length > 0) {
        let smallestSize = null;

        for (let i = 0; i < particles.length; i++) {
          let otherParticle = particles[i];
          let d = dist(x, y, otherParticle.target.x, otherParticle.target.y);
          let newSize = (d - otherParticle.size / 2) * 2;

          if (smallestSize == null || newSize < smallestSize) {
            smallestSize = newSize;
          }
        }

        if (smallestSize > 0) {
          newParticle = new Particle(
            random(0, width),
            0,
            min(smallestSize, maxSize) * 0.75,
            color(255, 255, 255, 200),
            x,
            y
          );
        }
      } else {
        newParticle = new Particle(
          0,
          0,
          maxSize,
          color(255, 255, 255, 200),
          x,
          y
        );
      }

      attempts += 1;
      if (attempts > max_attempts) {
        break;
      }
    }

    if (newParticle != null) {
      particles.push(newParticle);
    }
  }
}
