import SensorTagConnector from "./sensortag/sensortag-connector";
import GloveDataProcessing from "./ahrs/glove-data-processing";

/**
 * Glove connector to connect, calibrate and process a new glove
 */
export default class GloveConnector {
    constructor(gloveUuid, callback) {
        this.gloveDataProcessing = new GloveDataProcessing(1000 / SensorTagConnector.DEFAULT_PERIOD);
        this.sensorTagConnector = new SensorTagConnector(gloveUuid, (point) => this.dataRetrieval(point));
        this.callback = callback;
    }

    getId() {
        if (this.sensorTagConnector == null) {
            return null;
        }
        return this.sensorTagConnector.gloveUuid;
    }

    isCalibrated() {
        return this.sensorTagConnector != null && this.sensorTagConnector.zero != null;
    }

    dataRetrieval(point) {
        this.callback(this, point, this.gloveDataProcessing.process(point));
    }
}