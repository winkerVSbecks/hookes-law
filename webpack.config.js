var path = require('path');
var webpack = require('webpack');

module.exports = {
  // devtool: 'inline-source-map',
  entry: ['./js/index'],
  resolve: {
    extensions: ['', '.js', '.es6.js']
  },
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.es6\.js?$/,
      loader: 'babel?presets[]=es2015',
      include: path.join(__dirname, 'js')
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ]
};
