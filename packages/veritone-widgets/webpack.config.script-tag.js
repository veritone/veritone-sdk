const path = require('path');
const { readdirSync } = require('fs');

const allWidgets = readdirSync(path.resolve(__dirname, 'src/widgets'));

module.exports = {
  mode: 'production',
  entry: {
    VeritoneApp: path.resolve(__dirname, 'src/shared/VeritoneApp.js'),
    // one entry for each widget
    ...allWidgets.reduce(
      (result, widgetName) => ({
        ...result,
        [widgetName]: path.resolve(
          __dirname,
          `src/widgets/${widgetName}/index.js`
        )
      }),
      {}
    )
  },
  output: {
    library: '[name]',
    libraryTarget: 'umd',
    filename: '[name]-bundle-script.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    // noParse: [],
    rules: [
      // JavaScript / ES6
      {
        test: /\.jsx?$/,
        include: path.resolve('./src'),
        loapder: 'babel-loader'
      }
    ]
  }
};
