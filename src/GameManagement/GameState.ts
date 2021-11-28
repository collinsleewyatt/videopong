import Laser from "../GameObjects/Laser";
import MovingObject from "../GameObjects/MovingObject";
import Starship from "../GameObjects/Starship";
import { isKeyDown, mouseLocation } from "./InputEventDriver";

const config = require("../../config/protocol");
const movePerMs = 1000 / config.tickrate;

export default class GameState {
  objects: MovingObject[];
  // the last time the 
  lastLogicTimestamp: number;
  timestamp: number;
  constructor(timestamp) {
    this.timestamp = timestamp;
    this.lastLogicTimestamp = timestamp;
    this.objects = [new Starship(0, 0), new Starship(500, 400)];
  }

  simulate(toTimestamp: number) {
    // if we are reaching to a point in the future where we will need to do a full update function:
    while(toTimestamp - this.lastLogicTimestamp > movePerMs) {
      // run up to where we need to update.
      let moveUpToTimestamp = this.lastLogicTimestamp + movePerMs;
      this.move(this.timestamp, moveUpToTimestamp);
      this.tick();
      // changing variables to be accurate: 
      this.timestamp = moveUpToTimestamp;
      this.lastLogicTimestamp = moveUpToTimestamp;
    }
    if(this.timestamp < toTimestamp) {
      this.move(this.timestamp, toTimestamp);
      this.timestamp = toTimestamp;
    }
  }

  /**
   * 
   */
  move(previousTimestamp: number, toTimestamp: number) {
    for(let object of this.objects) {
      object.move(toTimestamp - previousTimestamp);
    }
  }

  /**
   * there are two functions for updating the game, one is a move function which only moves the entities,
   * one is an update function that spawns new entities and does colission detection.
   * this helps us be able to have a tickrate that is lower than the framerate of our device yet still have
   * the game appear smooth and synchronize.
   */
  tick() {
    let star = this.objects[0] as Starship;
    if(isKeyDown("a")) {
        star.velX += -3;
      }
      if(isKeyDown("d")) {
        star.velX += 3;
      }
      if(isKeyDown("w")) {
        star.velY += -3;
      }
      if(isKeyDown("s")) {
        star.velY += 3;
      }
      if(this.objects.length > 2) {
        console.log(this.objects[1].collision(this.objects[2]));
      }
      if(isKeyDown(" ")) {
        if(star.nextShoot < Date.now()) {
          star.nextShoot = Date.now() + 1000;
          this.objects.push(new Laser(star.x, star.y, Math.cos(star.angle - Math.PI / 2) * 40, Math.sin(star.angle - Math.PI / 2) * 40))
        }

      }
    star.target = mouseLocation();
    for (let object of this.objects) {
      // laser-specific: remove the object if it's off the screen and won't be able to be in play again
      if (object instanceof Laser) {
        if ((object as Laser).isOutOfPlay()) {
          this.objects.splice(this.objects.indexOf(object), 1);
        }
      }
      object.update();
    }
  }
  render(ctx: CanvasRenderingContext2D) {
    for (let object of this.objects) {
      object.render(ctx, this.objects.indexOf(object));
    }
  }
  equals(state: GameState) {
    return false;
  }
}
