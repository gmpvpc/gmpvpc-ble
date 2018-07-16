import SensorTagConnector from "./sensortag/sensortag-connector";
import GloveDataProcessing from "./ahrs/glove-data-processing";
import LogFormat from "~/utils/log-format";
import config from "~/config";

/**
 * Glove connector to connect, calibrate and process a new glove
 */
export default class GloveConnector extends LogFormat {
    constructor(gloveUuid, calibratedCallback, dataRetrievalCallback) {
        super(GloveConnector);
        gloveUuid = gloveUuid.toLowerCase();
        this.gloveDataProcessing = new GloveDataProcessing(1000 / config.glove.defaultPeriod);
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