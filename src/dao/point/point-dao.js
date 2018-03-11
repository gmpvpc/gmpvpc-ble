import {DaoConfig} from '../dao-config'
import {InfluxDB} from "influx/lib/src/index";
import {DaoRequest} from "../dao-request";

/**
 * DAO Class to save point in InfluxDB
 */
export class PointDAO {

    static getInstance() {
        if (PointDAO.instance === null) {
            new PointDAO();
        }
        return PointDAO.instance;
    }

    constructor(influxdb) {
        if (PointDAO.instance) {
            return PointDAO.instance;
        }
        PointDAO.instance = this;
        this.influxdb = influxdb;
        if (influxdb === null) {
            this.connect();
            this.createDb();
        }
    }

    /**
     * Create the database
     */
    createDb() {
        this.influxdb.getDatabaseNames()
            .then(names => {
                if (!names.includes(DaoConfig.DB_NAME)) {
                    return this.influxdb.createDatabase(DaoConfig.DB_NAME);
                }
            });
    }

    /**
     * Connect to the database
     */
    connect() {
        this.influxdb = new InfluxDB({
            host: DaoConfig.HOST,
            database: DaoConfig.DB_NAME,
            schema: [
                {
                    measurement: DaoConfig.POINT_MEAS,
                    fields: DaoConfig.POINT_FIELDS,
                    tags: DaoConfig.POINT_TAGS
                }
            ]
        });
    }

    /**
     * Save a point to the database
     *
     * @param point the point to save
     * @param seriesId the series id to link with the point
     * @param callback (optional) the callback which be called after the save
     */
    save(point, seriesId, callback) {
        this.influxdb.writeMeasurement(DaoConfig.POINT_MEAS,
            [{
                tags: {
                    [DaoConfig.SERIES_ID]: seriesId
                },
                fields: {
                    [DaoConfig.POINT_FIELD_ACC_X]: point.accelero.x,
                    [DaoConfig.POINT_FIELD_ACC_Y]: point.accelero.y,
                    [DaoConfig.POINT_FIELD_ACC_Z]: point.accelero.z,
                    [DaoConfig.POINT_FIELD_GYR_X]: point.gyro.x,
                    [DaoConfig.POINT_FIELD_GYR_Y]: point.gyro.y,
                    [DaoConfig.POINT_FIELD_GYR_Z]: point.gyro.z,
                    [DaoConfig.POINT_FIELD_MAG_X]: point.magneto.x,
                    [DaoConfig.POINT_FIELD_MAG_Y]: point.magneto.y,
                    [DaoConfig.POINT_FIELD_MAG_Z]: point.magneto.z
                },
            }]
        ).then(callback);
    }

    /**
     * Find all points
     *
     * @param callback the callback which will get all the data
     */
    findAll(callback) {
        this.influxdb.query(
            DaoRequest.SELECT +
            DaoRequest.MEASUREMENT(DaoConfig.DB_NAME, DaoConfig.POINT_MEAS) +
            DaoRequest.ORDER_BY + DaoRequest.DESC(DaoConfig.POINT_FIELD_TIME)
        ).then((data) => callback(data));
    }

    /**
     * Find all points of a series id
     *
     * @param seriesId the series id to search
     * @param callback the callback which will get all the data
     */
    findBySeriesId(seriesId, callback) {
        this.influxdb.query(
            DaoRequest.SELECT +
            DaoRequest.MEASUREMENT(DaoConfig.DB_NAME, DaoConfig.POINT_MEAS) +
            DaoRequest.WHERE(DaoConfig.SERIES_ID, seriesId) +
            DaoRequest.ORDER_BY + DaoRequest.ASC(DaoConfig.POINT_FIELD_TIME)
        ).then((data) => callback(data));
    }
}
PointDAO.instance = null;