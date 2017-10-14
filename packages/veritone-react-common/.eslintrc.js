const env = require('veritone-dev-env');

module.exports = {
  ...env.eslintReact,
  globals: {
    ...env.eslintReact.globals,
    module: true
  },
  env: {
    ...env.eslintReact.env,
    jest: true
  }
};
