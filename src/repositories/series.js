import Repository from "~/repositories/repository";
import dao from '~/repositories/dao'
import {hitRepository} from '~/index'

export default class SeriesRepository extends Repository {

    init() {
        this.repository = this.dao.connection.define('series', {});
        this.repository.hasMany(hitRepository.repository, {as: 'combinations'});
    }

}