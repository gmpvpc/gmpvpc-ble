import config from '~/config';
import deviceService from '~/services/device'
import Controller from "~/api/controllers/controller";

class DeviceController extends Controller {

    constructor() {
        super("DeviceController");
        this.router.post(`${config.api.device.register}/:uid`, (req, res) => this.register(req, res));
        this.router.delete(`${config.api.device.unregister}/:uid`, (req, res) => this.unregister(req, res));
        this.router.post(`${config.api.device.info}/:uid`, (req, res) => this.info(req, res));
        this.router.get(`${config.api.device.version}/:uid`, (req, res) => this.version(req, res));
    }

    register(req, res) {
        this.log(req.params.uid, `Register...`);
        deviceService.register(req.params.uid).then(d => {
            this.log(req.params.uid, `Registered.`);
            res.json(d);
        });
    };

    unregister(req, res) {
        this.log(req.params.uid, `Unregister...`);
        deviceService.unregister(req.params.uid).then(d => {
            this.log(req.params.uid, `Unregistered.`);
            res.json(d);
        });
    };

    info(req, res) {
        this.log(req.params.uid, `Info...`);
        deviceService.info(req.params.uid, req.body).then(d => {
            this.log(req.params.uid, `Info saved.`);
            res.json(d);
        });
    };

    version(req, res) {
        this.log(req.params.uid, `Version...`);
        deviceService.version(req.params.uid).then(v => {
            this.log(req.params.uid, `Version gotten.`);
            res.json(v);
        });
    };
}

export default new DeviceController();