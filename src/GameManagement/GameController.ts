/*
import GameState from "./GameState";

export class GameController {
	states: GameState[] = [];
	buttonPresses: ButtonPress[] = [];
	private addNewStateAfterTimestamp: number = 0;
	newStateCreationAfterMs = 0;
	deleteStatesAfterMs = 10000;
	lastKnownBUG = 0;

	constructor(context: CanvasRenderingContext2D, bgcontext: CanvasRenderingContext2D, timestamp: number) {
		this.states.push(new GameState(context, bgcontext));
		this.states[0].timestamp = timestamp;
	}

	updateTo(timestamp: number) {
		//First: find the states index, and the buttonPressesIndex.

		let statesIndex = this.findStateIndexBeforeTime(timestamp);
		let buttonPressesIndex = this.findFirstButtonPressIndexAfterTime(this.states[this.states.length - 1].timestamp);

		if (statesIndex == -1) {
			throw "An attempt to update gameState was created, but there was no reference state found to base the update off of.";
		}
		// Cuts all of the expired states.
		this.states.splice(statesIndex, this.states.length - statesIndex - 1);

		if (buttonPressesIndex == -1) {
			this.updateStateTo(timestamp);
			return;
		} else {
			for (let i = buttonPressesIndex; i < this.buttonPresses.length; i++) {
				this.updateStateTo(this.buttonPresses[i].timestamp);
				this.states[this.states.length - 1].addButtonPress(this.buttonPresses[i]);
			}
			this.updateStateTo(timestamp);
			return;
		}
	}

	addButtonPress(newButtonPress: ButtonPress) {
		for (let i = this.buttonPresses.length - 1; i >= 0; i--) {
			let currentButtonPress = this.buttonPresses[i];
			// Check to see if this is where we belong in the buttonPress array,
			if (currentButtonPress.timestamp < newButtonPress.timestamp) {
				// It is! splice it in.
				this.buttonPresses.splice(i + 1, 0, newButtonPress);
				console.log("Added Button Press: " + (i + 1));
				// And remove all expired states, so we can regenerate them in a second.
				this.removeStatesPastTime(newButtonPress.timestamp);
				// We do not update!
				return;
			}
		}

		if (this.buttonPresses.length == 0) {
			this.removeStatesPastTime(newButtonPress.timestamp);
			console.log("Added Button Press: 0");
			this.buttonPresses.push(newButtonPress);
		}
	}

	/**
	 * Deletes all states older than this.deleteStatesAfterMs in the past.
	 *\/
	private garbageCollectStates(): void {
		let mostRecentTimestamp = this.states[this.states.length - 1].timestamp;
		for (let i = 0; i < this.states.length; i++) {
			if (this.states[i].timestamp + this.deleteStatesAfterMs < mostRecentTimestamp) {
				this.states.splice(i, 1);
			} else {
				return;
			}
		}
	}

	private updateStateTo(timestamp: number): void {
		if (timestamp < this.addNewStateAfterTimestamp) {
			this.states[this.states.length - 1].updateTo(timestamp);
			document.getElementById("debug1").innerHTML = "";
		} else {
			// Create a new cloned state.
			let newState = cloneDeep(this.states[this.states.length - 1]);
			newState.updateTo(timestamp);
			this.states.push(newState);
			this.addNewStateAfterTimestamp = timestamp + this.newStateCreationAfterMs;
			this.garbageCollectStates();
			//document.getElementById("debug1").innerHTML = "asdf";
		}
	}

	public getMap(): Map {
		return this.states[this.states.length - 1].map;
	}

	public getObjects(): MovingObject[] {
		return this.states[this.states.length - 1].objects;
	}

	private removeStatesPastTime(timestamp: number) {
		for (let i = this.states.length - 1; i > 0; i--) {
			if (this.states[i].timestamp > timestamp) {
				this.states.pop();
			} else {
				return;
			}
		}
	}

	private findStateIndexBeforeTime(timestamp: number) {
		// This for loop finds the most recent state that was made BEFORE when we need to update to.
		// We loop through the array backwards because this.states is sorted from least to most timestamp.
		for (let i = this.states.length - 1; i >= 0; i--) {
			// Therefore, we're always able to get the most recent one because we break out of the for loop right after.
			if (this.states[i].timestamp <= timestamp) {
				return i;
			}
		}
		return -1;
	}

	private findFirstButtonPressIndexAfterTime(timestamp: number): number {
		let buttonPressesIndex = -1;
		for (let i = this.buttonPresses.length - 1; i >= 0; i--) {
			if (this.buttonPresses[i].timestamp >= timestamp) {
				buttonPressesIndex = i;
			} else {
				return buttonPressesIndex;
			}
		}
		return buttonPressesIndex;
	}
}
*/