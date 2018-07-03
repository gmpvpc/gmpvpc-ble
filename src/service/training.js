import logger from "~/utils/logger"
import Training from "~/models/dao/training";
import Series from "~/models/dao/series";
import {toTrainingDTO, toTrainingsDTO} from "~/models/mapper/training";
import TrainingStatus from "~/models/dao/training-status";
import {trainingRepository} from '~/index'

const serviceName = "TrainingService";

class TrainingService {

    constructor() {
        this.currentId = null;
    }

    getCurrent() {
        return new Promise((resolve, reject) => {
            logger.log(`${serviceName}(${this.currentId}): Get...`);
            let training = null;
            trainingRepository.getCurrent()
                .then(t => {
                    training = toTrainingDTO(t);
                    logger.log(`${serviceName}(${this.currentId}): Gotten.`);
                    resolve(training);
                })
                .catch(err => {
                    logger.log(`${serviceName}(): Get failed - ${err}`);
                    reject();
                });
        });
    }

    create() {
        return new Promise((resolve, reject) => {
            logger.log(`${serviceName}(): Create...`);
            let training = new Training();
            training.series.add(new Series());
            training.status = TrainingStatus.IN_PROGRESS;
            trainingRepository.create(training)
                .then(t => {
                    training = toTrainingDTO(t);
                    this.currentId = training.id;
                    logger.log(`${serviceName}(${training.id}): Created.`);
                    resolve(training);
                })
                .catch(err => {
                    logger.log(`${serviceName}(): Creation failed - ${err}`);
                    reject();
                });
        });
    }

    update(id, data) {
        return new Promise((resolve, reject) => {
            logger.log(`${serviceName}(${id}): Update...`);
            let trainings = [];
            trainingRepository.update(id, data)
                .then(([r, [t]]) => {
                    trainings = toTrainingsDTO(t);
                    logger.log(`${serviceName}(${trainings.id}): Updated.`);
                    resolve(trainings);
                })
                .catch(err => {
                    logger.log(`${serviceName}(): Update failed - ${err}`);
                    reject();
                });
        });
    }

}

export default new TrainingService();