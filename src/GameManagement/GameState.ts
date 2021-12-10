import { cloneDeep } from "lodash";
import Ball from "../GameObjects/Ball";
import Laser from "../GameObjects/Laser";
import MovingObject from "../GameObjects/MovingObject";
import Starship from "../GameObjects/Starship";
import { Input } from "./GameManager";

const config = require("../../config/protocol");
const movePerMs = 1000 / config.tickrate;

export default class GameState {
  objects: MovingObject[] = [];
  currentTick: number;
  stoppedUntilTick: number = 0;

  constructor(currentTick) {
    this.objects[0] = new Starship("asdko", 20, 20);
    this.objects[1] = new Ball();
    this.currentTick = currentTick;
  }

  addInputs(inputs: Input[]) {
    for (let input of inputs) {
      if (input.type == "addCharacter") {
        let data = input.data;
        this.objects.push(
          new Starship(data.uuid, data.location.x, data.location.y)
        );
      }
      if (input.type == "changeDirection") {
        let data = input.data;
        let obj = this.objects.find((obj) => {
          return obj.uuid == data.uuid;
        });
        if(obj == undefined) {
          throw new Error("no object with uuid " + data.uuid);
        }
        if (data.type == "on") {
          if (data.x == "+") {
            obj.accX = 2;
          } else if (data.x == "-") {
            obj.accX = -2;
          }
          if (data.y == "+") {
            obj.accY = 2;
          } else if (data.y == "-") {
            obj.accY = -2;
          }
        } else if (data.type == "off") {
          if (data.x) {
            obj.accX = 0;
          }
          if (data.y) {
            obj.accY = 0;
          }
        }
      }

      if (input.type == "changeTarget") {
        let data = input.data;
        let obj = this.objects.find((obj) => {
          return obj.uuid == data.uuid;
        });
        if(obj == undefined) {
          throw new Error("no object with uuid " + data.uuid);
        }
        if(obj instanceof Starship) {
          obj.target = input.data.location;
        }
      }

      if (input.type == "chargeProjectile") {
        let data = input.data;
        let obj = this.objects.find((obj) => {
          return obj.uuid == data.uuid;
        });
        if(obj == undefined) {
          throw new Error("no object with uuid " + data.uuid);
        }
        if(obj instanceof Starship) {
          obj.strokeStyle = "red";
          obj.chargeTick = this.currentTick;
        }
      }

      if (input.type == "shootProjectile") {
        let data = input.data;
        let obj = this.objects.find((obj) => {
          return obj.uuid == data.uuid;
        });
        if(obj == undefined) {
          throw new Error("no object with uuid " + data.uuid);
        }
        if(obj instanceof Starship) {
          obj.strokeStyle = "white"
          obj.fillStyle = "white"
          let intensity = (this.currentTick - obj.chargeTick + 30) / 3;
          let maxHold = 60;
          if(intensity > maxHold) {
            intensity = maxHold;
          }
          this.objects.push(new Laser(obj.x, obj.y, data.angle, intensity / maxHold));
        }
      }

    }
  }

  tick() {
    this.currentTick += 1;
    // freezing functionality
    if(this.currentTick < this.stoppedUntilTick) {
      return;
    }
    for (let i = 0; i < this.objects.length; i++) {
      let object = this.objects[i];
      object.currentTick = this.currentTick;
      object.move(movePerMs);
      object.update();
      if (object.shouldBeRemoved()) {
        this.objects.splice(this.objects.indexOf(object), 1);
      }
      for(let j = i + 1; j < this.objects.length; j++) {
        let otherObject = this.objects[j];
        if(object.collision(otherObject)) {
          object.collided(otherObject);
          otherObject.collided(object);
        }
      }
    }
  }
  /**
   * Returns a new, copied, special state,
   * guessing where the objects will be at a specific point in time between ticks.
   * Does not perform collision checks and does not mutate state.
   * This function specifically is only for allowing smooth redraws
   * to allow framerate not to be tied to tickrate. Don't use for updating the game.
   * @param deltaTimeMs
   * @returns
   */
  speculativePartialTick(deltaTimeMs: number): GameState {
    let speculativeState = cloneDeep(this);
    if(this.currentTick < this.stoppedUntilTick) {
      return speculativeState;
    }
    for (let object of speculativeState.objects) {
      object.move(deltaTimeMs);
    }
    return speculativeState;
  }

  /**
   * there are two functions for updating the game, one is a move function which only moves the entities,
   * one is an update function that spawns new entities and does colission detection.
   * this helps us be able to have a tickrate that is lower than the framerate of our device yet still have
   * the game appear smooth and synchronize.
   */
  /*tick() {
    let star = this.objects[0] as Starship;
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
  }*/
  render(ctx: CanvasRenderingContext2D) {
    for (let object of this.objects) {
      object.render(ctx, this.objects.indexOf(object));
    }
  }
  equals(state: GameState) {
    return false;
  }
}
