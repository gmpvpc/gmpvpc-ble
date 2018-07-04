import express from 'express';
import logger from '~/utils/logger'
import config from '~/config';
import gloveService from '~/services/glove'

const api = config.api.glove;
const controllerName = "GloveController";

let gloveController = express.Router();

gloveController.post(`/:id${api.calibration}`, (req, res) => {
    logger.log(`${controllerName}(${req.params.id}): Start calibration...`);
    gloveService.initialize(req.params.id);
    logger.log(`${controllerName}(${req.params.id}): Calibration started.`);
    res.end();
});

gloveController.get(`/:id`, (req, res) => {
    logger.log(`${controllerName}(${req.params.id}): Get...`);
    let glove = gloveService.get(req.params.id);
    logger.log(`${controllerName}(${req.params.id}): Gotten.`);
    res.json(glove);
});

export default gloveController;