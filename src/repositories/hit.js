import * as Sequelize from "sequelize/lib/data-types";
import dao from '~/repositories/dao'
import Repository from "~/repositories/repository";

class HitRepository extends Repository {

    init() {
        this.repository = dao.connection.define('hit', {
            duration: {
                type: Sequelize.FLOAT(11)
            },
            velocity: {
                type: Sequelize.FLOAT(11)
            }
        });
    }
}

export default new HitRepository();