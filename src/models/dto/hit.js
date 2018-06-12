import {Entity} from "~/models/dto/entity";

export default class Hit extends Entity {
    constructor() {
        super();
        this.velocity = null;
        this.duration = null;
    }
}