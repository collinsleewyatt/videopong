import { uniqueId } from "lodash";

const config = require("../../config/protocol");
const movePerMs = 1000 / config.tickrate;

interface coordinatePair {
  x: number;
  y: number;
}
export default abstract class MovingObject {
  x: number;
  y: number;
  velX: number = 0;
  velY: number = 0;
  accX: number = 0;
  accY: number = 0;
  angle: number;
  uuid: string;
  size?: number;
  abstract geometry: coordinatePair[];
  abstract strokeStyle: string;
  abstract fillStyle: string;
  currentTick: number;
  constructor(uuid?: string) {
    if (uuid !== undefined) {
      this.uuid = uuid;
    } else {
      this.uuid = uniqueId();
    }
  }


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
  render(ctx: CanvasRenderingContext2D, index): void {
    const oldLineWidth = ctx.lineWidth;
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillStyle = this.fillStyle;
    if (this.strokeStyle == "") {
      ctx.lineWidth = 0;
    }
    let geometry = this.getCurrentPoints();
    // moving to the first geometry point, then looping to paint
    ctx.moveTo(geometry[0].x, geometry[0].y);
    ctx.beginPath();
    if (geometry.length == 1) {
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    } else {
      for (let i = 1; i < geometry.length; i++) {
        ctx.lineTo(geometry[i].x, geometry[i].y);
      }
      // connecting the final point to the first point to make a coherent shape.
      ctx.lineTo(geometry[0].x, geometry[0].y);
    }
    ctx.closePath();
    if (this.fillStyle != "") {
      ctx.fill();
    }
    if (this.strokeStyle != "") {
      ctx.stroke();
    }

    ctx.font = "20px Arial";
    ctx.fillStyle = "red";
    //ctx.fillText(index, this.x, this.y, 300);
    // resetting the line width:
    ctx.lineWidth = oldLineWidth;
  }

  abstract update(): void;
  abstract shouldBeRemoved(): boolean;
  abstract collided(other: MovingObject): void;

  collision(other: MovingObject): boolean {
    const getLines = (thisLines: coordinatePair[]): coordinatePair[][] => {
      let lines = [];
      for (let i = 0; i < thisLines.length; i++) {
        // get next point or wrap around to zero:
        let next = i + 1 != thisLines.length ? i + 1 : 0;
        lines.push([thisLines[i], thisLines[next]]);
      }
      return lines;
    };
    let thisPoints = this.getCurrentPoints();
    let otherPoints = other.getCurrentPoints();
    // circle detection
    if (thisPoints.length == 1 || otherPoints.length == 1) {
      // determining the circle radius because of 
      let circleRadius: number;
      if(thisPoints.length == 1) {
        circleRadius = this.size;
      }else {
        circleRadius = other.size;
      }

      for(let point of thisPoints) {
        for(let otherPoint of otherPoints) {
          let distX = otherPoint.x - point.x;
          let distY = otherPoint.y - point.y;
          let distance = Math.sqrt((distX*distX + distY*distY))
          if(distance < circleRadius) {
            return true;
          }
        }
      }
      return false;
    }


    // non-circle detection
    let thisLines = getLines(thisPoints);
    let otherLines = getLines(otherPoints);

    // do a line-line check on every possible line
    for (let line of thisLines) {
      for (let otherLine of otherLines) {
        if (lineLine(line, otherLine)) {
          return true;
        }
      }
    }
    return false;
  }
  move(deltaTime: number) {
    this.x += (this.velX * deltaTime) / 100;
    this.y += (this.velY * deltaTime) / 100;
  }
}

// this function is from http://jeffreythompson.org/collision-detection/poly-line.php
// used with respect to the code's license https://creativecommons.org/licenses/by-nc-sa/3.0/
// LINE/LINE
function lineLine(line1: coordinatePair[], line2: coordinatePair[]) {
  let x1 = line1[0]["x"];
  let y1 = line1[0]["y"];
  let x2 = line1[1]["x"];
  let y2 = line1[1]["y"];
  let x3 = line2[0]["x"];
  let y3 = line2[0]["y"];
  let x4 = line2[1]["x"];
  let y4 = line2[1]["y"];
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
