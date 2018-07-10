import logger from "~/utils/logger"
import GloveConnector from "~/glove/glove-connector";
import {Glove} from "~/models/dao/glove";
import {toGloveDTO} from "~/models/mapper/glove";
import hitRepository from '~/repositories/hit'

const serviceName = "GloveService";

class GloveService {
    constructor() {
        this.gloves = new Map();
    }

    initialize(id) {
        logger.log(`${serviceName}(${id}): Initialize...`);
        const gloveConnector = new GloveConnector(id, (gloveConnector, point, movement) => this.dataProcessing(gloveConnector, point, movement));
        const glove = new Glove(id, gloveConnector);
        this.gloves.set(id, glove);
        logger.log(`${serviceName}(${id}): Initialized.`);
    }

    get(id) {
        logger.log(`${serviceName}(${id}): Get...`);
        const glove = toGloveDTO(this.gloves.get(id));
        logger.log(`${serviceName}(${id}): Gotten.`);
        return glove;
    }

    dataProcessing(gloveConnector, point, movement) {
        const glove = this.gloves.get(gloveConnector.gloveUuid);
        if (!glove.started) {
            return;
        }
        const hit = glove.hitCalculation.addPointCalculation(point);
        if (hit) {
            hitRepository.create(hit);
        }
    }

}

export default new GloveService();