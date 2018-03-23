const env = require('veritone-dev-env');

module.exports = Object.assign({}, env.eslintReact, {
  globals: Object.assign(
    {
      module: true,
      process: true,
      require: true
    },
    env.eslintReact.globals
  ),
  env: Object.assign(
    {
      jest: true
    },
    env.eslintReact.env
  )
});
