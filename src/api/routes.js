import express from 'express';
import config from '~/config';
import trainingController from "~/api/controllers/training";
import gloveController from "~/api/controllers/glove";
import seriesController from "~/api/controllers/series";

let router = express.Router();

router.use(config.api.training.root, trainingController);
router.use(config.api.glove.root, gloveController);
router.use(config.api.series.root, seriesController);

export default router;