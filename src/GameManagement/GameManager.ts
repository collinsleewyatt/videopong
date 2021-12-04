import { cloneDeep } from "lodash";
import {v4 as uniqueId} from "uuid";
import GameState from "./GameState";
import { isKeyDown } from "./InputEventDriver";
const config = require("../../config/protocol");
export interface Input {
  data: any;
  index: number; // the index of the current input. Ensures that the list can be ordered in a consistent way
  // so if two inputs come at the same time, we are able to order them to prevent a desynchronization.
  onTick: number; // the tick that input occured on.
  type: string;
}
/**
 * Fuck you.
 * rollback - deletes states after, then runs to a specific time.
 * update - updates to a time in history.
 * getStateIndexBefore
 * getButtonPressIndexBefore
 * getStateAt() - gets the state at some point in the future.
 * // this will update the state to the nearest tick, then speculatively return a copy of state at that particular millisecond.
 */
export default class GameManager {
  states: GameState[] = [];
  inputs: Input[] = [];
  constructor() {
    this.states.push(new GameState(0));
  }

  /**
   * Pushes new states onto this.states up to the tick right before or on the timestamp.
   * @param timestamp
   */
  private updateToTick(toTick: number) {
    if (this.states.length == 0) {
      throw new Error("No state to update from?");
    }
    // creating new states until we arrive at the next tick.
    while (this.states.at(-1).currentTick < toTick) {
      let newState;
      // if the tick is not divisible by ten, assign by reference, otherwise, copy.
      // prevents too much cloning.
      if(this.states.at(-1).currentTick % 10 != 0) {
        newState = this.states.at(-1);
        // get rid of it, then we'll update it and put it back on.
        this.states.pop();
      }else {
        newState = cloneDeep(this.states.at(-1));
      }
      while(newState.currentTick != toTick) {
        newState.tick();
        newState.addInputs(this.getAllInputsFromTick(newState.currentTick));
      }
      this.states.push(newState);
    }
  }

  private rollback(baseTick: number, endingTick: number) {
    // first, deleting states:
    // deletionIndex is the first state we need to delete according to baseTick.
    // we will delete all ticks after baseTick, but not the tick at baseTick.
    let deletionIndex = this.states.findIndex((item: GameState) => {
      return item.currentTick > baseTick;
    });
    // deleting all states after that index.
    this.states.splice(deletionIndex, this.states.length - deletionIndex);
    // now, updating the state to runTo:
    this.updateToTick(endingTick);
  }

  getAllInputsFromTick(tick: number): Input[] {
    // TODO this won't affect performance this much but I should change it to something not in O(n).
    return this.inputs.filter((input) => {
      return input.onTick == tick;
    });
  }

  /**
   * Adds an input to the current input total, and rolls back the state if neccesary.
   */
  addInput(input: Input) {
    // this if statement prevents rolling back if the input array wouldn't be changed by
    // this new input, eg. if the inputs are the same.
    // this scenario is possible: whenever the client sends an input to the server, it stores
    // its own input locally and immediately, guessing the index to be this.inputs.length.
    // however, this may not be the case
    // (if the server recieved another input right as the local client pressed the key, then that other clients button press would take that slot
    // and the local clients' button press would be moved to this.inputs.length + 1)
    // the server sends the clients' own input back to them, and usually our speculative guess that we're in the right spot will be right.
    // so we don't need to rollback if we don't change anything.
    // but, in the case that we're not in the right spot and the authoritative server corrects us with a new input, then we need to
    // change our guess and roll back.
    if (this.inputs[input.index] != input) {
      this.inputs[input.index] = input;
      this.rollback(input.onTick, this.states.at(-1).currentTick)
    }

    // commenting this out because I'm using a new system.
    /*
    let index = this.inputs.findIndex((element: Input) => {
      return element.timestamp > input.timestamp;
    });
    // pushing onto the end of the array if find returns a -1.
    // This is neccesary to prevent things from getting out of order at case 1 or case 2 (1 or 2 elements in the arr.)
    if (index === -1) {
      this.inputs.push(input);
    } else {
      // placing an element in right after 'index'.
      this.inputs.splice(index, 0, input);
    }*/
  }

  /**
   * @param timestamp
   */
  getStateAt(timestamp: number) {
    /**
     * This function will create new states based on ticks right before if neccesary,
     * then will speculatively execute the state based on a certain number of milliseconds after
     * the tick.
     * That speculative state returned by this function only moves and rotates objects and does not perform collision detections or other game code.
     * This implementation allows us to have our game tickrate be seperate from our framerate.
     * So I can have a tickrate of 30tps, and still have smooth moving objects.
     */
    let toTick = Math.floor(timestamp / config.tickrate);
    if(isKeyDown("w")) {
      this.addInput({
        onTick: toTick,
        type: "addCharacter",
        data: {
          uuid: uniqueId(),
          location: {
            x: Math.random() * 400,
            y: Math.random() * 400
          }
        },
        index: this.inputs.length
      })
    }
    if(isKeyDown("d")) {
      this.addInput({
        onTick: toTick,
        type: "changeTarget",
        data: {
          uuid: "3",
          location: {
            x: 1.3,
            y: 1.3
          }
        },
        index: this.inputs.length
      })
    }
    // represents how many ms are between the last tick we update to and the time we requested.
    let deltaTime = timestamp - (toTick * config.tickrate);
    // updating to the latest tick that we want.
    this.updateToTick(toTick);
    // smoothing things out, giving a speculative tick so objects move smoothly:
    return this.states.at(-1).speculativePartialTick(deltaTime);
  }

  removeAllStatesBefore(timestamp: number) {}

}
