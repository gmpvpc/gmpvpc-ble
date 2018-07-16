import logger from "~/utils/logger";

export default class LogFormat {
    constructor(name) {
        this.name = name;
    }

    log(id, message) {
        if (!id || id === "") {
            logger.log(`${this.name}: ${message}`);
            return;
        }
        if (!message) {
            logger.log(`${this.name}: ${id}`);
            return;
        }
        logger.log(`${this.name}(${id}): ${message}`);
    }
}