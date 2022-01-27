const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const devMode = process.argv[5] !== 'prod';

const router = require('../config.json');

module.exports = {
  module: {
    rules: [
      //Allows use javascript
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/, //don't test node_modules folder
        use: {
          loader: 'babel-loader',
        },
        resolve: {
          extensions: ['.js', '.jsx'],
        },
      },
      //Allows use of CSS
      {
        test: /(\.css|\.scss)$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      //Allows use of images
      {
        test: /\.(png|jpg|jpeg|svg|gif|woff|woff2|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
      {
        test: /\.(txt|md)$/,
        loader: 'raw-loader',
      },
    ],
  },
  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    //Allows remove/clean the build folder
    new CleanWebpackPlugin(),
    //Allows update react components in real time
    new HotModuleReplacementPlugin(),
    // ESlint
    new ESLintPlugin(),
    //Allows to create an index.html in our build folder
    new HtmlWebpackPlugin({
      baseUrl: devMode ? '/' : `${router.baseUrl}/`,
      title: 'Financeiro',
      // template: path.resolve(__dirname, 'public/index.html'), //we put the file that we created in public folder
      // favicon: path.resolve(__dirname, 'public/favicon.ico'),
      template: './public/index.html', //we put the file that we created in public folder
      favicon: './public/favicon.ico',
      // inject: true,
    }),
    new WebpackManifestPlugin({
      fileName: 'manifest.json',
    }),
    //This get all our css and put in a unique file
    new MiniCssExtractPlugin(),
    // new MiniCssExtractPlugin({
    //   filename: 'styles.bundle.css',
    // }),
    new CopyPlugin({
      patterns: [
        { from: './public/assets', to: 'assets' },
        { from: './public/material-ui-static', to: 'material-ui-static' },
      ],
    }),
    // new Dotenv(),
  ],
  resolve: {
    alias: {
      '@fake-db': path.resolve(__dirname, '../src', '@fake-db'),
      '@fuse': path.resolve(__dirname, '../src', '@fuse'),
      '@history': path.resolve(__dirname, '../src', '@history'),
      '@lodash': path.resolve(__dirname, '../src', '@lodash'),
      app: path.resolve(__dirname, '../src', 'app'),
      api: path.resolve(__dirname, '../src', 'api'),
    },
    fallback: {
      buffer: false,
      crypto: false,
      stream: false,
      // util: false,
      // 'crypto-browserify': require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify
    },
  },
};
