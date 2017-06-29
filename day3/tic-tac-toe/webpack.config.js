var webpack = require('webpack');

module.exports = {
  entry: './app.js',
  output: {
    path: __dirname + '/',
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react'],
            plugins: ['transform-object-rest-spread']
          }
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
