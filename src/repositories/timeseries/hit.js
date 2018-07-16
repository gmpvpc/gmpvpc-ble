import {InfluxDB} from "influx/lib/src/index";
import DaoConfig from './config/config'
import Request from "./config/request";

/**
 * DAO Class to save point in InfluxDB
 */
class HitRepository {

    constructor() {
        this.influxdb = null;
        this.connect();
        this.createDb();
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
                    measurement: DaoConfig.HIT_MEAS,
                    fields: DaoConfig.HIT_FIELDS,
                    tags: DaoConfig.HIT_TAGS
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
    save(norm, seriesId, callback) {
        this.influxdb.writeMeasurement(DaoConfig.HIT_MEAS,
            [{
                tags: {
                    [DaoConfig.SERIES_ID]: seriesId
                },
                fields: {
                    [DaoConfig.HIT_FIELD_NORM]: norm
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
            Request.SELECT +
            Request.MEASUREMENT(DaoConfig.DB_NAME, DaoConfig.POINT_MEAS) +
            Request.ORDER_BY + Request.DESC(DaoConfig.POINT_FIELD_TIME)
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
            Request.SELECT +
            Request.MEASUREMENT(DaoConfig.DB_NAME, DaoConfig.POINT_MEAS) +
            Request.WHERE(DaoConfig.SERIES_ID, seriesId) +
            Request.ORDER_BY + Request.ASC(DaoConfig.POINT_FIELD_TIME)
        ).then((data) => callback(data));
    }
}
export default new Hit();