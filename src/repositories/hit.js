import * as Sequelize from "sequelize/lib/data-types";
import Repository from "~/repositories/repository";
import dao from '~/repositories/dao'

class HitRepository extends Repository {

    init() {
        this.repository = dao.connection.define('hit', {
            duration: Sequelize.FLOAT(11),
            velocity: Sequelize.FLOAT(11)
        });
    }
}

export default new HitRepository();