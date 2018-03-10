import SensorType from "./sensor-type";

/**
 * Cette classe permet de stocker l'ensemble des données retournées par les trois capteurs au même endroit
 * Pour chaque "point", on aura 3 jeux de données: des valeurs pour l'accéleromètre, le gyroscope et le magnétomètre
 */
export default class Point {
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

    set(sensorType, value) {
        switch (sensorType) {
            case SensorType.ACCELEROMETER:
                this.accelerometer = value;
                break;
            case SensorType.GYROSCOPE:
                this.gyroscope = value;
                break;
            case SensorType.MAGETOMETER:
                this.magnetometer = value;
                break;
        }
        return this;
    }
}