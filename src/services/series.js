import {toSeriesDTO} from "~/models/mapper/series";
import {hitRepository, seriesRepository, trainingRepository} from '~/index'
import LogFormat from "~/utils/log-format";
import {toHitDTO} from "~/models/mapper/hit";

class SeriesService extends LogFormat {

    constructor() {
        super("SeriesService");
    }

    create(series) {
        return new Promise((resolve, reject) => {
            this.log("Create...");
            seriesRepository.create(series)
                .then(s => {
                    series = toHitDTO(s);
                    this.log(series.id, "Created.");
                    resolve(series);
                })
                .catch(err => {
                    this.log(`Creation failed - ${err}`);
                    reject();
                });
        });
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
                    this.log(`Update failed - ${err}`);
                    reject();
                });
        });
    }

}

export default new SeriesService();