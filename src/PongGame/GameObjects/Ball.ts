import Laser from "./Laser";
import MovingObject from "./MovingObject";
interface coordinatePair {
    x: number;
    y: number;
}

export default class Ball extends MovingObject {
    x = 100;
    y = 100;
    size = 20;
    angle = 0;
    geometry: coordinatePair[] = [{x: 0, y: 0}];
    strokeStyle: string = "white";
    fillStyle: string = "white";
    frozenFor: number = 0;
    constructor(uuid?:string) {
        super(uuid);
        this.velX += 10
        this.velY += 10
    }
    update(): void {
        if(this.frozenFor > 0) {
            this.frozenFor -= 1;
            return;
        }
        // dvd-logo bounce effect
        if(this.x < (0 + this.size) && this.velX < 0) {
            this.velX = -this.velX
        }
        //         canvas size
        if(this.x > (800 - this.size) && this.velX > 0) {
            this.velX = -this.velX
        }
        if(this.y < (0 + this.size) && this.velY < 0) {
            this.velY = -this.velY
        }
        //         canvas size
        if(this.y > (600 - this.size) && this.velY > 0) {
            this.velY = -this.velY
        }
        this.velX /= 1.06;
        this.velY /= 1.06;
        // more slowing when it is smaller
        if(Math.abs(this.velX) < .5) {
            this.velX /= 1.5
        }
        if(Math.abs(this.velY) < .5) {
            this.velY /= 1.5            
        }
    
    }
    
    shouldBeRemoved(): boolean {
        return false;
    }

    collided(other: MovingObject) {
        if(other instanceof Laser) {
            // javascript cannot do exponents of negative numbers so we have this as a workaround.
            let signX = Math.sign(other.velX);
            let signY = Math.sign(other.velY);
            this.velX += signX * Math.pow(Math.abs(other.velX), 1.2);
            this.velY += signY * Math.pow(Math.abs(other.velY), 1.2);
            this.frozenFor = other.intensity * 20 - 12;
        }
        
    }

    move(deltaTime: number) {
        if(this.frozenFor <= 0) {
            super.move(deltaTime);
        }
    }
    
}