import logger from "~/utils/logger";

export default class LogFormat {
    constructor(name) {
        this.name = name;
    }

    log(id, message) {
        logger.log(`${this.name}(${id}): ${message}`);
    }
}