const dyson = require('dyson');
const path = require('path');

const options = {
    configDir: path.join(__dirname, 'api'),
    port: 8080
};

const configs = dyson.getConfigurations(options);
const appBefore = dyson.createServer(options);
const appAfter = dyson.registerServices(appBefore, options, configs);

console.log(`Dyson listening at port ${options.port}`);