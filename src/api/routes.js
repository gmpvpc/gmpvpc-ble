import express from 'express';
import config from '../config';
import trainingController from "./controllers/training.controller";

let router = express.Router();

router.use(config.api.training.root, trainingController);

export default router;