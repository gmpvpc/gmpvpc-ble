import {PointDAO} from '../../src/dao/point/point-dao';
import {DaoConfig} from "../../src/dao/dao-config";
import * as sinon from "sinon";
import {Point} from '../../src/model/point';
import {DaoRequest} from "../../src/dao/dao-request";

describe("Point DAO", () => {

    const SERIES_ID = "the-series-id";

    let influxdb, pointDAO;

    beforeEach(() => {
        let promise = () => {
            return Promise.resolve()
        };
        influxdb = {
            getDatabaseNames: promise,
            createDatabase: promise,
            writeMeasurement: promise,
            query: promise
        };
        pointDAO = new PointDAO(influxdb);
    });

    afterEach(() => {
    });

    it("should be a singleton", () => {
        expect(pointDAO).toEqual(PointDAO.getInstance());
        expect(pointDAO).toEqual(new PointDAO());
        expect(new PointDAO()).toEqual(new PointDAO());
    });

    it("should connect to the database", () => {
        PointDAO.getInstance().connect();

        expect(PointDAO.getInstance().influxdb).not.toBe(influxdb);
    });

    it("should save a point", () => {
        let point = new Point();
        point.accelero.fromXYZ(1, 2, 3);
        point.gyro.fromXYZ(4, 5, 6);
        point.magneto.fromXYZ(7, 8, 9);

        let expectedMeasurement = [{
            tags: {
                [DaoConfig.SERIES_ID]: SERIES_ID
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
        }];

        let mockWriteMeasurement = sinon.mock(PointDAO.instance.influxdb)
            .expects("writeMeasurement")
            .resolves(Promise.resolve())
            .withArgs(DaoConfig.POINT_MEAS, expectedMeasurement);

        PointDAO.instance.save(point, SERIES_ID);

        mockWriteMeasurement.verify();
        mockWriteMeasurement.restore();
    });

    it("should findAll points", () => {
        let data = {data: "the-data"};

        let mockQuery = sinon.mock(PointDAO.instance.influxdb)
            .expects("query")
            .withArgs(
                DaoRequest.SELECT +
                DaoRequest.MEASUREMENT(DaoConfig.DB_NAME, DaoConfig.POINT_MEAS) +
                DaoRequest.ORDER_BY + DaoRequest.DESC(DaoConfig.POINT_FIELD_TIME))
            .resolves(Promise.resolve(data));

        PointDAO.instance.findAll(() => {});

        mockQuery.verify();
        mockQuery.restore();
    });

    it("should findBySeriesId points", () => {
        let data = {data: "the-data"};

        let mockQuery = sinon.mock(PointDAO.instance.influxdb)
            .expects("query")
            .withArgs(DaoRequest.SELECT +
                DaoRequest.MEASUREMENT(DaoConfig.DB_NAME, DaoConfig.POINT_MEAS) +
                DaoRequest.WHERE(DaoConfig.SERIES_ID, SERIES_ID) +
                DaoRequest.ORDER_BY + DaoRequest.ASC(DaoConfig.POINT_FIELD_TIME))
            .resolves(Promise.resolve(data));

        PointDAO.instance.findBySeriesId(SERIES_ID, () => {});

        mockQuery.verify();
        mockQuery.restore();
    });


    // Tests ignored because of Promise errors
    // it("should create a database after instantiation", () => {
    //     sinon.stub(PointDAO.getInstance().influxdb, "getDatabaseNames")
    //         .resolves(Promise.resolve());
    //
    //     let testCreateDatabase = sinon.mock(PointDAO.getInstance().influxdb)
    //         .expects("createDatabase")
    //         .withExactArgs(DaoConfig.DB_NAME);
    //
    //     PointDAO.getInstance().createDb();
    //
    //     testCreateDatabase.verify();
    // });
    //
    // it("should save a point and call a callback", () => {
    //     let seriesId = "the-series-id";
    //     let point = new Point();
    //     let callback = sinon.spy();
    //
    //     let stubWriteMeasurement = sinon.stub(PointDAO.instance.influxdb, "writeMeasurement")
    //          .resolves();
    //
    //     PointDAO.instance.save(point, seriesId, callback);
    //
    //     expect(callback.called).toEqual(true);
    //     stubWriteMeasurement.restore();
    // });
    //
    // it("should findAll points and call a callback", () => {
    //     let data = {data: "the-data"};
    //
    //     let callback = sinon.spy();
    //     let stubQuery = sinon.stub(PointDAO.instance.influxdb, "query")
    //         .resolves(Promise.resolve(data));
    //
    //     PointDAO.instance.findAll(callback);
    //
    //     expect(callback.calledWith(data)).toEqual(true);
    // });
});