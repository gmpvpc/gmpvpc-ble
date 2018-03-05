import {PointDAO} from '../../src/dao/point/point-dao';
import {DaoConfig} from "../../src/dao/dao-config";
import * as sinon from "sinon";
//import { Point } from '../../src/model/point';

describe("Point DAO", () => {

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it("should connect to the database after instantiation", () => {

        let pointDao = new PointDAO();

        expect(pointDao.influxdb).not.toBe(null);
        //TODO extends ...
    });

    it("should create a database after instantiation", () => {

        let pointDao = new PointDAO();
        //sinon.stub().usingPromise(bluebird.Promise).resolves("baz");

        sinon.stub(pointDao.influxdb, "getDatabaseNames").returns(Promise.resolve());
        let testCreateDatabase = sinon.mock(pointDao.influxdb).expects("createDatabase").withExactArgs(DaoConfig.DB_NAME);

        pointDao.createDb();

        testCreateDatabase.verify();

    });
});