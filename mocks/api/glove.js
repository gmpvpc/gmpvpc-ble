var faker = require('faker');

module.exports = {
    cache: false,
    path: '/api/glove/:id',
    method: 'GET',
    template: () => {
        return { calibrated: faker.random.number() % 5 == 0 }
    }
}