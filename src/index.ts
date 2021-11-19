import Laser from "./GameObjects/Laser";
import MovingObject from "./GameObjects/MovingObject";
import Starship from "./GameObjects/Starship";
import isKeyDown from "./Keyboard";

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



let objects:MovingObject[] = [new Starship()];
let star:Starship = objects[0] as Starship;

game.onmousemove = (ev: MouseEvent) => {
  star.target = {x: ev.offsetX, y: ev.offsetY}
};

function runAndPaint(time) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 800, 600);
  if(isKeyDown("a")) {
    star.velX -= .25;
  }
  if(isKeyDown("d")) {
    star.velX += .25;
  }
  if(isKeyDown("w")) {
    star.velY -= .25;
  }
  if(isKeyDown("s")) {
    star.velY += .25;
  }
  if(isKeyDown(" ")) {
    if(objects.length < 2 || true) {
      objects.push(new Laser(star.x, star.y, Math.cos(star.angle - Math.PI / 2) * 10, Math.sin(star.angle - Math.PI / 2) * 10))
    }
  }
  // loop through every object in play
  for(let object of objects) {
    if(object instanceof Laser) {
      if((object as Laser).shouldBeRemoved()) {
        objects.splice(objects.indexOf(object), 1);
      }
    }
    object.update();
    object.render(ctx);
  }
  window.requestAnimationFrame(runAndPaint);
};

window.requestAnimationFrame(runAndPaint);
