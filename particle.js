function Particle(_x, _y, _size, _color) {
  this.position = new p5.Vector(_x, _y);
  this.velocity = new p5.Vector(0, 0);
  this.acc = new p5.Vector(0, 0);
  this.target = new p5.Vector(_x, _y);
  this.size = _size;
  this.shape = random(4);
  this.mapped_angle =
    map(_x, 0, width, -180, 180) + map(_y, 0, height, -180, 180);
  this.color = _color;
  this.maxForce = random(MIN_FORCE, MAX_FORCE);

  this.goToTarget = function () {
    let steer = new p5.Vector(this.target.x, this.target.y);

    let distance = dist(
      this.position.x,
      this.position.y,
      this.target.x,
      this.target.y
    );
    if (distance > 0.5) {
      let distThreshold = 20;
      steer.sub(this.position);
      steer.normalize();
      steer.mult(
        map(min(distance, distThreshold), 0, distThreshold, 0, this.maxForce)
      );
      this.acc.add(steer);
    }
  };

  this.avoidMouse = function () {
    let mx = mouseX;
    let my = mouseY;

    let mouseDistance = dist(this.position.x, this.position.y, mx, my);

    if (mouseDistance < REPULSION_RADIUS) {
      let repulse = new p5.Vector(this.position.x, this.position.y);
      repulse.sub(mx, my);
      repulse.mult(
        map(mouseDistance, REPULSION_RADIUS, 0, 0, REPULSION_STRENGTH)
      );
      this.acc.add(repulse);
    }
  };

  this.move = function () {
    // this.goToTarget();

    this.avoidMouse();

    this.velocity.mult(0.75);

    this.velocity.add(this.acc);
    this.position.add(this.velocity);
    this.acc.mult(0);
  };
}
