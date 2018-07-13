import Repository from "~/repositories/repository";
import dao from '~/repositories/dao'
import {hitRepository} from '~/index'
import * as Sequelize from "sequelize/lib/data-types";

export default class SeriesRepository extends Repository {

    init() {
        this.repository = this.dao.connection.define('series', {occurrence: Sequelize.INTEGER, hits: Sequelize.INTEGER});
        hitRepository.hasManyParentAssociation = this.repository.hasMany(hitRepository.repository, {as: 'combinations'});
        this.includes = [{model: hitRepository.repository, as: 'combinations'}];
    }

}