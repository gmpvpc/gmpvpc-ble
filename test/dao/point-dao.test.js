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
        expect(PointDAO.instance).toEqual(new PointDAO());
        expect(new PointDAO()).toEqual(new PointDAO());
    });

    it("should connect to the database after instantiation", () => {

        expect(PointDAO.instance.influxdb).not.toBe(null);
        //TODO extends ...
    });

    it("should create a database after instantiation", () => {

        sinon.stub().usingPromise(bluebird.Promise).resolves("baz");

        sinon.stub(PointDAO.instance.influxdb, "getDatabaseNames").returns(Promise.resolve());
        let testCreateDatabase = sinon.mock(PointDAO.instance.influxdb).expects("createDatabase").withExactArgs(DaoConfig.DB_NAME);

        PointDAO.instance.createDb();

        testCreateDatabase.verify();

    });
});