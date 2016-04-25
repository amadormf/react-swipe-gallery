// IMPORTANT
// ---------
// This is an auto generated file with React CDK.
// Do not modify this file.
// Use `.storybook/user/modify_webpack_config.js instead`.

const path = require('path');
const updateConfig = require('./user/modify_webpack_config');

const config = {
  module: {
    loaders: [
      {
        test: /\.styl$/,
        loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]!stylus?outputStyle=expanded&sourceMap',
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[local]',
        ],
      },
    ],
  },
};

updateConfig(config);
module.exports = config;
