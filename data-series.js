import {Point} from "./point";

/**
 * Cette classe permet de stocker l'ensemble des points collectés dans un tableau d'objets
 * On ajoute une donnée (accelero, gyro ou magneto) en utilisant les fonctions ci-dessous pour tester si
 * le point est complet
 */
export class DataSeries{
    constructor(callback) {
        this.points = [];
        this.cursor = 0;
        // this.observer = callback;
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

    /**
     * Cette fonction permet de notifier l'observeur (Socket-IO)
     */
    isPointComplete() {
        if(this.points[this.cursor] === undefined)
            this.points[this.cursor] = new Point();

        if(!this.points[this.cursor].accelero.isEmpty() &&
            !this.points[this.cursor].gyro.isEmpty() &&
            !this.points[this.cursor].magneto.isEmpty()) {

            setTimeout(() => { this.observer() }, 1);

            this.cursor++;
            this.points[this.cursor] = new Point();
        }
    }

    getCurrentPoint(){
        return this.points[this.cursor];
    }
}