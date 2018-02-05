export class Coordinate {
    constructor(){
        this.x = null;
        this.y = null;
        this.z = null;
    }

    isEmpty() {
        return this.x === null;
    }

    fromXYZ(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}