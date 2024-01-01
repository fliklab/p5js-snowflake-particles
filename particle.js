function Particle(_x, _y, _size, _color, target_x, target_y) {
  this.position = new p5.Vector(_x, _y);
  this.velocity = new p5.Vector(0, 0);
  this.acc = new p5.Vector(0, 0);
  this.target = new p5.Vector(target_x ?? _x, target_y ?? _y);
  this.size = _size;
  this.shape = random(4);
  this.mapped_angle =
    map(_x, 0, width, -180, 180) + map(_y, 0, height, -180, 180);
  this.color = _color;
  this.maxForce = random(MIN_FORCE, MAX_FORCE);
  this.inBox = false;

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
    if (this.inBox) return;
    if (!mousePressed) return;

    let mx = mouseX;
    let my = mouseY;

    let mouseDistance = dist(this.position.x, this.position.y, mx, my);

    if (mouseDistance < REPULSION_RADIUS * 0.5) {
      this.inBox = true;
      SCORE++;
      // class score 인 부분 업데이트
      document.getElementById("score").innerHTML = `${SCORE}/${particleCount}`;
    } else if (mouseDistance < REPULSION_RADIUS) {
      let repulse = new p5.Vector(this.position.x, this.position.y);
      repulse.sub(mx, my);
      repulse.mult(
        map(mouseDistance, REPULSION_RADIUS, 0, 0, REPULSION_STRENGTH)
      );
      this.acc.add(repulse);
    }
  };

  this.followBox = function () {
    if (this.inBox) {
      let mx = mouseX;
      let my = mouseY;

      let mouseDistance = dist(this.position.x, this.position.y, mx, my);

      if (mouseDistance > REPULSION_RADIUS * 0.5) {
        let repulse = new p5.Vector(this.position.x, this.position.y);
        repulse.sub(mx, my);
        repulse.mult(
          map(mouseDistance, REPULSION_RADIUS * 0.5, 0, 0, REPULSION_STRENGTH)
        );
        this.acc.add(repulse);
      }
    }
  };

  this.move = function () {
    this.goToTarget();

    this.avoidMouse();
    this.followBox();
    this.velocity.mult(0.75);

    this.velocity.add(this.acc);
    this.position.add(this.velocity);
    this.acc.mult(0.15);
  };

  this.draw = function () {
    push();

    noStroke();
    translate(this.position.x, this.position.y);
    const spin = this.velocity.mag() * SPIN_MULTIPLIER;

    rotate(radians(this.mapped_angle + spin));

    fill(!this.inBox ? this.color : color(100, 50, 255));
    if (this.shape >= 2) {
      push();
      fill(255, 255, 255, 230);
      // 눈 모양 그리기
      snowGen(this.size * 2);
      pop();
    } else if (this.shape >= 1) {
      fill(255, 255, 255, 230);
      // 육각형 모양 그리기
      beginShape();
      vertex(0, -this.size / 2);
      vertex(-this.size / 2, -this.size / 4);
      vertex(-this.size / 2, this.size / 4);
      vertex(0, this.size / 2);
      vertex(this.size / 2, this.size / 4);
      vertex(this.size / 2, -this.size / 4);
      endShape(CLOSE);
    } else {
      ellipse(0, 0, this.size * 0.5, this.size * 0.5);
    }

    pop();
  };
}

// 재귀함수로 눈의 가지를 그리는 함수
function snowGenPart(size) {
  noStroke();
  push();
  rect(0, 0, size, size * 0.05);
  rotate(radians(90));
  rect(0, size * 0.15, size * 0.2, size * 0.05);
  rect(0, size * 0.35, size * 0.2, size * 0.05);
  rect(0, -size * 0.15, size * 0.2, size * 0.05);
  rect(0, -size * 0.35, size * 0.2, size * 0.05);
  pop();
}
function snowGen(size) {
  push();
  fill(255, 255, 255, 230);
  snowGenPart(size);
  rotate(radians(60));
  snowGenPart(size);
  rotate(radians(60));
  snowGenPart(size);
  rotate(radians(60));
  pop();
}
