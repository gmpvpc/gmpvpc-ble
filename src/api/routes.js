import express from 'express';
import config from '~/config';
import trainingController from "~/api/controllers/training";
import gloveController from "~/api/controllers/glove";
import seriesController from "~/api/controllers/series";
import deviceController from "~/api/controllers/device";

class Routes {
    constructor() {
        this.router = express.Router();
        trainingController.init(this.router, config.api.training.root);
        gloveController.init(this.router, config.api.glove.root);
        seriesController.init(this.router, config.api.series.root);
        deviceController.init(this.router, config.api.device.root);
    }
}

export default new Routes();