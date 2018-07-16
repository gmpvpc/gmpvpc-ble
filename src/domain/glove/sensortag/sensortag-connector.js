import SensorTag from 'sensortag/lib/sensortag';
import SensorType from '~/models/sensor-type';
import Coordinate from "~/models/coordinate";
import Point from "~/models/point";
import SensorTagCalibration from "./sensortag-calibration";
import LogFormat from "~/utils/log-format";
import config from "~/config";

/**
 * Connect a new Sensor Tag
 */
export default class SensorTagConnector extends LogFormat {
    constructor(gloveUuid, calibratedCallback, dataRetrievalCallback) {
        super("SensorTagConnector");
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
        this.log(this.gloveUuid, `Try to discover...`);
        SensorTag.discoverById(this.gloveUuid, (sensorTag) => {
            this.sensorTag = sensorTag;
            this.initSensorTag();
            this.log(this.gloveUuid, `Discovered.`);
        });
    }

    disconnect() {
        this.sensorTag.disconnect(() => this.log(this.gloveUuid, "SensorTag try to disconnect!"));
        this.sensorTag = null;
        this.sensorTagCalibration = null;
    }

    initSensorTag() {
        this.log(this.gloveUuid, "Initialize SensorTag...");
        this.sensorTagCalibration = new SensorTagCalibration(this.sensorTag, (zero) => this.calibration(zero));
        this.sensorTag.once('disconnect', () => this.log(this.gloveUuid, "SensorTag disconnected."));
        this.sensorTag.connectAndSetUp((err) => {
            this.logError(err);
            this.log(this.gloveUuid, `SensorTag connected.`);
            this.enableSensors();
        });
    }

    enableSensors() {
        this.log(this.gloveUuid, "Enable MPU9250 ...");
        ((callback) => this.sensorTag.enableMPU9250(0x0007 | 0x0238 | 0x0040, callback))((err) => {
            this.logError(err);
            this.log(this.gloveUuid, "MPU9250 enabled.");
            this.log(this.gloveUuid, "MPU9250 set period ...");
            ((callback) => this.sensorTag.setMPU9250Period(config.glove.defaultPeriod, callback))((err) => {
                this.logError(err);
                this.log(this.gloveUuid, "MPU9250 set period done.");
                this.sensorTagCalibration.calibrate(SensorType.ACCELEROMETER, (callback) => this.sensorTag.readAccelerometer(callback));
                this.sensorTagCalibration.calibrate(SensorType.GYROSCOPE, (callback) => this.sensorTag.readGyroscope(callback));
            });
        });
    }

    startDataRetrieval() {
        this.log(this.gloveUuid, "Enable data retrieval ...");
        this.sensorTag.notifyMPU9250((err) => this.logError(err));
        this.sensorTag.on('accelerometerChange', (x, y, z) => this.addCoordinateToCurrentPoint(SensorType.ACCELEROMETER, new Coordinate().fromXYZ(x, y, z)));
        this.sensorTag.on('gyroscopeChange', (x, y, z) => this.addCoordinateToCurrentPoint(SensorType.GYROSCOPE, new Coordinate().fromXYZ(x, y, z)));
        this.sensorTag.on('magnetometerChange', (x, y, z) => this.addCoordinateToCurrentPoint(SensorType.MAGETOMETER, new Coordinate().fromXYZ(x, y, z)));
        this.log(this.gloveUuid, "Data retrieval enabled");
        this.calibratedCallback(this.gloveUuid);
    }

    calibration(zero) {
        this.log(this.gloveUuid, `Calibration ended: ${JSON.stringify(zero)}`);
        this.zero = zero;
        this.startDataRetrieval();
    }

    addCoordinateToCurrentPoint(sensorType, coordinate) {
        if (this.currentPointTimeStamp - Date.now() > config.glove.defaultPeriod || this.currentPoint.isValid()) {
            this.currentPoint = new Point();
            this.currentPointTimeStamp = Date.now();
        }
        this.currentPoint.set(sensorType, coordinate);
        if (this.currentPoint.isValid()) {
            this.dataRetrievalCallback(this.currentPoint.calibrate(this.zero));
        }
    }

    logError(err) {
        if (err !== undefined && err !== null) {
            this.log(this.gloveUuid, "Error: " + err);
        }
    }
}