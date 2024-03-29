import MovingObject from "./MovingObject";

export default class Starship extends MovingObject {
  target = { x: 0, y: 0 };
  maxSpeed = 15;
  nextShoot: number = 0;
  size: number = 40;
  geometry = [
    { x: 0 - this.size / 2, y: 0 + this.size / 2 },
    { x: 0 + this.size / 2, y: 0 + this.size / 2 },
    { x: 0, y: 0 - this.size * 0.6 },
  ];
  fillStyle = "white";
  strokeStyle = "white";
  chargeTick: number = -1;

  // center = {x: this.size / 2, y: this.size / 2};
  constructor(uuid: string, x: number, y: number) {
    super(uuid);
    this.x = x;
    this.y = y;
    this.velX = 0;
    this.velY = 0;
  }

  move(deltaTime: number) {
    super.move(deltaTime);
    this.angle =
      Math.atan2(this.target.y - this.y, this.target.x - this.x) + Math.PI / 2;
  }

  update() {
    if (this.chargeTick != -1) {
      let red = Math.floor(Math.pow(this.currentTick - this.chargeTick, 1.4));
      if (red > 255) {
        red = 255;
      }
      let color = red.toString(16);
      this.fillStyle = `#${color}0000`;
    }
    this.velX /= 1.04;
    this.velY /= 1.04;
    this.velX += this.accX;
    this.velY += this.accY;
    if (Math.abs(this.velX) > this.maxSpeed) {
      this.velX = Math.sign(this.velX) * this.maxSpeed;
    }
    if (Math.abs(this.velY) > this.maxSpeed) {
      this.velY = Math.sign(this.velY) * this.maxSpeed;
    }
    if (this.velX > 0.2 && this.velX < 0.2) {
      this.velX = 0;
    }
    if (this.velY > -0.2 && this.velY < 0.2) {
      this.velY = 0;
    }
  }

  shouldBeRemoved() {
    return false;
  }

  collided(other: MovingObject) {}
}
