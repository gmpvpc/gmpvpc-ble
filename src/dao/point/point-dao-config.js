import {FieldType} from 'influx'

export class PointDaoConfig {

    static get HOST() { return "localhost" };
    static get POINT_DB() { return "gmpvpc" };
    static get POINT_MEASUREMENT() { return "point" };
    static get POINT_TAGS() { return [PointDaoConfig.USER_ID] };
    static get POINT_FIELD_ACC_X() { return "acc_x" };
    static get POINT_FIELD_ACC_Y() { return "acc_y" };
    static get POINT_FIELD_ACC_Z() { return "acc_z" };
    static get POINT_FIELD_GYR_X() { return "gyr_x" };
    static get POINT_FIELD_GYR_Y() { return "gyr_y" };
    static get POINT_FIELD_GYR_Z() { return "gyr_z" };
    static get POINT_FIELD_MAG_X() { return "mag_x" };
    static get POINT_FIELD_MAG_Y() { return "mag_y" };
    static get POINT_FIELD_MAG_Z() { return "mag_z" };
    static get POINT_FIELDS() {
        return {
            [PointDaoConfig.POINT_FIELD_ACC_X]: FieldType.FLOAT,
            [PointDaoConfig.POINT_FIELD_ACC_Y]: FieldType.FLOAT,
            [PointDaoConfig.POINT_FIELD_ACC_Z]: FieldType.FLOAT,
            [PointDaoConfig.POINT_FIELD_GYR_X]: FieldType.FLOAT,
            [PointDaoConfig.POINT_FIELD_GYR_Y]: FieldType.FLOAT,
            [PointDaoConfig.POINT_FIELD_GYR_Z]: FieldType.FLOAT,
            [PointDaoConfig.POINT_FIELD_MAG_X]: FieldType.FLOAT,
            [PointDaoConfig.POINT_FIELD_MAG_Y]: FieldType.FLOAT,
            [PointDaoConfig.POINT_FIELD_MAG_Z]: FieldType.FLOAT,
            [PointDaoConfig.DATE]: FieldType.FLOAT
        };
    }

    static get USER_ID() { return "user_id" };
    static get DATE() { return "date" };

}