import express from 'express';
import bodyParser from 'body-parser';
import logger from '~/utils/logger';
import config from '~/config';
import routes from "~/api/routes";

export default class App {
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(logger.morgan);
        this.app.use(config.api.root, routes.router);
    }

    start() {
        logger.log(`GMPVPC Start ...`);
        this.app.listen(config.api.port, () => {
            logger.log(`GMPVPC Listening port ${config.api.port}`);
        });
    }
}