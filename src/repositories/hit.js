import * as Sequelize from "sequelize/lib/data-types";
import Repository from "~/repositories/repository";

export default class HitRepository extends Repository {

    init() {
        this.repository = this.dao.connection.define('hit', {
            duration: Sequelize.FLOAT(11),
            velocity: Sequelize.FLOAT(11)
        });
        //TODO save hit vs series
    }
}