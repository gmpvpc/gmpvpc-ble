import {Entity} from "~/models/dto/entity";

export default class Training extends Entity {
    constructor() {
        super();
        this.series = [];
        this.status = null;
    }
}