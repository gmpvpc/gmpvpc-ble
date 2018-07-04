import express from 'express';
import logger from '~/utils/logger'
import config from '~/config';
import seriesService from '~/services/series'

const api = config.api.series;
const controllerName = "SeriesController";

let seriesController = express.Router();

seriesController.get(`/:id`, (req, res) => {
    logger.log(`${controllerName}(${req.params.id}): Get...`);
    let glove = seriesService.get(req.params.id).then(s => {
        logger.log(`${controllerName}(${req.params.id}): Gotten.`);
        res.json(glove);
    });
});

export default seriesController;