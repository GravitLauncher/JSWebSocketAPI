const path = require('path');

const mode = [{
    mode: 'production',
    filename: 'gravit-api.min.js',
},{
    mode: 'development',
    filename: 'gravit-api.js',
}]

module.exports = mode.map(c => {
    return {
        mode: c.mode,
        devtool: 'source-map',
        target: 'web',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: c.filename,
            library: 'GravitApi',
        }
    }
})