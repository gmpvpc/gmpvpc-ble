import config from '~/config';
import Hit from "~/models/dao/hit";
import MathExt from "~/utils/math-extension";

export default class HitCalculation {

    constructor() {
        this.hitBeggin = null;
        this.lastNorms = []
    }

    addPointCalculation(point) {
        const norm = MathExt.normal(point.accelerometer.x, point.accelerometer.y, point.accelerometer.z);

        if (this.lastNorms.length === config.domain.pointNumbersToAvg) {
            this.lastNorms.shift();
        }
        this.lastNorms.push(norm);

        const avg = this.lastNorms.reduce((pv, cv) => pv + cv, 0) / this.lastNorms.length;
        if (!this.hitBeggin && norm > 1) {
            this.hitBeggin = Date.now();
        }
        if (this.hitBeggin && avg < 1) {
            const duration = Date.now() - this.hitBeggin;
            if (duration < 200 || duration > 1500) {
                this.hitBeggin = null;
                return null;
            }
            const hit = new Hit();
            hit.duration = duration;
            hit.velocity = 0.62 / hit.duration;
            this.hitBeggin = null;
            return hit;
        }
        return null;
    }
}