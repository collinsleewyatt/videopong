import GameState from "./GameState";
interface Input { press: string; uuid: string; timestamp: number };

export default class GameManager {
  states: GameState[] = [];
  inputs: Input[] = [];
  constructor() {}

  private updateTo(timestamp: number) {
    
  }

  private rollback(deleteTimestampsAfter: number, runTo: number) {
    // first, deleting states:
    // deletionIndex is the first state we need to delete according to deleteTimestampsAfter
    let deletionIndex = this.states.findIndex((item: GameState) => {
      return item.timestamp > deleteTimestampsAfter;
    });
    // deleting all states after that index.
    this.states.splice(deletionIndex, this.states.length - deletionIndex);
    // now, updating the state to runTo:
    this.updateTo(runTo);
  }

  private getStateIndexRightBeforeTimestamp(timestamp: number) {
    let currentIndex = this.states.length - 1;
    // This loop decrements the currentIndex until
    // it's where the state at the current index's timestamp is the first one less than the target timestamp.
    while (
      this.states[currentIndex].timestamp < timestamp &&
      // checking in case currentIndex = this.states.length - 1
      // (aka, we're at the last element in the state)
      (this.states[currentIndex + 1] === undefined ||
        this.states[currentIndex + 1].timestamp > timestamp)
    ) {
      // usually this while loop will never run, and currentIndex will equal this.states.length - 1.
      // in case we're asking to rollback, we need this loop.
      currentIndex -= 1;
    }
    // then we need to purge all states ahead of the timestamp we want.
    if (currentIndex < this.states.length - 1) {
    }
    this.states.splice(currentIndex + 1, currentIndex + 1);
  }
  /**
   * Adds an input to the current input total, and rolls back the state if neccesary.
   */
  addInput(key: Input) {
    let index = this.inputs.findIndex(
      (element: Input) => {
        return element.timestamp > key.timestamp;
      }
    );
    if(index === -1) {
        this.inputs.push(key);
    }else {
        this.inputs.splice(index, 0, key);
    }
  }
  getStateAt(timestamp: number) {}
  getCurrentTimestamp(): number {
    return 0;
  }
}