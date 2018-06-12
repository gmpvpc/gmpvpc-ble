import {Entity} from "~/models/dto/entity";

export default class Glove extends Entity {
    constructor() {
        super();
        this.id = null;
        this.started = null;
        this.calibrated = null;
    }
}