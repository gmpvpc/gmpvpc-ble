import * as Sequelize from "sequelize/lib/data-types";
import Repository from "~/repositories/repository";

export default class DeviceRepository extends Repository {
    init() {
        this.repository = this.dao.connection.define('device', {
            uid: Sequelize.STRING(10),
            version: Sequelize.STRING(5),
            uptime: Sequelize.FLOAT(11),
            lastSync: Sequelize.DATE
        });
    }

    findByUid(uid) {
        return this.repository.findOne({where: {uid}});
    }

    deleteByUid(uid) {
        return this.repository.destroy({where: {uid}});
    }
}