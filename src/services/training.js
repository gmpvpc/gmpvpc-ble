import Training from "~/models/dao/training";
import Series from "~/models/dao/series";
import {toTrainingDTO} from "~/models/mapper/training";
import TrainingStatus from "~/models/dao/training-status";
import {trainingRepository} from '~/index'
import gloveService from './glove';
import rabbitConsumer from '~/consumers/rabbit';
import LogFormat from "~/utils/log-format";

class TrainingService extends LogFormat {

    constructor() {
        super("TrainingService");
        this.currentId = null;
        this.connectedGloves = new Map();
    }

    getCurrentDAO() {
        return new Promise((resolve, reject) => {
            this.log(this.currentId, "Get...");
            trainingRepository.get(this.currentId)
                .then(t => {
                    this.log(this.currentId, "Gotten.");
                    resolve(t);
                })
                .catch(err => {
                    this.log("", `Get failed - ${err}`);
                    reject();
                });
        });
    }

    getCurrent() {
        return new Promise((resolve, reject) => {
            this.log(this.currentId, "Get...");
            trainingRepository.get(this.currentId)
                .then(t => {
                    const training = toTrainingDTO(t);
                    this.log(this.currentId, "Gotten.");
                    resolve(training);
                })
                .catch(err => {
                    this.log("", `Get failed - ${err}`);
                    reject();
                });
        });
    }

    create() {
        return new Promise((resolve, reject) => {
            this.log("", "Create...");
            let series = new Series();
            series.id = 0;
            let training = new Training();
            training.series.push(series);
            training.status = TrainingStatus.IN_PROGRESS;
            trainingRepository.create(training)
                .then(t => {
                    training = toTrainingDTO(t);
                    this.currentId = training.id;
                    this.log(training.id, "Created.");
                    resolve(training);
                })
                .catch(err => {
                    this.log("", `Creation failed - ${err}`);
                    reject();
                });
        });
    }

    update(id, data) {
        return new Promise((resolve, reject) => {
            this.log(id, `Update...`);
            let training = [];
            trainingRepository.update(id, data)
                .then(([r, [t]]) => {
                    training = toTrainingDTO(t);
                    this.log(training.id, "Updated.");
                    if (training.status === TrainingStatus.FINISHED) {
                        const gloveId = this.connectedGloves.get(training.id);
                        if (gloveId) {
                            gloveService.stop(gloveId);
                        }
                        rabbitConsumer.publish("training", toTrainingDTO(training));
                    }
                    resolve(training);
                })
                .catch(err => {
                    this.log("", `Update failed - ${err}`);
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