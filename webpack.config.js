var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  entry: './src/scripts/app.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.(svg|jpg|png)$/, loader: 'file-loader' },
      { test: /\.(ttf|woff|woff2|eot)$/, loader: 'file-loader' },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },
      { test: /\.html$/, loader: 'html-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      favicon: 'src/favicon.ico',
      template: './src/index.html'
    }),
    new ExtractTextPlugin('bundle.css')
  ]
};
