import { clone } from "lodash";
import { Input } from "../GameManagement/Input";
import { KeyPressEvent, registerKeyPressEventListener } from "../GameManagement/InputEventDriver";
import StateManager from "../GameManagement/StateManager";
import Time from "../Time";
import { PongState } from "./State/PongState";

export default class PongGame {
  public state: "open" | "closed" = "closed";
  private ws: WebSocket;
  private stateManager: StateManager;
  private ctx: CanvasRenderingContext2D;
  private time: Time;
  private uuid: String;
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
    };
    this.ws.onmessage = this.serverMessage;
    registerKeyPressEventListener(this.onKeyPress)
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
      requestAnimationFrame(this.runAndPaint);
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
    window.requestAnimationFrame(this.runAndPaint);
  }

  private onKeyPress(event: KeyPressEvent) {
    if(event.key == "up" || event.key == "down" || event.key == "left" || event.key == "right") {

    }else if(event.key == " ") {
        if(event.type == "on") {
            
        } else {

        }
    }
  }

  private onMouseEvent(mouseEvent, beforeMouseEvent) {

  }

  private sendInput(input: Input) {
    // other add.
    let newInput = clone(input);
    delete newInput.index;
    delete newInput.uuid;
    this.ws.send(JSON.stringify(newInput));
    // local state add.
    this.stateManager.addInput(input);
  }
}
