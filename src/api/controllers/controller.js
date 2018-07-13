import express from "express";
import LogFormat from "~/utils/log-format";

export default class Controller extends LogFormat {
    constructor(name) {
        super(name);
        this.router = express.Router();
    }

    init(router, route) {
        router.use(route, this.router);
    }
}