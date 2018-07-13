import {Entity} from "~/models/dao/entity";

export default class Series extends Entity {
    constructor() {
        super();
        this.combinations = [];
        this.occurrence = 10;
        this.hits = 0;
        this.trainingId = null;
    }
}