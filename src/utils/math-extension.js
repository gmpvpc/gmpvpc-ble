/**
 * Custom extension to Math
 */
export default class MathExt {
    static toRadian(value) {
        return value * Math.PI / 180;
    }

    static toDegree(value) {
        return value * 180 / Math.PI;
    }
}