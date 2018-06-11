import express from 'express';
import config from '~/config';
import training from "~/api/controllers/training";
import glove from "~/api/controllers/glove";

let router = express.Router();

router.use(config.api.training.root, training);
router.use(config.api.glove.root, glove);

export default router;