import express from 'express';
import config from '~/config';

const api = config.api.training;

let trainingController = express.Router();
trainingController.get(api.current, (req, res) => {
    res.json({test: "haha"});
});

export default trainingController;
