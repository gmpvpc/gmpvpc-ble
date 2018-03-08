/**
 * Cette classe représente une coordonnée tridimensionnelle
 */
export class Coordinate {
    constructor(){
        this.x = null;
        this.y = null;
        this.z = null;
    }

    calibrate(zero) {
        this.x -= zero.x;
        this.y -= zero.y;
        this.z -= zero.z;
        return this;
    }

    isEmpty() {
        return this.x === null;
    }

    fromXYZ(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
}