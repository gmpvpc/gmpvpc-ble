export default class Repository {

    constructor(dao) {
        this.dao = dao;
        this.dao.repositories.push(this);
        this.repository = null;
        this.hasManyParentAssociation = null;
    }

    create(object) {
        if (this.hasManyParentAssociation != null) {
            this.hasManyParentAssociation.add(object)
        } else {
            return this.repository.create(object);
        }
    }

    get(id) {
        return this.repository.findById(id);
    }

    update(id, data) {
        return this.repository.update(data, {where: id});
    }
}
