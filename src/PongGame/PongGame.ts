"use strict";
import { clone } from "lodash";
import { Input } from "../GameManagement/Input";
import {
  clearListeners,
  isKeyDown,
  KeyPressEvent,
  MouseMoveEvent,
  registerKeyPressEventListener,
  registerMouseMoveEventListener,
} from "../GameManagement/InputEventDriver";
import StateManager from "../GameManagement/StateManager";
import Time from "../Time";
import { PongState } from "./State/PongState";
export default class PongGame {
  public state: "open" | "closed" = "closed";
  private ws: WebSocket;
  private stateManager: StateManager;
  private ctx: CanvasRenderingContext2D;
  private time: Time;
  private uuid: string;
  
  constructor(url, ctx: CanvasRenderingContext2D) {
    this.stateManager = new StateManager(new PongState(0));
    this.ctx = ctx;
    this.time = new Time(Date.now());
    this.ws = new WebSocket(url);
    this.ws.onopen = () => {
      this.state = "open";
    };
    this.ws.onclose = () => {
      this.state = "closed";
      clearListeners();
    };
    // anonymous function to keep this working.
    this.ws.onmessage = (e) => {
      this.serverMessage(e);
    };
    registerKeyPressEventListener((e) => {
      this.onKeyPress(e);
    });
    registerMouseMoveEventListener((e, b) => {
      this.onMouseEvent(e, b);
    });
  }

  private serverMessage(ev: MessageEvent) {
    let data = JSON.parse(ev.data);
    if (data.type == "setuuid") {
      this.uuid = data.data;
    }
    if (data.type == "currentTimestamp") {
      this.time.synchronize(data.data);
    }
    if (data.type == "start") {
      this.time.startTimer(parseInt(data.data));
      requestAnimationFrame(() => {
        this.runAndPaint();
      });
    }
    if (data.type == "addrole") {
      this.stateManager.addInput({
        data: undefined,
        onTick: data.onTick,
        type: "addrole",
        uuid: data.uuid,
      });
    }else if (data.type == "removerole") {
        this.stateManager.addInput({
          data: undefined,
          onTick: data.onTick,
          type: "removerole",
          uuid: data.uuid,
        });
      }
    if (data.type == "input") {
      this.stateManager.addInput(data.data);
    }
  }

  private runAndPaint() {
    if (this.state == "closed") {
      return;
    }
    let state = this.stateManager.getStateAt(this.time.getTimerValue()) as PongState;
    document.getElementById("info").innerHTML = `Team blue score: ${state.teamBlueScore}\nTeam Red score: ${state.teamRedScore}`;
    state.render(this.ctx);
    window.requestAnimationFrame(() => {
      this.runAndPaint();
    });
  }

  private onKeyPress(event: KeyPressEvent) {
    if(this.uuid == undefined) {
        return;
    }
    if (
      event.key == "up" ||
      event.key == "down" ||
      event.key == "left" ||
      event.key == "right" ||
      event.key == "w" ||
      event.key == "a" ||
      event.key == "s" ||
      event.key == "d"
    ) {
      let loc = { x: 0, y: 0 };
      if (isKeyDown("up") || isKeyDown("w")) {
        loc.y -= 1;
      }
      if (isKeyDown("down") || isKeyDown("s")) {
        loc.y += 1;
      }
      if (isKeyDown("left") || isKeyDown("a")) {
        loc.x -= 1;
      }
      if (isKeyDown("right") || isKeyDown("d")) {
        loc.x += 1;
      }
      this.sendInput({
        data: loc,
        onTick: this.stateManager.getMostRecentTick(),
        type: "changeAcceleration",
        uuid: this.uuid,
      });
    } else if (event.key == " ") {
      if (event.type == "on") {
        this.sendInput({
          data: {},
          onTick: this.stateManager.getMostRecentTick(),
          type: "chargeLaser",
          uuid: this.uuid,
        });
      } else {
        this.sendInput({
          data: {},
          onTick: this.stateManager.getMostRecentTick(),
          type: "shootLaser",
          uuid: this.uuid,
        });
      }
    }
  }

  private onMouseEvent(mouseEvent: MouseMoveEvent, beforeMouseEvent) {
    if(this.uuid == undefined) {
        return;
    }
    this.sendInput({
      data: mouseEvent,
      onTick: this.stateManager.getMostRecentTick(),
      type: "changeTarget",
      uuid: this.uuid,
    });
  }

  private sendInput(input: Input) {
    input.onTick += 2;
    // other add.
    let newInput = clone(input);
    delete newInput.index;
    delete newInput.uuid;
    this.ws.send(JSON.stringify(newInput));
    // local state add.
    this.stateManager.addInput(input);
  }
}
