import SensorTagConnector from "./sensortag/sensortag-connector";
import GloveDataProcessing from "./ahrs/glove-data-processing";

/**
 * Glove connector to connect, calibrate and process a new glove
 */
export default class GloveConnector {
    constructor(gloveUuid, callback) {
        this.gloveDataProcessing = new GloveDataProcessing();
        this.sensorTagConnector = new SensorTagConnector(gloveUuid, (point) => this.dataRetrieval(point));
        this.callback = callback;
    }

    dataRetrieval(point) {
        this.callback(point, this.gloveDataProcessing.process(point));
    }
}