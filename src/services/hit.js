import LogFormat from "~/utils/log-format";
import rabbitConsumer from "~/consumers/rabbit";
import {toHitDTO} from "~/models/mapper/hit";
import Series from "~/models/dao/series";
import trainingService from "~/services/training";
import seriesService from "~/services/series";
import {seriesRepository} from "~/index";

class HitService extends LogFormat {

    constructor() {
        super("HitService")
    }

    addHitToCurrentTraining(hit) {
        this.log("", "Add hit to current training...");
        rabbitConsumer.publish("hit", toHitDTO(hit));
        trainingService.getCurrentDAO().then(t => {
            if (t && t.series) {
                t.series.forEach(s => {
                    if (hit && s && s.hits < s.occurrence) {
                        const hits = s.hits +1;
                        this.log("", JSON.stringify(s));
                        seriesService.update(s.id, {hits});
                        hit = null;
                    }
                });
            }
            if (hit) {
                let series = new Series();
                series.hits = 1;
                series.trainingId = t.id;
                seriesRepository.create(series);
            }
            this.log("", "Hit added to the current training.");
        }).catch(err => {
            this.log("", `Add hit failed ${err}.`);
        });
    }

}

export default new HitService();