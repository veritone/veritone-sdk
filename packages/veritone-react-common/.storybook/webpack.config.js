const path = require('path');

module.exports = {
  resolve: {
    alias: {
      helpers: path.join(__dirname, '../src/helpers')
    },
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        loaders: ["style-loader", {
          loader: "css-loader",
          options: {
            modules: true,
            localIdentName: '[local]--[hash:base64:5]'
          }}, "sass-loader"],
        include: path.resolve(__dirname, '../')
      }
    ]
  }
}