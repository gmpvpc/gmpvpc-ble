import GloveConnector from "glove/glove-connector";

class HitService {
    constructor() {
        this.gloves = new Map();
    }

    initialize() {
        this.gloves.set(config.glove.address, new GloveConnector(config.glove.address, this.dataProcessing));
    }

    dataProcessing = (glove, point, movement) => {

    }

}

export default new HitService();