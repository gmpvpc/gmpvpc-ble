import dao from '~/repositories/dao'
import seriesRepository from '~/repositories/series'
import Repository from "./repository";

class TrainingRepository extends Repository {

    init() {
        this.repository = dao.connection.define('training', {});
        this.repository.hasMany(seriesRepository.repository, {as: 'series'});
    }

}

export default new TrainingRepository();