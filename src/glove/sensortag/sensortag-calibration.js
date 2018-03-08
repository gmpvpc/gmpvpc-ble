import SensorTagConnector from "./sensortag-connector";
import {Coordinate} from "../../model/coordinate";
import {Point} from "../../model/point";

export default class SensorTagCalibration {

    constructor(sensorTag, callback) {
        this.callback = callback;
        this.sensorTag = sensorTag;
        this.zero = new Point();
        this.accelerometerCoordinates = new Set();
        this.gyroscopeCoordinates = new Set();
        this.magnetometerCoordinates = new Set();
    }

    get isCalibrated() {
        return this.zero.accelerometer !== null && this.zero.gyroscope !== null && this.zero.magnetometer !== null;
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

    calibrateMagnetometer() {
        console.log("Calibrate Magnetometer...");
        let calibratePoints = (x, y, z) => {
            if (x === 0 && y === 0 && z === 0) {
                return;
            }
            console.log("Magnetometer calibration point(" + this.magnetometerCoordinates.size + "):" + "\t" + x + "\t" + y + "\t" + z);
            this.magnetometerCoordinates.add(new Coordinate().fromXYZ(x, y, z));
            if (this.magnetometerCoordinates.size >= SensorTagConnector.CALIBRATION_POINTS) {
                clearInterval(interval);
                this.zero.magnetometer = this.calibrate(this.magnetometerCoordinates);
                console.log("Magnetometer Calibrated.");
                this.finishCalibration();
            }
        };
        let interval = setInterval(() => this.sensorTag.readMagnetometer((err, x, y, z) => calibratePoints(x, y, z)), SensorTagConnector.DEFAULT_PERIOD);
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
        (() => {
            this.callback.zero = this.zero;
            this.callback.startDataRetrieval();
        })();
    }
}