const path = require('path');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'gravit-api.js',
        library: 'GravitApi',
    }
};
