import {Entity} from "~/models/dao/entity";
import TrainingStatus from "./training-status";

export default class Training extends Entity {
    constructor() {
        super();
        this.series = [];
        this.status = null;
    }
}