import seriesService from '~/services/series'
import Controller from "~/api/controllers/controller";

class SeriesController extends Controller {
    constructor() {
        super("SeriesController");
        this.router.get(`/:id`, (req, res) => this.get(req, res));
    }

    get(req, res) {
        this.log(req.params.id, `Get...`);
        let glove = seriesService.get(req.params.id).then(s => {
            this.log(req.params.id, `Gotten.`);
            res.json(glove);
        });
    }
}

export default new SeriesController();