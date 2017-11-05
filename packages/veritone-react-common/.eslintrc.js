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
  },
  plugins: [
    ...env.eslintReact.plugins,
    'import'
  ],
  rules: {
    ...env.eslintReact.rules,
    'import/order': 2
  }
};
