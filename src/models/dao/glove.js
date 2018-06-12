import {Entity} from "~/models/dao/entity";

export class Glove extends Entity {

    constructor(id, gloveConnector) {
        super();
        this.id = id;
        this.gloveConnector = gloveConnector;
        this.started = false;
    }

    isCalibrated() {
        return this.gloveConnector.isCalibrated();
    }

}