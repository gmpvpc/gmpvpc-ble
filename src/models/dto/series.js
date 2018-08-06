import {Entity} from "~/models/dto/entity";

export default class Series extends Entity {
    constructor() {
        super();
        this.combinations = [];
        this.hits = 0;
        this.occurrence = null
    }
}