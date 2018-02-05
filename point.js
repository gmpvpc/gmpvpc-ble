import { Coordinate } from "./coordinate";

export class Point{
    constructor(){
        this.accelero = new Coordinate();
        this.gyro = new Coordinate();
        this.magneto = new Coordinate();
    }
}