const path = require('path');
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = {
  entry: { 'veritone-redux-common': path.join(__dirname, './src/index.js') },
  output: {
    filename: 'dist/bundle.js',
    libraryTarget: 'umd',
    library: 'veritone-redux-common',
    umdNamedDefine: true
  },
  resolve: {
    alias: {
      helpers: path.join(__dirname, 'src/helpers'),
      modules: path.join(__dirname, 'src/modules'),
      util: path.join(__dirname, 'src/util'),
    },
  },
  plugins: [
    new MinifyPlugin()
  ],
  module: {
    // noParse: [],
    rules: [
      // JavaScript / ES6
      {
        test: /\.jsx?$/,
        include: path.resolve('./src'),
        loader: 'babel-loader'
      }
    ]
  }
};
