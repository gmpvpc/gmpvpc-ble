import AHRS from 'ahrs/index';
import Movement from "../../model/movement";
import MathExt from "../../utils/math-extension.js"

/**
 * Calculation of the movement attitude
 */
export default class GloveDataProcessing {

    /**
     * Constructor
     * @param frequency the frequency used in hertz
     */
    constructor(frequency) {
        this.ahrs = new AHRS({
            sampleInterval: frequency,
            algorithm: 'Madgwick',
            beta: 0.4,
            kp: 0.5,
            ki: 0
        });
    };

    process(point) {
        this.ahrs.update(
            MathExt.toRadian(point.gyroscope.x),
            MathExt.toRadian(point.gyroscope.y),
            MathExt.toRadian(point.gyroscope.z),
            point.accelerometer.x,
            point.accelerometer.y,
            point.accelerometer.z,
            point.magnetometer.x,
            point.magnetometer.y,
            point.magnetometer.z
        );
        return new Movement(this.ahrs.toVector(), this.ahrs.getQuaternion());
    };
}