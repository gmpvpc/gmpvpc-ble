import express from 'express';
import config from '~/config';

const api = config.api.glove;

let gloveController = express.Router();
gloveController.get(`/:id/${api.calibration}`, (req, res) => {
    res.json({test: "haha"});
});

export default gloveController;