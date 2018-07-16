import logger from "~/utils/logger"
import config from '~/config';
import trainingService from '~/services/training'
import Controller from "~/api/controllers/controller";

class TrainingController extends Controller {

    constructor() {
        super("TrainingController");
        this.router.get(config.api.training.current, (req, res) => this.getCurrent(req, res));
        this.router.post('/', (req, res) => this.create(req, res));
        this.router.put('/:id', (req, res) => this.update(req, res));
    }

    getCurrent(req, res) {
        this.log(req.params.id, `Get current...`);
        trainingService.getCurrent().then(t => {
            this.log(req.params.id, `Current gotten.`);
            res.json(t);
        });
    }

    create(req, res) {
        this.log("", `Create...`);
        trainingService.create(...req.body).then(t => {
            this.log(t.id, `Created.`);
            res.json(t);
        });
    }

    update(req, res) {
        this.log(req.params.id, `Update...`);
        trainingService.update(req.params.id, req.body).then(t => {
            this.log(req.params.id, `Updated.`);
            res.json(t);
        });
    }
}

export default new TrainingController();
