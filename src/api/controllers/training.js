import express from 'express';
import logger from "~/utils/logger"
import config from '~/config';
import trainingService from '~/services/training'

const api = config.api.training;
const controllerName = "TrainingController";

let trainingController = express.Router();

trainingController.get(api.current, (req, res) => {
    logger.log(`${controllerName}(${req.params.id}): Get current...`);
    trainingService.getCurrent().then(t => {
        logger.log(`${controllerName}(${req.params.id}): Current gotten.`);
        res.json(t);
    });
});

trainingController.post('/', (req, res) => {
    logger.log(`${controllerName}(): Create...`);
    trainingService.create(...req.body).then(t => {
        logger.log(`${controllerName}(${t.id}): Created.`);
        res.json(t);
    });
});

trainingController.put('/:id', (req, res) => {
    logger.log(`${controllerName}(${req.params.id})): Update...`);
    trainingService.update(req.params.id, req.body).then(t => {
        logger.log(`${controllerName}(${req.params.id}): Updated.`);
        res.json(t);
    });
});

export default trainingController;
