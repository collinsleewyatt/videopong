import MovingObject from "./MovingObject";

export default class Starship extends MovingObject {
  size: number = 25;
  angle: number = 0;
  target = {x: 0, y: 0};
  points = [
    { x: 0 - this.size / 2, y: 0 + this.size / 2 },
    { x: 0 + this.size / 2, y: 0 + this.size / 2 },
    { x: 0, y: 0 - this.size * 0.6 },
  ];
  // center = {x: this.size / 2, y: this.size / 2};
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.velX = 0;
    this.velY = 0;
  }

  update() {
    this.velX /= 1.01;
    this.velY /= 1.01;
    if (Math.abs(this.velX) > 2) {
      this.velX = Math.sign(this.velX) * 2;
    }
    if (Math.abs(this.velY) > 2) {
      this.velY = Math.sign(this.velY) * 2;
    }
    if (this.velX > .2 && this.velX < .2) {
      this.velX = 0;
    }
    if (this.velY > -0.2 && this.velY < 0.2) {
      this.velY = 0;
    }
    // move starship
    this.x += this.velX;
    this.y += this.velY;
    this.angle = Math.atan2(this.target.y - this.y, this.target.x - this.x) + (Math.PI / 2);
  }
  render(ctx: CanvasRenderingContext2D) {
    let points = this.points;
    const translateAndRotate = (x:number, y:number, offsetX:number, offsetY:number, angle:number) => {
      return {
        x: offsetX + (x * Math.cos(angle) - y * Math.sin(angle)),
        y: offsetY + (x * Math.sin(angle) + y * Math.cos(angle)),
      };
    };
    ctx.strokeStyle = "blue";
    ctx.fillStyle = "white";
    // move to initial point plus offset
    let {x, y} = translateAndRotate(this.points[0]["x"], this.points[0]["y"], this.x, this.y, this.angle);
    ctx.moveTo(x, y);
    ctx.beginPath();
    // draw lines to all points in the polygon
    for (let i = 1; i < this.points.length; i++) {
      // same code as before, just using i to indicate the current iteration
      ({x, y} = translateAndRotate(this.points[i]["x"], this.points[i]["y"], this.x, this.y, this.angle));
      ctx.lineTo(x, y);
    }
    // draw the line between the last point and the first point to complete the fill
    ({x, y} = translateAndRotate(this.points[0]["x"], this.points[0]["y"], this.x, this.y, this.angle));
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  collision() {
    return false;
  }
}
