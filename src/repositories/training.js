import * as Sequelize from "sequelize/lib/data-types";
import Repository from "~/repositories/repository";
import TrainingStatus from "~/models/dao/training-status";
import dao from '~/repositories/dao'
import seriesRepository from '~/repositories/series'

class TrainingRepository extends Repository {

    init() {
        this.repository = dao.connection.define('training', {status: Sequelize.STRING(25)});
        this.repository.hasMany(seriesRepository.repository, {as: 'series'});
    }

    getCurrent() {
        return this.repository.findOne({
            where: {status: TrainingStatus.IN_PROGRESS}
        });
    }

}

export default new TrainingRepository();