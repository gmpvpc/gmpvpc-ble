import config from '~/config';
import Hit from "~/models/dao/hit";

export default class HitCalculation {

    constructor() {
        this.hitBeggin = null;
        this.lastNorms = []
    }

    addPointCalculation(point) {
        const norm = Math.pow(point.acceleration.x, 2) + Math.pow(point.acceleration.y, 2) + Math.pow(point.acceleration.z, 2);

        if (this.lastNorms.length === config.domain.pointNumbersToAvg) {
            this.lastNorms.shift();
        }
        this.lastNorms.push(norm);

        const avg = this.lastNorms.reduce((pv, cv) => pv + cv, 0) / this.lastNorms.length;
        if (!this.hitBeggin && norm > 1) {
            this.hitBeggin = Date.now();
        }
        if (this.hitBeggin && avg < 1) {
            const hit = new Hit();
            hit.duration = Date.now() - this.hitBeggin;
            hit.velocity = 0.62 / hit.duration;
            this.hitBeggin = null;
            return hit;
        }

        return null;
    }
}