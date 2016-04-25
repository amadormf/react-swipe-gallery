const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//const path = require('path');
module.exports = {
  //context: path.resolve(__dirname, '..'),
  entry: {
    index: [
      './src/index.js',
    ],
  },
  output: {
    path: './lib',
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/lib/',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/, loaders: ['babel'],
      },
      {
        test: /\.json$/, loader: 'json-loader',
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('stylus', 'css-loader!stylus-loader'),
      },
    ],
  },
  progress: true,
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules',
    ],
    extensions: ['', '.json', '.js', '.jsx'],
  },
  plugins: [
    new ExtractTextPlugin('[name].css', {allChunks: true}),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),

    // ignore dev config
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ],
};
