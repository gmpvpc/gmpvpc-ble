import logger from "~/utils/logger"
import {Training} from "~/models/dao/training";
import {toTrainingDTO} from "~/models/mapper/training";
import trainingRepository from '~/repositories/training';

const serviceName = "TrainingService";

class TrainingService {
    constructor() {
    }

    getCurrent() {
        logger.log(`${serviceName}(${this.currentId}): Get...`);
        let training = trainingRepository.getCurrent();
        logger.log(`${serviceName}(${this.currentId}): Gotten.`);
        return training;
    }

}

export default new TrainingService();