import MovingObject from "./MovingObject";

export default class Starship extends MovingObject {
  size: number = 25;
  angle: number = 0;
  target = {x: 0, y: 0};
  maxSpeed = 15;
  geometry = [
    { x: 0 - this.size / 2, y: 0 + this.size / 2 },
    { x: 0 + this.size / 2, y: 0 + this.size / 2 },
    { x: 0, y: 0 - this.size * 0.6 },
  ];
  fillStyle = "white";
  strokeStyle = "white";
  // center = {x: this.size / 2, y: this.size / 2};
  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
    this.velX = 0;
    this.velY = 0;
  }

  move(deltaTime:number) {
    super.move(deltaTime);
    this.angle -= .02;
    //this.angle = Math.atan2(this.target.y - this.y, this.target.x - this.x) + (Math.PI / 2);    
  }

  update() {
    this.velX /= 1.04;
    this.velY /= 1.04;
    if (Math.abs(this.velX) > this.maxSpeed) {
      this.velX = Math.sign(this.velX) * this.maxSpeed;
    }
    if (Math.abs(this.velY) > this.maxSpeed) {
      this.velY = Math.sign(this.velY) * this.maxSpeed;
    }
    if (this.velX > .2 && this.velX < .2) {
      this.velX = 0;
    }
    if (this.velY > -0.2 && this.velY < 0.2) {
      this.velY = 0;
    }
  }

  collision() {
    return false;
  }
}
