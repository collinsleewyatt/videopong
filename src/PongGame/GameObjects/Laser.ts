import Ball from "./Ball";
import MovingObject from "./MovingObject";

export default class Laser extends MovingObject {
  fillStyle = "red";
  strokeStyle = "red";
  size: number = 20;
  geometry = [
    { x: 0 - this.size / 2, y: 0 + this.size / 2 },
    { x: 0 + this.size / 2, y: 0 + this.size / 2 },
    { x: 0, y: 0 - this.size * 0.6 },
  ];
  hasCollidedWithBall = false;
  intensity: number;

  constructor(x: number, y: number, angle: number, intensity: number) {
    super();
    this.x = x;
    this.y = y;
    this.velX = Math.cos(angle + Math.PI / 2) * intensity * -80;
    this.velY = Math.sin(angle + Math.PI / 2) * intensity * -80;
    this.intensity = intensity;
    this.angle = angle;
    // this.angle = Math.atan2(this.velY, this.velX) + (Math.PI / 2);

  }
  update() {
    
  }
  /**
   * If the object is off screen and won't be interacted with.
   * @returns boolean relating if the object
   */
  shouldBeRemoved():boolean {
    return (
      (this.x < 0 && this.velX < 0) ||
      (this.x > 800 && this.velX >= 0) ||
      (this.y < 0 && this.velY < 0) ||
      (this.y > 600 && this.velY > 0)
    ) || this.hasCollidedWithBall;
  }
  collided(other: MovingObject) {
    if(other instanceof Ball) {
      this.hasCollidedWithBall = true;
    }
  }

}
