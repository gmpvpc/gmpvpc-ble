import SensorTag from 'sensortag/lib/sensortag';
import logger from '~/utils/logger'
import SensorType from '~/models/sensor-type';
import Coordinate from "~/models/coordinate";
import Point from "~/models/point";
import SensorTagCalibration from "./sensortag-calibration";

/**
 * Connect a new Sensor Tag
 */
export default class SensorTagConnector {
    constructor(gloveUuid, calibratedCallback, dataRetrievalCallback) {
        this.sensorTag = null;
        this.zero = null;
        this.sensorTagCalibration = null;
        this.gloveUuid = gloveUuid;
        this.currentPoint = new Point();
        this.currentPointTimeStamp = Date.now();
        this.dataRetrievalCallback = dataRetrievalCallback;
        this.calibratedCallback = calibratedCallback;
        this.connect();
    }

    connect() {
        logger.log("Try to discover: " + this.gloveUuid);
        SensorTag.discoverById(this.gloveUuid, (sensorTag) => {
            this.sensorTag = sensorTag;
            this.initSensorTag();
            logger.log("Discovered: " + this.gloveUuid);
        });
    }

    disconnect() {
        this.sensorTag.disconnect(() => console.log("SensorTag try to disconnect!"));
        this.sensorTag = null;
        this.sensorTagCalibration = null;
    }

    initSensorTag() {
        logger.log("Initialize SensorTag: " + this.gloveUuid);
        this.sensorTagCalibration = new SensorTagCalibration(this.sensorTag, (zero) => this.calibration(zero));
        this.sensorTag.once('disconnect', () => console.log("SensorTag disconnected."));
        this.sensorTag.connectAndSetUp((err) => {
            SensorTagConnector.logError(err);
            console.log("SensorTag connected: " + this.sensorTag.uuid);
            this.enableSensors();
        });
    }

    enableSensors() {
        logger.log("Enable MPU9250 ...");
        ((callback) => this.sensorTag.enableMPU9250(0x0007 | 0x0238 | 0x0040, callback))((err) => {
            SensorTagConnector.logError(err);
            logger.log("MPU9250 enabled.");
            logger.log("MPU9250 set period ...");
            ((callback) => this.sensorTag.setMPU9250Period(SensorTagConnector.DEFAULT_PERIOD, callback))((err) => {
                SensorTagConnector.logError(err);
                logger.log("MPU9250 set period done.");
                this.sensorTagCalibration.calibrate(SensorType.ACCELEROMETER, (callback) => this.sensorTag.readAccelerometer(callback));
                this.sensorTagCalibration.calibrate(SensorType.GYROSCOPE, (callback) => this.sensorTag.readGyroscope(callback));
            });
        });
    }

    startDataRetrieval() {
        logger.log("Enable data retrieval ...");
        this.sensorTag.notifyMPU9250((err) => SensorTagConnector.logError(err));
        this.sensorTag.on('accelerometerChange', (x, y, z) => this.addCoordinateToCurrentPoint(SensorType.ACCELEROMETER, new Coordinate().fromXYZ(x, y, z)));
        this.sensorTag.on('gyroscopeChange', (x, y, z) => this.addCoordinateToCurrentPoint(SensorType.GYROSCOPE, new Coordinate().fromXYZ(x, y, z)));
        this.sensorTag.on('magnetometerChange', (x, y, z) => this.addCoordinateToCurrentPoint(SensorType.MAGETOMETER, new Coordinate().fromXYZ(x, y, z)));
        logger.log("Data retrieval enabled");
        this.calibratedCallback(this.gloveUuid);
    }

    calibration(zero) {
        logger.log("Calibration ended: " + JSON.stringify(zero));
        this.zero = zero;
        this.startDataRetrieval();
    }

    addCoordinateToCurrentPoint(sensorType, coordinate) {
        if (this.currentPointTimeStamp - Date.now() > SensorTagConnector.DEFAULT_PERIOD || this.currentPoint.isValid()) {
            this.currentPoint = new Point();
            this.currentPointTimeStamp = Date.now();
        }
        this.currentPoint.set(sensorType, coordinate);
        if (this.currentPoint.isValid()) {
            this.dataRetrievalCallback(this.currentPoint.calibrate(this.zero));
        }
    }

    static logError(err) {
        if (err !== undefined && err !== null) {
            logger.log("Error: " + err);
        }
    }
}

SensorTagConnector.DEFAULT_PERIOD = 100;
SensorTagConnector.CALIBRATION_POINTS = 20;