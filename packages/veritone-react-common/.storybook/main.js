const custom = require('./webpack.config.js');

module.exports = {
  stories: ['../**/story.js'],
  addons: ['@storybook/addon-essentials'],
  webpackFinal: (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        ...custom.resolve,
      },
      module: {
        ...config.module,
        rules: [...config.module.rules, ...custom.module.rules],
      },
    };
  },
};
