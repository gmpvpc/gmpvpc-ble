import * as Sequelize from "sequelize/lib/data-types";
import sequelize from '~/repositories/config'
import logger from '~/utils/logger';

const repositoryName = "HitRepository";

class HitRepository {
    constructor() {
        this.repository = null;
    }
    init() {
        this.repository = sequelize.define('hit', {
            duration: {
                type: Sequelize.FLOAT(11)
            },
            velocity: {
                type: Sequelize.FLOAT(11)
            }
        });
        this.repository.sync().then(() => {
            logger.log(`${repositoryName}: Synced.`)
        });
    }
}

export default new HitRepository();