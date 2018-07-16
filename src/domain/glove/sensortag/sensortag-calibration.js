import Coordinate from "~/models/coordinate";
import Point from "~/models/point";
import SensorType from "~/models/sensor-type";
import LogFormat from "~/utils/log-format";
import config from "~/config";

/**
 * Calibration of a SensorTag
 */
export default class SensorTagCalibration extends LogFormat {

    constructor(sensorTag, callback) {
        super("SensorTagCalibration");
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
        this.log(this.sensorTag.uuid, `Calibrate ${sensorType}...`);
        let calibratePoints = (err, x, y, z) => {
            if (x === 0 && y === 0 && z === 0) {
                return;
            }
            this.coordinates(sensorType).add(new Coordinate().fromXYZ(x, y, z));
            if (this.coordinates(sensorType).size >= config.glove.calibrationPoint) {
                clearInterval(interval);
                this.zero.set(sensorType, this.calcAvg(this.coordinates(sensorType)));
                this.log(this.sensorTag.uuid, `${sensorType} Calibrated.`);
                this.finishCalibration();
            }
        };
        let interval = setInterval(() => readCallback(calibratePoints), config.glove.defaultPeriod);
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