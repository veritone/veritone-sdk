const env = require('veritone-dev-env');

module.exports = Object.assign({}, env.eslintReact, {
  globals: Object.assign({ module: true }, env.eslintReact.globals),
  env: Object.assign({ jest: true }, env.eslintReact.env),
  plugins: env.eslintReact.plugins.concat('import'),
  rules: Object.assign({ 'import/order': true }, env.eslintReact.rules)
});
