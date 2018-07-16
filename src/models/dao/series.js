import {Entity} from "~/models/dao/entity";
import config from "~/config";

export default class Series extends Entity {
    constructor() {
        super();
        this.combinations = [];
        this.occurrence = config.domain.defaultHitOccurrences;
        this.hits = 0;
        this.trainingId = null;
    }
}