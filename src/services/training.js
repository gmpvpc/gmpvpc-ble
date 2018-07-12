import logger from "~/utils/logger"
import Training from "~/models/dao/training";
import Series from "~/models/dao/series";
import {toTrainingDTO, toTrainingsDTO} from "~/models/mapper/training";
import TrainingStatus from "~/models/dao/training-status";
import {seriesRepository, trainingRepository} from '~/index'
import gloveService from './glove';
import rabbitConsumer from '~/consumer/rabbit';

const serviceName = "TrainingService";

class TrainingService {

    constructor() {
        this.currentId = null;
        this.connectedGloves = new Map();
    }

    getCurrent() {
        return new Promise((resolve, reject) => {
            logger.log(`${serviceName}(${this.currentId}): Get...`);
            let training = null;
            trainingRepository.get(this.currentId)
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
            let series = new Series();
            series.id = 0;
            let training = new Training();
            training.series.push(series);
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
            let training = [];
            trainingRepository.update(id, data)
                .then(([r, [t]]) => {
                    training = toTrainingDTO(t);
                    logger.log(`${serviceName}(${training.id}): Updated.`);
                    if (training.status === TrainingStatus.FINISHED) {
                        const gloveId = this.connectedGloves.get(training.id);
                        if (gloveId) {
                            gloveService.stop(gloveId);
                        }
                        rabbitConsumer.publish("training:" + training);
                    }
                    resolve(training);
                })
                .catch(err => {
                    logger.log(`${serviceName}(): Update failed - ${err}`);
                    reject();
                });
        });
    }

    addGloveToCurrent(gloveId) {
        if (!this.connectedGloves.get(this.currentId)) {
            this.connectedGloves.set(this.currentId, gloveId);
        }
    }

}

export default new TrainingService();