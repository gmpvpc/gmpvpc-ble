import {Entity} from "~/models/dao/entity";

export default class Series extends Entity {
    constructor() {
        super();
        this.combination = [];
    }
}