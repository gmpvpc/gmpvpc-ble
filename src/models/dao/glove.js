import {Entity} from "~/models/dao/entity";
import HitCalculation from "~/domain/hit-calculation";

export class Glove extends Entity {

    constructor(id, gloveConnector) {
        super();
        this.id = id;
        this.gloveConnector = gloveConnector;
        this.hitCalculation = new HitCalculation();
        this.started = false;
    }

    isCalibrated() {
        return this.gloveConnector.isCalibrated();
    }

}