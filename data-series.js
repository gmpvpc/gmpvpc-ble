import {Point} from "./point";

export class DataSeries{
    constructor(callback) {
        this.points = [];
        this.cursor = 0;
        this.callback = callback;
    }

    addAccelero(x,y,z) {
        this.isPointComplete();
        this.points[this.cursor].accelero.fromXYZ(x,y,z);
    }

    addGyro(x,y,z) {
        this.isPointComplete();
        this.points[this.cursor].gyro.fromXYZ(x,y,z);
    }

    addMagneto(x,y,z) {
        this.isPointComplete();
        this.points[this.cursor].magneto.fromXYZ(x,y,z);
    }

    isPointComplete() {
        if(this.points[this.cursor] === undefined)
            this.points[this.cursor] = new Point();

        if(!this.points[this.cursor].accelero.isEmpty() &&
            !this.points[this.cursor].gyro.isEmpty() &&
            !this.points[this.cursor].magneto.isEmpty()) {

            setTimeout(() => { this.callback() }, 1);

            this.cursor++;
            this.points[this.cursor] = new Point();
        }
    }

    getCurrentPoint(){
        return this.points[this.cursor];
    }
}