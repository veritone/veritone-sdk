module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global']
      }
    ],
    'no-eol-whitespace': null,
    'declaration-empty-line-before': null,
    'at-rule-no-unknown': ['always', {
      ignoreAtRules: ["import", "include"]
    }],
  }
};
