const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'main.[hash].js',
    path: path.join(__dirname, '../build'),
  },
  optimization: {
    minimize: true,
  },
});
