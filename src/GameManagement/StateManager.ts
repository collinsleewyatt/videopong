import { cloneDeep } from "lodash";
import GameState from "./GameState";
import { Input } from "./Input";

/**
 * rollback - deletes states after, then runs to a specific time.
 * update - updates to a time in history.
 * getStateIndexBefore
 * getButtonPressIndexBefore
 * getStateAt() - gets the state at some point in the future.
 * // this will update the state to the nearest tick, then speculatively return a copy of state at that particular millisecond.
 */
export default class GameManager {
  private states: GameState[] = [];
  private inputs: Input[] = [];
  constructor(initialState: GameState) {
    this.states.push(initialState);
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
      // This prevents the computer from blowing up, because now we copy objects every 10 frames,
      // and not every frame.
      if (this.states.at(-1).currentTick % 10 != 0) {
        newState = this.states.at(-1);
        // get rid of it, then we'll update it and put it back on.
        this.states.pop();
      } else {
        newState = cloneDeep(this.states.at(-1));
      }
      while (newState.currentTick != toTick) {
        newState.tick();
        newState.addInputs(this.getAllInputsFromTick(newState.currentTick));
      }
      this.states.push(newState);
    }
  }
  private garbageCollect(beforeTick: number) {
    return;
    while (this.states[0].currentTick < beforeTick && this.states.length > 2) {
      //don't ever delete the first state!!!
      this.states.splice(1, 1);
    }
  }
  private rollback(baseTick: number, endingTick: number) {
    // if this input happens in the future, we don't need to rollback:
    if (this.states.at(-1).currentTick < baseTick) {
      return;
    }
    // first, deleting states:
    // deletionIndex is the first state we need to delete according to baseTick.
    // we will delete all ticks after baseTick, but not the tick at baseTick.
    let deletionIndex = this.states.findIndex((item: GameState) => {
      return item.currentTick >= baseTick;
    });
    // deleting all states after that index.
    this.states.splice(deletionIndex, this.states.length - deletionIndex);
    // now, updating the state to runTo:
    this.updateToTick(endingTick);
  }

  private getAllInputsFromTick(tick: number): Input[] {
    // TODO this won't affect performance this much but I should change it to something not in O(n).
    return this.inputs.filter((input) => {
      return input.onTick == tick;
    });
  }

  public getMostRecentTick(): number {
    return this.states.at(-1).currentTick;
  }

  /**
   * Adds an input to the current input total, and rolls back the state if neccesary.
   * @param input, the complete input to add.
   */
  public addInput(input: Input) {
    console.log(input);
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
      if (input.onTick <= 0) {
        return;
      }
      if(input.index == undefined) {
        // adding the index back in, it's an optional parameter because
        // we use the input interface to send button presses to the server.
        input.index = this.inputs.length;
      }
      this.inputs[input.index] = input;
      this.rollback(input.onTick, this.states.at(-1).currentTick);
    }
  }

  /**
   * @param timestamp, in milliseconds.
   * @returns a new GameState object at that point in time.
   */
  getStateAt(timestamp: number): GameState {
    /**
     * This function will create new states based on ticks right before if neccesary,
     * then will speculatively execute the state based on a certain number of milliseconds after
     * the tick.
     * That speculative state returned by this function only moves and rotates objects and does not perform collision detections or other game code.
     * This implementation allows us to have our game tickrate be seperate from our framerate.
     * So I can have a tickrate of 30tps, and still have smooth moving objects.
     */
    let toTick = Math.floor(timestamp / 30);
    // represents how many ms are between the last tick we update to and the time we requested.
    let deltaTime = timestamp - toTick * 30;
    // updating to the latest tick that we want.
    this.updateToTick(toTick);
    this.garbageCollect(toTick - 300);
    // smoothing things out, giving a speculative tick so objects move smoothly:
    return this.states.at(-1).speculativePartialTick(deltaTime);
  }
}
