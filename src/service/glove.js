import logger from "~/utils/logger"
import GloveConnector from "~/glove/glove-connector";
import {Glove} from "~/models/dao/glove";
import {toGloveDTO} from "~/models/mapper/glove";

class GloveService {
    constructor() {
        this.gloves = new Map();
    }

    initialize(id) {
        logger.log(`GloveService(${id}): Initialize...`);
        let gloveConnector = new GloveConnector(id, (gloveConnector, point, movement) => this.dataProcessing(gloveConnector, point, movement));
        let glove = new Glove(id, gloveConnector);
        this.gloves.set(id, glove);
        logger.log(`GloveService(${id}): Initialized.`);
    }

    get(id) {
        logger.log(`GloveService(${id}): Get...`);
        let glove = toGloveDTO(this.gloves.get(id));
        logger.log(`GloveService(${id}): Gotten.`);
        return glove;
    }

    dataProcessing(gloveConnector, point, movement) {
        let glove = this.gloves.get(gloveConnector.gloveUuid);
        if (!glove.started) {
            return;
        }
    }

}

export default new GloveService();