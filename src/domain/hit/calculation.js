import config from '~/config';
import Hit from "~/models/dao/hit";
import MathExt from "~/utils/math-extension";
import LogFormat from "~/utils/log-format";

export default class HitCalculation extends LogFormat {

    constructor() {
        super("HitCalculation");
        this.hitBeggin = null;
        this.normalsStop = [];
        this.normalsHit = [];
    }

    addPointCalculation(point) {
        const norm = MathExt.normal(point.accelerometer.x, point.accelerometer.y, point.accelerometer.z);
        const date = Date.now();
        this.addNormalStop({norm, date});
        if (!this.hitBeggin) {
            this.hitBegin(norm);
        } else if (this.normalsStop.length >= config.domain.pointNumbersToAvg) {
            this.normalsHit.push(norm);
            const avg = this.normalsStop.map(n => n.norm).reduce((pv, cv) => pv + cv, 0) / this.normalsStop.length;
            if (avg < 10) {
                return this.hitFinish();
            }
        }
        return null;
    }

    addNormalStop(normal) {
        this.normalsStop.push(normal);
        if (this.normalsStop.length > config.domain.pointNumbersToAvg) {
            this.normalsStop.shift();
        }
    }

    hitBegin(norm) {
        if (norm > 10) {
            this.hitBeggin = date;
            this.normalsStop = [];
            this.normalsHit = [];
            this.debug("Hit begin...")
        }
    }

    hitFinish() {
        const duration = this.normalsStop[0].date - this.hitBeggin;
        this.limitHitDuration(duration);
        const hit = new Hit();
        hit.duration = duration;
        hit.velocity = 5 / (hit.duration / 1000);
        hit.normals = this.normalsHit;
        this.hitBeggin = null;
        this.debug(`Hit ended: ${JSON.stringify(hit)}`);
        return hit;
    }

    limitHitDuration(duration) {
        if (duration < 200) {
            return null;
        }
        if (duration > 2000) {
            this.debug(`Hit too long: ${duration}`);
            this.hitBeggin = null;
            this.normalsStop = [];
            this.normalsHit = [];
            return null;
        }
    }
}