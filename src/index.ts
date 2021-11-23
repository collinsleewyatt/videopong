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

let state = new GameState(0);

game.onmousemove = (ev: MouseEvent) => {
  //star.target = {x: ev.offsetX, y: ev.offsetY}
};

let previousTime = 0;
function runAndPaint(time) {
  document.getElementById("info").innerHTML = "" + (time - previousTime);
  previousTime = time;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 800, 600);
  state.simulate(time);
  state.render(ctx);
  window.requestAnimationFrame(runAndPaint);
}

window.requestAnimationFrame(runAndPaint);
