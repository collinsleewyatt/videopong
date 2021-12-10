import { uniqueId } from "lodash";
import GameManager from "./GameManagement/GameManager";
import {
  registerKeyPressEventListener,
  registerMouseMoveEventListener,
} from "./GameManagement/InputEventDriver";
import Starship from "./GameObjects/Starship";

require("./main.css");

let game: HTMLCanvasElement = document.getElementById(
  "game"
) as HTMLCanvasElement;
let ctx: CanvasRenderingContext2D = game.getContext("2d");
let angle = 0;
let centerX = 600;
let centerY = 300;
let velX = 0;
let velY = 0;

let manager = new GameManager();

let previousTime = 0;
let startingTime = -1;
function runAndPaint(time) {
  if (startingTime == -1) {
    startingTime = time;
  }
  time = time - startingTime;
  document.getElementById("info").innerHTML = "" + (time - previousTime);
  previousTime = time;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 800, 600);
  manager.getStateAt(time).render(ctx);
  window.requestAnimationFrame(runAndPaint);
}
window.requestAnimationFrame(runAndPaint);

registerKeyPressEventListener((keyPress) => {
  switch (keyPress.key) {
    case "p":
      manager.addInput({
        data: { uuid: uniqueId(), location: { x: 0, y: 0 } },
        index: manager.inputs.length,
        onTick: manager.states.at(-1).currentTick,
        type: "addCharacter",
      });
      break;
    case "w":
      manager.addInput({
        data: {
          uuid: manager.states.at(-1).objects.at(0).uuid,
          type: keyPress.type,
          y: "-",
        },
        index: manager.inputs.length,
        onTick: manager.states.at(-1).currentTick,
        type: "changeDirection",
      });
      break;
    case "a":
      manager.addInput({
        data: {
          uuid: manager.states.at(-1).objects.at(0).uuid,
          type: keyPress.type,
          x: "-",
        },
        index: manager.inputs.length,
        onTick: manager.states.at(-1).currentTick,
        type: "changeDirection",
      });
      break;
    case "s":
      manager.addInput({
        data: {
          uuid: manager.states.at(-1).objects.at(0).uuid,
          type: keyPress.type,
          y: "+",
        },
        index: manager.inputs.length,
        onTick: manager.states.at(-1).currentTick,
        type: "changeDirection",
      });
      break;
    case "d":
      manager.addInput({
        data: {
          uuid: manager.states.at(-1).objects.at(0).uuid,
          type: keyPress.type,
          x: "+",
        },
        index: manager.inputs.length,
        onTick: manager.states.at(-1).currentTick,
        type: "changeDirection",
      });
      break;
    case " ":
      if (keyPress.type == "on") {
        manager.addInput({
          data: {
            uuid: manager.states.at(-1).objects.at(0).uuid,
          },
          index: manager.inputs.length,
          onTick: manager.states.at(-1).currentTick,
          type: "chargeProjectile",
        });
      }
      if (keyPress.type == "off") {
        manager.addInput({
          data: {
            uuid: manager.states.at(-1).objects.at(0).uuid,
            angle: manager.states.at(-1).objects.at(0).angle,
          },
          index: manager.inputs.length,
          onTick: manager.states.at(-1).currentTick,
          type: "shootProjectile",
        });
      }
      break;
  }
});

registerMouseMoveEventListener((mouseEvent) => {
  let factor = 4;
  let nx = Math.floor(mouseEvent.x / factor) * factor;
  let ny = Math.floor(mouseEvent.y / factor) * factor;
  let { x, y } = (manager.states.at(-1).objects.at(0) as Starship).target;
  if (x == nx && y == ny) {
    return;
  } else {
    manager.addInput({
      data: {
        uuid: manager.states.at(-1).objects.at(0).uuid,
        location: { x: nx, y: ny },
      },
      index: manager.inputs.length,
      onTick: manager.states.at(-1).currentTick,
      type: "changeTarget",
    });
  }
});
