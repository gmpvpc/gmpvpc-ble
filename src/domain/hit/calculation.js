import config from '~/config';
import Hit from "~/models/dao/hit";
import MathExt from "~/utils/math-extension";

export default class HitCalculation {

    constructor() {
        this.hitBeggin = null;
        this.normalsStop = [];
        this.normalsHit = [];
    }

    addNormalStop(normal) {
        this.normalsStop.push(normal);
        if (this.normalsStop.length > config.domain.pointNumbersToAvg) {
            this.normalsStop.shift();
        }
    }

    addPointCalculation(point) {
        const norm = MathExt.normal(point.accelerometer.x, point.accelerometer.y, point.accelerometer.z);
        const date = Date.now();
        this.addNormalStop({norm, date});
        if (!this.hitBeggin) {
            if (norm > 10) {
                this.hitBeggin = date;
                this.normalsStop = [];
            }
        } else if (this.normalsStop.length >= config.domain.pointNumbersToAvg) {
            const avg = this.normalsStop.map(n => n.norm).reduce((pv, cv) => pv + cv, 0) / this.normalsStop.length;
            if (avg < 10) {
                this.normalsHit.push(norm);
                const duration = this.normalsStop[0].date - this.hitBeggin;
                if (duration < 200) {
                    return null;
                }
                if (duration > 2000) {
                    this.hitBeggin = null;
                    this.normalsStop = [];
                    return null;
                }
                const hit = new Hit();
                hit.duration = duration;
                hit.velocity = 5 / (hit.duration / 1000);
                hit.normals = this.normalsStop;
                this.hitBeggin = null;
                return hit;
            }
        }
        return null;
    }
}