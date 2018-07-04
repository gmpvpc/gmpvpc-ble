export default class Repository {

    constructor(dao) {
        this.dao = dao;
        this.repository = null;
    }

    create(object) {
        return this.repository.create(object);
    }

    get(id) {
        return this.repository.findById(id);
    }

    update(id, data) {
        return this.repository.update(data, {where: id});
    }
}
