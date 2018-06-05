import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';
import logger from './logger';
import config from '../config';

export default class App {
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(logger);
        this.app.use(config.api.root, router);
    }

    start() {
        this.app.listen(config.api.port, function () {
            console.log(`GMPVPC Listenning port ${config.api.port}`);
        });
    }
}