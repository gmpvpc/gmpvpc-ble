import logger from "~/utils/logger"
import {toSeriesDTO} from "~/models/mapper/series";
import {seriesRepository} from '~/index'

const serviceName = "SeriesService";

class SeriesService {

    get(seriesId) {
        return new Promise((resolve, reject) => {
            logger.log(`${serviceName}(${seriesId}): Get...`);
            let training = null;
            seriesRepository.get(seriesId)
                .then(t => {
                    training = toSeriesDTO(t);
                    logger.log(`${serviceName}(${seriesId}): Gotten.`);
                    resolve(training);
                })
                .catch(err => {
                    logger.log(`${serviceName}(${seriesId}): Get failed - ${err}`);
                    reject();
                });
        });
    }

}

export default new SeriesService();