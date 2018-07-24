const path = require('path');

module.exports = {
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
              localIdentName: '[local]--[hash:base64:5]'
            }
          },
          'sass-loader'
        ],
        include: [
          path.resolve('./src'),
          path.resolve('./node_modules'),
          path.resolve('../../node_modules')
        ]
      },
      {
        // global css (from other packages) in .css files
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: 'images/[name].[ext]?[hash]'
        }
      }
    ]
  }
};
