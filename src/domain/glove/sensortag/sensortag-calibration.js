import logger from '~/utils/logger'
import Coordinate from "~/models/coordinate";
import Point from "~/models/point";
import SensorType from "~/models/sensor-type";
import SensorTagConnector from "./sensortag-connector";

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

    calibrate(sensorType, readCallback) {
        logger.log("Calibrate " + sensorType + "...");
        let calibratePoints = (err, x, y, z) => {
            if (x === 0 && y === 0 && z === 0) {
                return;
            }
            this.coordinates(sensorType).add(new Coordinate().fromXYZ(x, y, z));
            if (this.coordinates(sensorType).size >= SensorTagConnector.CALIBRATION_POINTS) {
                clearInterval(interval);
                this.zero.set(sensorType, this.calcAvg(this.coordinates(sensorType)));
                logger.log(sensorType + " Calibrated.");
                this.finishCalibration();
            }
        };
        let interval = setInterval(() => readCallback(calibratePoints), SensorTagConnector.DEFAULT_PERIOD);
    }

    coordinates(sensorType) {
        switch (sensorType) {
            case SensorType.ACCELEROMETER: {
                return this.accelerometerCoordinates;
            }
            case SensorType.GYROSCOPE: {
                return this.gyroscopeCoordinates;
            }
            default: {
                return null;
            }
        }
    }

    calcAvg(coordinates) {
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