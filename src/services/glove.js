import logger from "~/utils/logger"
import GloveConnector from "~/domain/glove/glove-connector";
import {Glove} from "~/models/dao/glove";
import {toGloveDTO} from "~/models/mapper/glove";
import {hitRepository} from '~/index';
import trainingService from "~/services/training";
import rabbitConsumer from '~/consumers/rabbit';

const serviceName = "GloveService";

class GloveService {
    constructor() {
        this.gloves = new Map();
    }

    initialize(id) {
        logger.log(`${serviceName}(${id}): Initialize...`);
        const gloveConnector = new GloveConnector(id, (id) => this.calibrated(id), (gloveConnector, point, movement) => this.dataProcessing(gloveConnector, point, movement));
        const glove = new Glove(gloveConnector.getId(), gloveConnector);
        this.gloves.set(gloveConnector.getId(), glove);
        trainingService.addGloveToCurrent(gloveConnector.getId());
        logger.log(`${serviceName}(${id}): Initialized.`);
    }

    get(id) {
        logger.log(`${serviceName}(${id}): Get...`);
        const glove = toGloveDTO(this.gloves.get(id.toLowerCase()));
        logger.log(`${serviceName}(${id}): Gotten.`);
        return glove;
    }

    stop(id) {
        const glove = this.gloves.get(id);
        if (glove) {
            glove.gloveConnector.stop();
        }
    }

    dataProcessing(gloveConnector, point, movement) {
        const glove = this.gloves.get(gloveConnector.getId());
        const hit = glove.hitCalculation.addPointCalculation(point);
        if (hit) {
            logger.log(`${serviceName}(${gloveConnector.getId()}): Hit detected - duration: ${hit.duration}`);
            rabbitConsumer.publish("hit", hit);
        }
    }

    calibrated(id) {
        rabbitConsumer.publish("glove", this.get(id));
    }

}

export default new GloveService();