var faker = require('faker');

module.exports = {
    path: '/api/training',
    method: 'POST',
    template: () => {
        return {
            id: faker.random.number(),
            creationDate: faker.date.past(),
            updateDate: faker.date.recent(),
            status: "IN_PROGRESS"
        }
    }
}