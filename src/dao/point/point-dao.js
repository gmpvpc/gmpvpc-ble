import {PointDaoConfig} from './point-dao-config'
import {InfluxDB} from "influx/lib/src/index";

export class PointDAO {
    constructor() {
        this.influxdb = null;
        this.connect();
        this.createDb();
    }

    createDb() {
        this.influxdb.getDatabaseNames()
            .then(names => {
                if (!names.includes(PointDaoConfig.POINT_DB)) {
                    return this.influxdb.createDatabase(PointDaoConfig.POINT_DB);
                }
            });
    }

    connect() {
        this.influxdb = new InfluxDB({
            host: PointDaoConfig.HOST,
            database: PointDaoConfig.POINT_DB,
            schema: [
                {
                    measurement: PointDaoConfig.POINT_MEASUREMENT,
                    fields: PointDaoConfig.POINT_FIELDS,
                    tags: PointDaoConfig.POINT_TAGS
                }
            ]
        });
    }

    save(point, userId, callback) {
        this.influxdb.writeMeasurement(PointDaoConfig.POINT_MEASUREMENT,
            [{
                tags: {
                    [PointDaoConfig.USER_ID]: userId
                },
                fields: {
                    [PointDaoConfig.POINT_FIELD_ACC_X]: point.accelero.x,
                    [PointDaoConfig.POINT_FIELD_ACC_Y]: point.accelero.y,
                    [PointDaoConfig.POINT_FIELD_ACC_Z]: point.accelero.z,
                    [PointDaoConfig.POINT_FIELD_GYR_X]: point.gyro.x,
                    [PointDaoConfig.POINT_FIELD_GYR_Y]: point.gyro.y,
                    [PointDaoConfig.POINT_FIELD_GYR_Z]: point.gyro.z,
                    [PointDaoConfig.POINT_FIELD_MAG_X]: point.magneto.x,
                    [PointDaoConfig.POINT_FIELD_MAG_Y]: point.magneto.y,
                    [PointDaoConfig.POINT_FIELD_MAG_Z]: point.magneto.z,
                    [PointDaoConfig.DATE]: Date.now()
                },
            }]
        ).then(callback);
    }
}