const env = require('veritone-dev-env');

module.exports = Object.assign({}, env.eslintReact, {
  globals: Object.assign({}, env.eslintReact.globals, {
    module: true,
    process: true,
    require: true
  }),
  env: Object.assign({}, env.eslintReact.env, {
    jest: true
  })
});
