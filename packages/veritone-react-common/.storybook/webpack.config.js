const path = require('path');

module.exports = {
  resolve: {
    alias: {
      helpers: path.resolve('./src/helpers'),
      components: path.resolve('./src/components'),
      images: path.resolve('./src/resources/images'),
    },
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
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
    ],
  },
};
