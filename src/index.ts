import GameManager from "./GameManagement/GameManager";
import GameState from "./GameManagement/GameState";

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
  if(startingTime == -1) {
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
