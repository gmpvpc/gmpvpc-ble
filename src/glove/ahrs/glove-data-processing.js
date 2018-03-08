import AHRS from 'ahrs/index';
import Movement from "../../model/movement";

/**
 * Calculation of the movement attitude
 */
export default class GloveDataProcessing {
    constructor() {
        this.ahrs = new AHRS({
            sampleInterval: 20,
            algorithm: 'Madgwick',
            beta: 0.4,
            kp: 0.5,
            ki: 0
        });
    };

    process(point) {
        this.ahrs.update(point.gyroscope.x, point.gyroscope.y, point.gyroscope.z, point.accelerometer.x, point.accelerometer.y, point.accelerometer.z, point.magnetometer.x, point.magnetometer.y, point.magnetometer.z);
        return new Movement(this.ahrs.toVector(), this.ahrs.getQuaternion());
    };
}