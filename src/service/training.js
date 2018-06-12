import logger from "~/utils/logger"
import {Training} from "~/models/dao/training";
import {toTrainingDTO, toTrainingsDTO} from "~/models/mapper/training";
import trainingRepository from '~/repositories/training';
import Exception from "../exception/exception";
import TrainingStatus from "../models/dao/training-status";

const serviceName = "TrainingService";

class TrainingService {

    getCurrent() {
        logger.log(`${serviceName}(${this.currentId}): Get...`);
        let training = null;
        trainingRepository.getCurrent()
            .then(t => training = toTrainingDTO(t))
            .catch(err =>  {
                throw new Exception(`${serviceName}(): Get failed - ${err}`);
            });
        logger.log(`${serviceName}(${this.currentId}): Gotten.`);
        return training;
    }

    create() {
        logger.log(`${serviceName}(): Create...`);
        let training = new Training();
        training.status = TrainingStatus.IN_PROGRESS;
        trainingRepository.create(training)
            .then(t => training = toTrainingDTO(t))
            .catch(err => {
                throw new Exception(`${serviceName}(): Creation failed - ${err}`);
            });
        logger.log(`${serviceName}(${training.id}): Created.`);
        return training;
    }

    update(id, data) {
        logger.log(`${serviceName}(${id}): Update...`);
        let trainings = [];
        trainingRepository.update(id, data)
            .then(([r,[t]]) => trainings = toTrainingsDTO(t))
            .catch(err => {
                throw new Exception(`${serviceName}(): Update failed - ${err}`);
            });
        logger.log(`${serviceName}(${trainings.id}): Updated.`);
        return trainings;
    }

}

export default new TrainingService();