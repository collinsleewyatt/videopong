import { cloneDeep } from "lodash";
import GameState from "../../GameManagement/GameState";
import { Input } from "../../GameManagement/Input";
import Ball from "../GameObjects/Ball";
import Laser from "../GameObjects/Laser";
import MovingObject from "../GameObjects/MovingObject";
import Starship from "../GameObjects/Starship";
// const config = require("../../../config/protocol")
const movePerMs = 1000 / 30; //config.tickrate

export class PongState extends GameState {
    objects: MovingObject[] = [];
    currentTick: number;
    stoppedUntilTick: number = 0;
    public teamBlueScore: number = 0;
    public teamRedScore: number = 0;

    constructor(currentTick) {
      super();
      this.objects[0] = new Ball();
      this.currentTick = currentTick;
    }
  
    addInputs(inputs: Input[]) {
      for (let input of inputs) {
        if (input.type == "addrole") {
          this.objects.push(
            new Starship(input.uuid, 100, 100)
          );
          return;
        }
        if (input.type == "removerole") {
          let indexToRemove = this.objects.findIndex((obj) => {
            return obj.uuid == input.uuid;
          });;
          if(indexToRemove == -1) {
            console.error(input);
            console.error("no object with uuid " + input.uuid);
          }
          this.objects.splice(indexToRemove, 1);
          return;
        }
        let data = input.data;
        let obj = this.objects.find((obj) => {
          return obj.uuid == input.uuid;
        });
        if(obj == undefined) {
          console.error(input);
          console.error("no object with uuid " + input.uuid);
        }


        if (input.type == "changeAcceleration") {
          obj.accX = 2*Math.sign(data.x);
          obj.accY = 2*Math.sign(data.y);
        }else if (input.type == "changeTarget") {
          if(obj instanceof Starship) {
            obj.target = data;
          }
        } else if (input.type == "chargeLaser") {
          if(obj instanceof Starship) {
            obj.strokeStyle = "red";
            obj.chargeTick = this.currentTick;
          }
        } else if (input.type == "shootLaser") {
          if(obj instanceof Starship) {
            obj.strokeStyle = "white"
            obj.fillStyle = "white"
            let intensity = (this.currentTick - obj.chargeTick + 30) / 3;
            let maxHold = 60;
            if(intensity > maxHold) {
              intensity = maxHold;
            }
            this.objects.push(new Laser(obj.x, obj.y, obj.angle, intensity / maxHold));
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
        if(object instanceof Ball) {
          let winner = object.getWinner();
          if(winner == "blue") {
            this.teamBlueScore += 1;
          }else if(winner == "red") {
            this.teamRedScore += 1;
          }
        }
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
  
    render(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, 800, 600);
      for (let object of this.objects) {
        object.render(ctx, this.objects.indexOf(object));
      }
    }
  }
  