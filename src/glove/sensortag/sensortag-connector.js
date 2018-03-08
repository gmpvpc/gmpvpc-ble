import SensorTag from 'sensortag/lib/sensortag';
import SensorType from '../../model/sensor-type';
import Coordinate from "../../model/coordinate";
import Point from "../../model/point";
import SensorTagCalibration from "./sensortag-calibration";

/**
 * Connect a new Sensor Tag
 */
export default class SensorTagConnector {
    constructor(gloveUuid, callback) {
        this.sensorTag = null;
        this.gloveUuid = gloveUuid;
        this.zero = null;
        this.currentPoint = new Point();
        this.currentPointTimeStamp = Date.now();
        this.callback = callback;
        this.sensorTagCalibration = null;
        this.connect();
    }

    connect() {
        console.log("Try to discover: " + this.gloveUuid);
        SensorTag.discoverById(this.gloveUuid, (sensorTag) => {
            this.sensorTag = sensorTag;
            this.sensorTagCalibration = new SensorTagCalibration(sensorTag, (zero) => this.calibration(zero));
            console.log("Discovered: " + this.gloveUuid);
            this.initSensorTag();
        });
    };

    disconnect() {
        this.sensorTag.disconnect(() => console.log("SensorTag try to disconnect!"));
        this.sensorTag = null;
        this.sensorTagCalibration = null;
    };

    initSensorTag() {
        console.log("InitSensorTag: " + this.gloveUuid);
        this.sensorTag.once('disconnect', () => console.log("SensorTag disconnected."));
        this.sensorTag.connectAndSetUp((err) => {
            this.logError(err);
            console.log("SensorTag connected: " + this.sensorTag.uuid);
            this.enableAccelerometer();
            this.enableGyroscope();
            this.enableMagnetometer();
        });
    };

    enableAccelerometer() {
        console.log("Enable Accelerometer ...");
        this.sensorTag.enableAccelerometer((err) => {
            this.logError(err);
            this.sensorTag.setAccelerometerPeriod(SensorTagConnector.DEFAULT_PERIOD, (err) => {
                this.logError(err);
                (() => this.sensorTagCalibration.calibrateAccelerometer())();
            });
        });
    };

    enableGyroscope() {
        console.log("Enable Gyroscope ...");
        this.sensorTag.enableGyroscope((err) => {
            this.logError(err);
            this.sensorTag.setGyroscopePeriod(SensorTagConnector.DEFAULT_PERIOD, (err) => {
                this.logError(err);
                (() => this.sensorTagCalibration.calibrateGyroscope())();
            });
        });
    };

    enableMagnetometer() {
        console.log("Enable Magnetometer ...");
        this.sensorTag.enableMagnetometer((err) => {
            this.logError(err);
            console.log("Magnetometer enabled.");
            console.log("SetMagnetometerPeriod ...");
            this.sensorTag.setMagnetometerPeriod(SensorTagConnector.DEFAULT_PERIOD, (err) => {
                this.logError(err);
                console.log("MagnetometerPeriod set.");
            });
        });
    };

    startDataRetrieval() {
        this.sensorTag.notifyMPU9250((err) => this.logError(err));
        this.sensorTag.on('accelerometerChange', (x, y , z) => this.addCoordinateToCurrentPoint(SensorType.ACCELEROMETER, new Coordinate().fromXYZ(x, y , z)));
        this.sensorTag.on('gyroscopeChange', (x, y , z) => this.addCoordinateToCurrentPoint(SensorType.GYROSCOPE, new Coordinate().fromXYZ(x, y , z)));
        this.sensorTag.on('magnetometerChange', (x, y , z) => this.addCoordinateToCurrentPoint(SensorType.MAGETOMETER, new Coordinate().fromXYZ(x, y , z)));
    };

    calibration(zero) {
        this.zero = zero;
        this.startDataRetrieval();
    };

    addCoordinateToCurrentPoint(sensorType, coordinate) {
        if (this.currentPointTimeStamp - Date.now() > SensorTagConnector.DEFAULT_PERIOD || this.currentPoint.isValid()) {
            this.currentPoint = new Point();
            this.currentPointTimeStamp = Date.now();
        }
        switch (sensorType) {
            case SensorType.ACCELEROMETER: {
                this.currentPoint.accelerometer = coordinate;
                break;
            }
            case SensorType.GYROSCOPE: {
                this.currentPoint.gyroscope = coordinate;
                break;
            }
            case SensorType.MAGETOMETER: {
                this.currentPoint.magnetometer = coordinate;
                break;
            }
        }
        if (this.currentPoint.isValid()) {
            this.callback(this.currentPoint.calibrate(this.zero));
        }
    };

    logError(err) {
        if (err !== undefined && err !== null) {
            console.log("Error: " + err);
        }
    };
}

SensorTagConnector.DEFAULT_PERIOD = 100;
SensorTagConnector.CALIBRATION_POINTS = 20;