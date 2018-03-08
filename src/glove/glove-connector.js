import SensorTagConnector from "./sensortag/sensortag-connector";

export default class GloveConnector {
    constructor(gloveUuid, callback) {
        this.gloveDataProcessing = null;
        this.sensorTagConnector = new SensorTagConnector(gloveUuid, callback);
    }

}