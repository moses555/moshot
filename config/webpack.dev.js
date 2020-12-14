const { merge } = require('webpack-merge');
const commonConfiguration = require('./webpack.common.js');

module.exports = merge(commonConfiguration, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    host: 'localhost',
    contentBase: '../build',
    open: true,
    https: false,
    port: 80,
  },
});
