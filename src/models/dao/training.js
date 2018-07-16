import {Entity} from "~/models/dao/entity";

export default class Training extends Entity {
    constructor() {
        super();
        this.series = [];
        this.status = null;
        this.gloves = [];
    }
}