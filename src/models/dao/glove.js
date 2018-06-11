export class Glove {

    constructor(id, gloveConnector) {
        this.id = id;
        this.gloveConnector = gloveConnector;
        this.started = false;
    }

    isCalibrated() {
        return this.gloveConnector.isCalibrated();
    }

}