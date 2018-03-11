let Jasmine = require('jasmine');
let jasmine = new Jasmine();

jasmine.loadConfigFile('test/jasmine.json');
jasmine.configureDefaultReporter({
    showColors: false
});
jasmine.execute();
