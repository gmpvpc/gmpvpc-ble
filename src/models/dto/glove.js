import {Entity} from "~/models/dto/entity";

export default class Glove extends Entity {
    constructor(id, started, calibrated) {
        super();
        this.id = id;
        this.started = started;
        this.calibrated = calibrated;
    }
}