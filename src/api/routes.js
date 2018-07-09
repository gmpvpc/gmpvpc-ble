import express from 'express';
import config from '~/config';
import trainingController from "~/api/controllers/training";
import gloveController from "~/api/controllers/glove";
import seriesController from "~/api/controllers/series";
import deviceController from "~/api/controllers/device";

let router = express.Router();

router.use(config.api.training.root, trainingController);
router.use(config.api.glove.root, gloveController);
router.use(config.api.series.root, seriesController);
router.use(config.api.device.root, deviceController);

export default router;