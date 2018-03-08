/**
 * Cette classe permet de stocker l'ensemble des données retournées par les trois capteurs au même endroit
 * Pour chaque "point", on aura 3 jeux de données: des valeurs pour l'accéleromètre, le gyroscope et le magnétomètre
 */
export class Point {
    constructor() {
        this.accelerometer = null;
        this.gyroscope = null;
        this.magnetometer = null;
    }

    isValid() {
        return this.accelerometer !== null && this.gyroscope !== null && this.magnetometer !== null;
    }

    calibrate(zero) {
        this.accelerometer.calibrate(zero.accelerometer);
        this.gyroscope.calibrate(zero.gyroscope);
        this.magnetometer.calibrate(zero.magnetometer);
        return this;
    }
}