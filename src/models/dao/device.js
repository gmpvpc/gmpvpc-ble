import {Entity} from "~/models/dao/entity";

export default class Device extends Entity {
    constructor() {
        super();
        this.version = null;
        this.uptime = null;
        this.lastSync = null;
    }
}