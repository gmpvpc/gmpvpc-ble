import logger from "~/utils/logger"
import {Training} from "~/models/dao/training";
import {toTrainingDTO} from "~/models/mapper/training";

const serviceName = "TrainingService";

class TrainingService {
    constructor() {
        this.currentId = null;
    }

    getCurrent() {
        if (!this.currentId) {
            return null;
        }
        logger.log(`${serviceName}(${this.currentId}): Get...`);
        let training;
        logger.log(`${serviceName}(${this.currentId}): Gotten.`);
        return training;
    }

}

export default new TrainingService();