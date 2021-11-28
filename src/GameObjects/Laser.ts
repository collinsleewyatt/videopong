import MovingObject from "./MovingObject";

export default class Laser extends MovingObject {
  fillStyle = "";
  strokeStyle = "red";
  geometry = [
    {x: 0, y: -10},
    {x: 0, y: -70}
  ]

  constructor(x: number, y: number, velX: number, velY: number) {
    super();
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.angle = Math.atan2(this.velY, this.velX) + (Math.PI / 2);

  }
  update() {
  }
  /**
   * If the object is off screen and won't be interacted with.
   * @returns boolean relating if the object
   */
  isOutOfPlay():boolean {
    return (
      (this.x < 0 && this.velX < 0) ||
      (this.x > 800 && this.velX >= 0) ||
      (this.y < 0 && this.velY < 0) ||
      (this.y > 600 && this.velY > 0)
    );
  }
  collision() {
    return false;
  }
}
