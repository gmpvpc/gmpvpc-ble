import Repository from "~/repositories/repository";
import dao from '~/repositories/dao'
import hitRepository from '~/repositories/hit'

class SeriesRepository extends Repository {

    init() {
        this.repository = dao.connection.define('series', {});
        this.repository.hasMany(hitRepository.repository, {as: 'combinations'});
    }

}

export default new SeriesRepository();