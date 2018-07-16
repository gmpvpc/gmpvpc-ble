import * as Sequelize from "sequelize/lib/data-types";
import Repository from "~/repositories/repository";
import TrainingStatus from "~/models/dao/training-status";
import {seriesRepository} from '~/index'

export default class TrainingRepository extends Repository {

    init() {
        this.repository = this.dao.connection.define('training', {status: Sequelize.STRING(25)});
        seriesRepository.hasManyParentAssociation = this.repository.hasMany(seriesRepository.repository, {as: 'series'});
        this.includes = [{model: seriesRepository.repository, as: 'series'}];
    }

}