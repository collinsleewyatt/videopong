export default abstract class MovingObject {

    x:number;
    y:number;
    velX: number;
    velY: number;
    abstract update():void;
    abstract render(ctx:CanvasRenderingContext2D):void;
    abstract collision(x: number, y: number):boolean;
    

}