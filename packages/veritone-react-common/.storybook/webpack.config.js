const path = require('path');

console.log('aaaaaaaaaaaaaa', path.resolve('../../node_modules/file-type'));
console.log('aaaaaaaaaaaaaa', path.resolve('./src'));

module.exports = {
  resolve: {
    alias: {
      helpers: path.join(__dirname, 'src/helpers'),
      components: path.join(__dirname, 'src/components'),
      images: path.join(__dirname, 'src/resources/images'),
    }
  },
  module: {
    // noParse: [],
    rules: [
      // JavaScript / ES6
      {
        test: /\.jsx?$/,
        // exclude: path.resolve('../../node_modules'),
        include: [path.resolve('./src'), path.resolve('../../node_modules/file-type')],
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]--[hash:base64:5]',
            },
          },
          'sass-loader',
        ],
        include: path.resolve('./src'),
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: 'images/[name].[ext]?[hash]',
        },
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
};
