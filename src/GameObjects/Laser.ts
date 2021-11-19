import MovingObject from "./MovingObject";

export default class Laser extends MovingObject {
  constructor(x: number, y: number, velX: number, velY: number) {
    super();
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
  update() {
    this.x += this.velX;
    this.y += this.velY;
  }

  shouldBeRemoved() {
    //if the laser should die
    return (
      (this.x < 0 && this.velX < 0) ||
      (this.x > 800 && this.velX >= 0) ||
      (this.y < 0 && this.velY < 0) ||
      (this.y > 600 && this.velY > 0)
    );
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.velX * 4, this.y + this.velY * 4);
    ctx.closePath();
    ctx.stroke();
  }
  collision() {
    return false;
  }
}
