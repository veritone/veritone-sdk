const path = require('path');
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = {
  entry: { 'veritone-react-common': ['whatwg-fetch', path.join(__dirname, './src/index.js')] },
  output: {
    filename: 'dist/bundle.js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    alias: {
      helpers: path.join(__dirname, 'src/helpers'),
      components: path.join(__dirname, 'src/components'),
      images: path.join(__dirname, 'src/resources/images'),
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
      },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: 'vsdk[local]--[hash:base64:5]'
            }
          },
          'sass-loader'
        ],
        include: path.resolve('./src')
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: 'images/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  }
};
