import logger from "~/utils/logger"
import {hitRepository, seriesRepository} from '~/index'
import rabbitConsumer from '~/consumers/rabbit';

const serviceName = "HitService";

class HitService {

    sendHit(hit) {
        logger.log(`${serviceName}(): Send hit...`);
        rabbitConsumer.publish("hit:" + hit);
        logger.log(`${serviceName}(): Hit sent.`);
    }

}

export default new HitService();