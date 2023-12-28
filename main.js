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

    push();
    translate(particle.position.x, particle.position.y);
    const spin = particle.velocity.mag() * SPIN_MULTIPLIER;

    rotate(radians(particle.mapped_angle + spin));

    fill(particle.color);
    if (particle.shape >= 3) {
      fill(255, 255, 255, 255);
      // 육각 결정 모양의 눈꽃 그리기
      beginShape();
      vertex(0, -particle.size / 2);
      vertex(-particle.size / 2, -particle.size / 4);
      vertex(-particle.size / 2, particle.size / 4);
      vertex(0, particle.size / 2);
      vertex(particle.size / 2, particle.size / 4);
      vertex(particle.size / 2, -particle.size / 4);
      endShape(CLOSE);
    } else if (particle.shape >= 2) {
      fill(255, 255, 255, 230);
      // astrict * 모양 그리기
      beginShape();
      vertex(0, -particle.size / 2);
      vertex(-particle.size / 2, -particle.size / 4);
      vertex(-particle.size / 2, particle.size / 4);
      vertex(0, particle.size / 2);
      vertex(particle.size / 2, particle.size / 4);
      vertex(particle.size / 2, -particle.size / 4);
      endShape(CLOSE);
    } else if (particle.shape >= 1) {
      // 육각 별 모양의 눈꽃 그리기
      beginShape();
      vertex(0, -particle.size / 2);
      vertex(-particle.size / 4, -particle.size / 4);
      vertex(-particle.size / 2, 0);
      vertex(-particle.size / 4, particle.size / 4);
      vertex(0, particle.size / 2);
      vertex(particle.size / 4, particle.size / 4);
      vertex(particle.size / 2, 0);
      vertex(particle.size / 4, -particle.size / 4);
      endShape(CLOSE);
    } else {
      ellipse(0, 0, particle.size, particle.size);
    }

    pop();
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
            x,
            y,
            min(smallestSize, maxSize) * 0.75,
            color(255, 255, 255, 200),
            int(random(4))
          );
        }
      } else {
        newParticle = new Particle(
          x,
          y,
          maxSize,
          color(255, 255, 255, 200),
          int(random(4))
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
