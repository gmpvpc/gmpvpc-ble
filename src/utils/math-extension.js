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

    static squared(value) {
        return Math.pow(value, 2)
    }

    static normal(x, y, z) {
        return MathExt.squared(x) + MathExt.squared(y) + MathExt.squared(z);
    }
}