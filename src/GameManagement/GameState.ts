import { Input } from "./Input";

export default abstract class GameState {
  abstract render(ctx: CanvasRenderingContext2D): void;
  currentTick: number;
  abstract addInputs(inputs: Input[]):void;
  /**
   * Updates the game state by one tick.
   */
  abstract tick();
  /**
   * Returns a new, copied, special state,
   * guessing where the objects will be at a specific point in time between ticks.
   * Does not perform collision checks and does not mutate state.
   * This function specifically is only for allowing smooth redraws
   * to allow framerate not to be tied to tickrate. Don't use for updating the game.
   * @param deltaTimeMs
   * @returns GameState
   */
  abstract speculativePartialTick(deltaTimeMs: number): GameState;
}