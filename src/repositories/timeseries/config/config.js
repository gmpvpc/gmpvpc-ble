import {FieldType} from 'influx'

/**
 * Config of the DAO
 */
export default class Config {

    static get HOST() {
        return "localhost"
    };

    static get DB_NAME() {
        return "gmpvpc"
    };

    static get POINT_MEAS() {
        return "point"
    };

    static get POINT_TAGS() {
        return [Config.SERIES_ID]
    };

    static get POINT_FIELD_ACC_X() {
        return "acc_x"
    };

    static get POINT_FIELD_ACC_Y() {
        return "acc_y"
    };

    static get POINT_FIELD_ACC_Z() {
        return "acc_z"
    };

    static get POINT_FIELD_GYR_X() {
        return "gyr_x"
    };

    static get POINT_FIELD_GYR_Y() {
        return "gyr_y"
    };

    static get POINT_FIELD_GYR_Z() {
        return "gyr_z"
    };

    static get POINT_FIELD_MAG_X() {
        return "mag_x"
    };

    static get POINT_FIELD_MAG_Y() {
        return "mag_y"
    };

    static get POINT_FIELD_MAG_Z() {
        return "mag_z"
    };

    static get POINT_FIELD_TIME() {
        return "time"
    };

    static get POINT_FIELDS() {
        return {
            [Config.POINT_FIELD_ACC_X]: FieldType.FLOAT,
            [Config.POINT_FIELD_ACC_Y]: FieldType.FLOAT,
            [Config.POINT_FIELD_ACC_Z]: FieldType.FLOAT,
            [Config.POINT_FIELD_GYR_X]: FieldType.FLOAT,
            [Config.POINT_FIELD_GYR_Y]: FieldType.FLOAT,
            [Config.POINT_FIELD_GYR_Z]: FieldType.FLOAT,
            [Config.POINT_FIELD_MAG_X]: FieldType.FLOAT,
            [Config.POINT_FIELD_MAG_Y]: FieldType.FLOAT,
            [Config.POINT_FIELD_MAG_Z]: FieldType.FLOAT
        };
    }

    static get SERIES_ID() {
        return "series_id"
    };

    static get HIT_FIELD_NORM() {
        return "norm"
    };

    static get HIT_MEAS() {
        return "hit"
    };

    static get HIT_FIELDS() {
        return {
            [Config.HIT_FIELD_NORM]: FieldType.FLOAT
        };
    }

    static get HIT_TAGS() {
        return []
    };

}