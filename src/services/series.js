import {toSeriesDTO} from "~/models/mapper/series";
import {seriesRepository, trainingRepository} from '~/index'
import LogFormat from "~/utils/log-format";

class SeriesService extends LogFormat {

    constructor() {
        super("SeriesService");
    }

    get(seriesId) {
        return new Promise((resolve, reject) => {
            this.log(seriesId, "Get...");
            let series = null;
            seriesRepository.get(seriesId)
                .then(t => {
                    series = toSeriesDTO(t);
                    this.log(seriesId, "Gotten.");
                    resolve(series);
                })
                .catch(err => {
                    this.log(seriesId, `Get failed - ${err}`);
                    reject();
                });
        });
    }

    update(id, data) {
        return new Promise((resolve, reject) => {
            this.log(id, `Update...`);
            let series = [];
            seriesRepository.update(id, data)
                .then(([r, [t]]) => {
                    series = toSeriesDTO(t);
                    this.log(series.id, `Updated.`);
                    resolve(series);
                })
                .catch(err => {
                    this.log("", `Update failed - ${err}`);
                    reject();
                });
        });
    }

}

export default new SeriesService();