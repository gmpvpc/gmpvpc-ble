import logger from '~/utils/logger'
import SensorTagConnector from "./sensortag/sensortag-connector";
import GloveDataProcessing from "./ahrs/glove-data-processing";

/**
 * Glove connector to connect, calibrate and process a new glove
 */
export default class GloveConnector {
    constructor(gloveUuid, calibratedCallback, dataRetrievalCallback) {
        gloveUuid = gloveUuid.toLowerCase();
        this.gloveDataProcessing = new GloveDataProcessing(1000 / SensorTagConnector.DEFAULT_PERIOD);
        this.sensorTagConnector = new SensorTagConnector(gloveUuid, calibratedCallback, (point) => this.dataRetrieval(point));
        this.dataRetrievalCallback = dataRetrievalCallback;
    }

    getId() {
        if (this.sensorTagConnector == null) {
            return null;
        }
        return this.sensorTagConnector.gloveUuid;
    }

    stop() {
        logger.log(`GloveConnector(${this.sensorTagConnector.gloveUuid}): Stop the glove...`);
        this.sensorTagConnector.disconnect();
        logger.log(`GloveConnector(${this.sensorTagConnector.gloveUuid}): The glove stopped.`);
        return true;
    }

    isCalibrated() {
        return this.sensorTagConnector != null && this.sensorTagConnector.zero != null;
    }

    dataRetrieval(point) {
        this.dataRetrievalCallback(this, point, this.gloveDataProcessing.process(point));
    }
}