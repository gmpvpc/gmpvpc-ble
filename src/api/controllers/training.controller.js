import express from 'express';
import config from '../../config';

const cfg = config.api.training;

let trainingController = express.Router();
trainingController.get(cfg.current, (req, res) => {
    res.json({test: "haha"});
});

export default trainingController;
