import {Entity} from "~/models/dao/entity";

export default class Hit extends Entity {
    constructor() {
        super();
        this.velocity = null;
        this.duration = null;
        this.normals = [];
    }
}