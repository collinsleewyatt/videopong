const config = require("../../config/protocol");
const movePerMs = 1000 / config.tickrate;
interface coordinatePair {
  x: number;
  y: number;
}
export default abstract class MovingObject {
  x: number;
  y: number;
  velX: number;
  velY: number;
  angle: number;
  abstract geometry: coordinatePair[];
  abstract strokeStyle: string;
  abstract fillStyle: string;

  getCurrentPoints(): coordinatePair[] {
    const translateAndRotate = (
      x: number,
      y: number,
      offsetX: number,
      offsetY: number,
      angle: number
    ) => {
      return {
        x: offsetX + (x * Math.cos(angle) - y * Math.sin(angle)),
        y: offsetY + (x * Math.sin(angle) + y * Math.cos(angle)),
      };
    };
    return this.geometry.map((value) => {
      return translateAndRotate(value.x, value.y, this.x, this.y, this.angle);
    });
  }
  render(ctx: CanvasRenderingContext2D): void {
    const oldLineWidth = ctx.lineWidth;
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillStyle = this.fillStyle;
    if (this.strokeStyle == "") {
      ctx.lineWidth = 0;
    }
    let geometry = this.getCurrentPoints();
    if (geometry[0]?.["x"] == undefined) {
      console.log("oops");
    }
    if (geometry.length > 1) {
      // moving to the first geometry point, then looping to paint
      ctx.moveTo(geometry[0].x, geometry[0].y);
      ctx.beginPath();
      for (let i = 1; i < geometry.length; i++) {
        ctx.lineTo(geometry[i].x, geometry[i].y);
      }
      // connecting the final point to the first point to make a coherent shape.
      ctx.lineTo(geometry[0].x, geometry[0].y);
      ctx.closePath();
      if (this.fillStyle != "") {
        ctx.fill();
      }
      if(this.strokeStyle != "") {
        ctx.stroke();
      }
    }
    // resetting the line width:
    ctx.lineWidth = oldLineWidth;
  }

  abstract update(): void;

  collision(other: MovingObject): boolean {
      return false;
    const getLines = (pts: coordinatePair[]) => {
      for (let i = 0; i < pts.length; i++) {
        // get next point or wrap around to zero:
        let next = i + 1 != pts.length ? i + 1 : 0;

      }
    };
    let pts = this.getCurrentPoints();
    let otherPts = other.getCurrentPoints();
    // do a line-line check on every possible line

    return true;
  }
  move(deltaTime: number) {
    this.x += (this.velX * deltaTime) / 100;
    this.y += (this.velY * deltaTime) / 100;
  }
}

// this function is from http://jeffreythompson.org/collision-detection/poly-line.php
// used with respect to the code's license https://creativecommons.org/licenses/by-nc-sa/3.0/
// LINE/LINE
function lineLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number
) {
  // calculate the direction of the lines
  let uA =
    ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  let uB =
    ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // if uA and uB are between 0-1, lines are colliding
  return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
}
