import morgan from 'morgan';
import config from '../config';

const logger = morgan(config.logger.type);
export default logger;

