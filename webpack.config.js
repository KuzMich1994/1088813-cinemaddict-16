const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  devtool: 'source-map',
  devServer: {
    hot: false,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node__modules)/,
        use: ['babel-loader'],
      },
    ],
  },
};