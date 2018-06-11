import express from 'express';
import config from '~/config';
import trainingController from "~/api/controllers/training.controller";
import gloveController from "~/api/controllers/glove.controller";

let router = express.Router();

router.use(config.api.training.root, trainingController);
router.use(config.api.glove.root, gloveController);

export default router;