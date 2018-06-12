import Sequelize from 'sequelize';
import logger from '~/utils/logger';
import config from '~/config';

const dao = new Sequelize(config.dao.uri);

dao.authenticate()
    .then(() => {
        logger.log('Repository: Connection has been established successfully.');
    })
    .catch(err => {
        logger.log(`Repository: Unable to connect to the database: ${err}`);
    });

export default dao;