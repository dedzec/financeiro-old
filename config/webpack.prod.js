const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const router = require('../config.json');

module.exports = merge(common, {
  // devtool: 'source-map',
  mode: 'production',
  entry: {
    app: './src/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    // path: path.resolve(__dirname, 'dist'),
    path: path.resolve(__dirname, '../build'),
    // publicPath: `${router.baseUrl}`,
    publicPath: 'https://dombarreto.com' + `${router.baseUrl}/`,
    // publicPath: 'https://financeiro.dombarreto.com',
    clean: true,
  },
});
