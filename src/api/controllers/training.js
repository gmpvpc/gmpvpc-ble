import express from 'express';
import logger from "~/utils/logger"
import config from '~/config';
import trainingService from '~/service/training'

const api = config.api.training;
const controllerName = "TrainingController";

let trainingController = express.Router();

trainingController.get(api.current, (req, res) => {
    logger.log(`${controllerName}(${req.params.id}): Get current...`);
    let training = trainingService.getCurrent();
    logger.log(`${controllerName}(${req.params.id}): Current gotten.`);
    res.json(training);
});

trainingController.post('/', (req, res) => {
    logger.log(`${controllerName}(): Create...`);
    let training = trainingService.create(...req.body);
    logger.log(`${controllerName}(${req.params.id}): Created.`);
    res.json(training);
});

trainingController.put('/', (req, res) => {
    logger.log(`${controllerName}(${req.params.id})): Update...`);
    let training = trainingService.update(req.params.id, req.body);
    logger.log(`${controllerName}(${req.params.id}): Updated.`);
    res.json(training);
});

export default trainingController;
