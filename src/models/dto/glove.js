import {Entity} from "~/models/dto/entity";

export default class Glove extends Entity {
    constructor() {
        super();
        this.id = null;
        this.calibrated = null;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}