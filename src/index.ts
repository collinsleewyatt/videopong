import { uniqueId } from "lodash";
import GameManager from "./GameManagement/StateManager";
import {
  clearListeners,
  registerKeyPressEventListener,
  registerMouseMoveEventListener,
} from "./GameManagement/InputEventDriver";
import Time from "./Time";
import { PongState } from "./PongGame/State/PongState";

require("./main.css");


let startingTime = -1;
let currentTime = 0;

let connection = new WebSocket("ws://localhost:7080")
let gameRun = false;
connection.onopen = () => {
  console.log("connected")
}
connection.onerror = (e) => {
  console.log(e);
  console.log("error !")
}
connection.onclose = (e) => {
  gameDie();
  console.log(e);
  console.log("closed :o")
}

let manager = new GameManager(new PongState(0));
let time = new Time(Date.now());

connection.onmessage = (msg) => {
  console.log(msg)
  let data = JSON.parse(msg.data);
  if(data.type == "start") {
    time.startTimer(parseInt(data.data));
    gameStart();
  }
  if(data.type == "setuuid") {
    uuid = data.data;
  }
  if(data.type == "currentTimestamp") {
    time.synchronize(data.data);
  }
  if(data.type == "input") {
    console.log("recieved input...")
    manager.addInput(data.data);
  }
}
let uuid = null;
let gameStart = () => {
  gameRun = true;
  let game: HTMLCanvasElement = document.getElementById(
    "game"
  ) as HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D = game.getContext("2d");
  function runAndPaint() {
    if(!gameRun) {
      return;
    }
    document.getElementById("info").innerHTML = "" + `${time.getTimerValue()}`
    manager.getStateAt(time.getTimerValue()).render(ctx);

    window.requestAnimationFrame(runAndPaint);
  }
  window.requestAnimationFrame(runAndPaint);
  
  function addInput(data: any) {
    manager.addInput(data);
    connection.send(JSON.stringify({type: "input", data: JSON.stringify(data)}));
  }

  registerKeyPressEventListener((keyPress) => {
    if(uuid == null) {
      return;
    }
    switch (keyPress.key) {
      case "p":
        addInput({
          data: { uuid: uniqueId(), location: { x: 0, y: 0 } },
          index: manager.inputs.length,
          onTick: manager.states.at(-1).currentTick,
          type: "addCharacter",
        })
        break;
      case "w":
        addInput({
          data: {
            uuid: uuid,
            type: keyPress.type,
            y: "-",
          },
          index: manager.inputs.length,
          onTick: manager.states.at(-1).currentTick,
          type: "changeDirection",
        });
        break;
      case "a":
        addInput({
          data: {
            uuid: uuid,
            type: keyPress.type,
            x: "-",
          },
          index: manager.inputs.length,
          onTick: manager.states.at(-1).currentTick,
          type: "changeDirection",
        });
        break;
      case "s":
        addInput({
          data: {
            uuid: uuid,
            type: keyPress.type,
            y: "+",
          },
          index: manager.inputs.length,
          onTick: manager.states.at(-1).currentTick,
          type: "changeDirection",
        });
        break;
      case "d":
        addInput({
          data: {
            uuid: uuid,
            type: keyPress.type,
            x: "+",
          },
          index: manager.inputs.length,
          onTick: manager.states.at(-1).currentTick,
          type: "changeDirection",
        });
        break;
      case "g":
        console.log()
        console.log(manager.inputs);
        break;
      case " ":
        if (keyPress.type == "on") {
          addInput({
            data: {
              uuid: uuid,
            },
            index: manager.inputs.length,
            onTick: manager.states.at(-1).currentTick,
            type: "chargeProjectile",
          });
        }
        if (keyPress.type == "off") {
          addInput({
            data: {
              uuid: uuid,
            },
            index: manager.inputs.length,
            onTick: manager.states.at(-1).currentTick,
            type: "shootProjectile",
          });
        }
        break;
    }
  });
  
  registerMouseMoveEventListener((mouseEvent, previousMouseMoveEvent) => {
    if(uuid == null) {
      return;
    }
    let factor = 4;
    let nx = Math.floor(mouseEvent.x / factor) * factor;
    let ny = Math.floor(mouseEvent.y / factor) * factor;
    let { x, y } = previousMouseMoveEvent;
    if (x == nx && y == ny) {
      return;
    } else {
      addInput({
        data: {
          uuid: uuid,
          location: { x: nx, y: ny },
        },
        index: manager.inputs.length,
        onTick: manager.states.at(-1).currentTick,
        type: "changeTarget",
      });
    }
  });
  return manager;
}

function gameDie() {
  gameRun = false;
  clearListeners();
  console.log("die")
}
