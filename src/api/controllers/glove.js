import config from '~/config';
import gloveService from '~/services/glove'
import Controller from "~/api/controllers/controller";

class GloveController extends Controller {
    constructor() {
        super("GloveController");
        this.router.post(`/:id${config.api.glove.calibration}`, (req, res) => this.calibration(req, res));
        this.router.get(`/:id`, (req, res) => this.getGlove(req, res));
    }

    calibration(req, res) {
        this.log(req.params.id, `Start calibration...`);
        gloveService.initialize(req.params.id);
        this.log(req.params.id, `Calibration started.`);
        res.end();
    }

    getGlove(req, res) {
        this.log(req.params.id, `Get...`);
        let glove = gloveService.get(req.params.id);
        this.log(req.params.id, `Gotten.`);
        res.json(glove);
    }
}

export default new GloveController();