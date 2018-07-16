export default class Repository {

    constructor(dao) {
        this.dao = dao;
        this.dao.repositories.push(this);
        this.repository = null;
        this.hasManyParentAssociation = null;
        this.includes = [];
    }

    create(object) {
        // if (this.hasManyParentAssociation != null) {
        //     this.hasManyParentAssociation.add(object);
        // } else {
            return this.repository.create(object, {include: this.includes});
        // }
    }

    get(id) {
        return this.repository.findById(id, {include: this.includes});
    }

    update(id, data) {
        return this.repository.update(data, {returning: true, where: {id}, include: this.includes});
    }
}
