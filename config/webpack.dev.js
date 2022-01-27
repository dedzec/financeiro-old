const path = require('path');
const { networkInterfaces } = require('os');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const nets = networkInterfaces();
// const results = Object.create(null); // Or just '{}', an empty object
let localhost = [];

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    if (net.family === 'IPv4' && !net.internal) {
      // if (!results[name]) {
      //   results[name] = [];
      // }
      // results[name].push(net.address);
      localhost = net.address;
    }
  }
}

module.exports = merge(common, {
  devtool: 'eval-source-map',
  mode: 'development',
  entry: {
    app: './src/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  devServer: {
    // inline: false,
    historyApiFallback: true,
    host: localhost,
    port: 3010,
    hot: false,
    // compress: true,
    // https: {
    //   minVersion: 'TLSv1.1',
    //   key: fs.readFileSync(path.join(__dirname, './server.key')),
    //   pfx: fs.readFileSync(path.join(__dirname, './server.pfx')),
    //   cert: fs.readFileSync(path.join(__dirname, './server.crt')),
    //   ca: fs.readFileSync(path.join(__dirname, './ca.pem')),
    //   passphrase: 'webpack-dev-server',
    //   requestCert: true,
    // },
    // allowedHosts: ['local.dev.net'],
    // open: 'chrome',
    open: {
      // This doesn't actually work
      app: ['chrome'],
    },
  },
});
