import logger from "~/utils/logger"

export default class Exception {
    constructor(message) {
        this.message = message;
        logger.log(message);
    }
}