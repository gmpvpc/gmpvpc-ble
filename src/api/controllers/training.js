import express from 'express';
import logger from "~/utils/logger"
import config from '~/config';
import trainingService from '~/service/training'

const api = config.api.training;
const controllerName = "TrainingController";

let trainingController = express.Router();

trainingController.get(api.current, (req, res) => {
    logger.log(`${controllerName}(${req.params.id}): Get current...`);
    let training = null;
    trainingService.getCurrent().then(r => training = r);
    logger.log(`${controllerName}(${req.params.id}): Current gotten.`);
    res.json(training);
});

export default trainingController;
