const env = require('veritone-dev-env');

module.exports = Object.assign({}, env.eslintReact, {
  env: Object.assign({}, env.eslintReact.env, { jest: true }),
  plugins: env.eslintReact.plugins.concat('import'),
  rules: Object.assign({}, env.eslintReact.rules, { 'import/order': 2 })
});
