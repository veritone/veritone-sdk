module.exports = {
  rules: {
    'no-console': 0,
    'promise/always-return': 'warn',
    'promise/no-return-wrap': 'warn',
    'promise/param-names': 'warn',
    'promise/no-native': 'off',
    'promise/no-nesting': 'warn',
    'promise/no-promise-in-callback': 'warn',
    'promise/no-callback-in-promise': 'off',

    'lodash/prefer-lodash-method': 'off',
    'lodash/import-scope': 'off',
    'lodash/path-style': ['warn', 'as-needed'],
    'lodash/prefer-noop': 'off',

    'no-debugger': 'warn',
    'no-var': 'warn',
    'no-unused-vars': ['warn', { vars: 'all', args: 'none' }],
    'block-scoped-var': 'warn',
    'no-param-reassign': 'warn',
    curly: 'warn',
    'no-tabs': 'warn',
    'require-await': 'warn',

    'react/jsx-no-bind': 'warn',
    'react/jsx-boolean-value': 'warn',
    'react/jsx-handler-names': [
      'off',
      {
        eventHandlerPropPrefix: ''
      }
    ],
    'react/jsx-key': 'warn',
    'react/jsx-no-comment-textnodes': 'warn',
    'react/jsx-pascal-case': ['warn', { allowAllCaps: true }],

    'react/forbid-prop-types': 'warn',
    'react/no-did-mount-set-state': 'warn',
    'react/no-did-update-set-state': 'warn',
    'react/no-array-index-key': 'warn',
    'react/self-closing-comp': [
      'warn',
      {
        component: true,
        html: true
      }
    ],
    'react/sort-comp': 'warn',
    'react/prefer-es6-class': 'warn',
    'react/style-prop-object': 'warn',
    'react/no-unescaped-entities': 'warn',
    'react/default-props-match-prop-types': 'warn',
    'react/forbid-foreign-prop-types': 'warn',
    'react/no-access-state-in-setstate': 'warn',
    'react/no-children-prop': 'warn',
    'react/no-typos': 'warn',
    'react/no-this-in-sfc': 'warn',
    'react/no-unused-prop-types': 'warn',

    'import/named': 'warn',
    'import/no-cycle': 'warn',
  },
  env: {
    es6: true,
    browser: true
  },
  globals: {},
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  plugins: ['react', 'promise', 'lodash', 'import'],
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:react/recommended',
    'plugin:lodash/recommended'
  ]
};
