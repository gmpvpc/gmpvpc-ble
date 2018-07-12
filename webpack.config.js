// ONLY FOR IDEA SUPPORT OF ROOT BABEL PLUGIN
// This project doesn't use webpack ...
const path = require('path');
module.exports = {
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './')
    },
    resolve: {
        alias: {
            root: path.join(__dirname, 'src/'),
            '~': path.resolve(__dirname, "src/"),
        }
    }
};