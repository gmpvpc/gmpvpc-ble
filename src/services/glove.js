import GloveConnector from "~/domain/glove/glove-connector";
import {Glove} from "~/models/dao/glove";
import {toGloveDTO} from "~/models/mapper/glove";
import {toHitDTO} from "~/models/mapper/hit";
import trainingService from "~/services/training";
import rabbitConsumer from '~/consumers/rabbit';
import LogFormat from "~/utils/log-format";

class GloveService extends LogFormat {
    constructor() {
        super("GloveService");
        this.gloves = new Map();
    }

    initialize(id) {
        this.log(id, `Initialize...`);
        const gloveConnector = new GloveConnector(id, (id) => this.calibrated(id), (gloveConnector, point, movement) => this.dataProcessing(gloveConnector, point, movement));
        const glove = new Glove(gloveConnector.getId(), gloveConnector);
        this.gloves.set(gloveConnector.getId(), glove);
        trainingService.addGloveToCurrent(gloveConnector.getId());
        this.log(id, `Initialized.`);
    }

    get(id) {
        this.log(id, `Get...`);
        const glove = toGloveDTO(this.gloves.get(id.toLowerCase()));
        this.log(id, `Gotten.`);
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
            this.log(gloveConnector.getId(), `Hit detected - duration: ${hit.duration}`);
            rabbitConsumer.publish("hit", toHitDTO(hit));
        }
    }

    calibrated(id) {
        rabbitConsumer.publish("glove", this.get(id));
    }

}

export default new GloveService();