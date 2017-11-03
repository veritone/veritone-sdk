const env = require('veritone-dev-env');

module.exports = {
  ...env.eslintReact,
  globals: {
    ...env.eslintReact.globals,
    module: true,
    process: true,
    require: true
  }
  // env: {
  //   ...env.eslintReact.env,
  //   jest: true
  // }
};
