import SensorTagConnector from "./sensortag-connector";
import Coordinate from "../../model/coordinate";
import Point from "../../model/point";

/**
 * Calibration of a SensorTag
 */
export default class SensorTagCalibration {

    constructor(sensorTag, callback) {
        this.callback = callback;
        this.sensorTag = sensorTag;
        this.zero = new Point();
        this.zero.magnetometer = new Coordinate();
        this.accelerometerCoordinates = new Set();
        this.gyroscopeCoordinates = new Set();
    }

    get isCalibrated() {
        return this.zero.accelerometer !== null && this.zero.gyroscope !== null;
    }

    calibrateAccelerometer() {
        console.log("Calibrate Accelerometer...");
        let calibratePoints = (x, y, z) => {
            if (x === 0 && y === 0 && z === 0) {
                return;
            }
            this.accelerometerCoordinates.add(new Coordinate().fromXYZ(x, y, z));
            if (this.accelerometerCoordinates.size >= SensorTagConnector.CALIBRATION_POINTS) {
                clearInterval(interval);
                this.zero.accelerometer = this.calibrate(this.accelerometerCoordinates);
                console.log("Accelerometer Calibrated.");
                this.finishCalibration();
            }
        };
        let interval = setInterval(() => this.sensorTag.readAccelerometer((err, x, y, z) => calibratePoints(x, y, z)), SensorTagConnector.DEFAULT_PERIOD);
    }

    calibrateGyroscope() {
        console.log("Calibrate Gyroscope...");
        let calibratePoints = (x, y, z) => {
            if (x === 0 && y === 0 && z === 0) {
                return;
            }
            this.gyroscopeCoordinates.add(new Coordinate().fromXYZ(x, y, z));
            if (this.gyroscopeCoordinates.size >= SensorTagConnector.CALIBRATION_POINTS) {
                clearInterval(interval);
                this.zero.gyroscope = this.calibrate(this.gyroscopeCoordinates);
                console.log("Gyroscope Calibrated");
                this.finishCalibration();
            }
        };
        let interval = setInterval(() => this.sensorTag.readGyroscope((err, x, y, z) => calibratePoints(x, y, z)), SensorTagConnector.DEFAULT_PERIOD);
    }

    calibrate(coordinates) {
        let coordinate = new Coordinate();
        coordinates.forEach((item) => {
            coordinate.x += item.x;
            coordinate.y += item.y;
            coordinate.z += item.z;
        });
        coordinate.x /= coordinates.size;
        coordinate.y /= coordinates.size;
        coordinate.z /= coordinates.size;
        return coordinate;
    }

    finishCalibration() {
        if (!this.isCalibrated) {
            return;
        }
        this.callback(this.zero);
    }
}