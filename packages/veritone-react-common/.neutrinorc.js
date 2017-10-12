const { merge } = require('neutrino-middleware-compile-loader');
const path = require('path');

const extraBabelPlugins = [
  'babel-plugin-transform-decorators-legacy',
].map(require.resolve);

module.exports = {
  options: {
    tests: 'src'
  },
  use: [
    [
      'neutrino-preset-react',
      {
        html: { title: 'Dora' }
      }
    ],
    [
      'neutrino-preset-jest',
      {
        setupFiles: [
          path.resolve('./test/testSuitePolyfills.js'),
          path.resolve('./test/configureEnzyme.js')
        ]
      }
    ],
    [
      'neutrino-middleware-styles-loader',
      {
        cssModules: true,
        extractCSS: true,
        sourceMap: true,
        minimize: true
      }
    ],
    neutrino =>
      neutrino.config.module
        .rule('compile')
        .use('babel')
        .tap(options =>
          merge(
            {
              plugins: extraBabelPlugins,
              env: {
                development: {
                  plugins: extraBabelPlugins
                }
                // test: {
                //   plugins: extraBabelPlugins
                // },
              }
            },
            options
          )
        )
  ]
};
