/**
 * Cette classe représente une coordonnée tridimensionnelle
 */
export class Coordinate {
    constructor(){
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }

    calibrate(zero) {
        this.x -= zero.x;
        this.y -= zero.y;
        this.z -= zero.z;
        return this;
    }

    fromXYZ(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
}