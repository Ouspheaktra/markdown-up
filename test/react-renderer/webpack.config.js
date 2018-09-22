const path = require('path');

module.exports = {
    entry: './test/react-renderer/index.js',
    output: {
        filename: '_bundle.js',
        path: path.resolve('./test/react-renderer/')
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};