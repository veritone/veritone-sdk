module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  rules: {
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'export']
      }
    ],
    'no-eol-whitespace': null,
    'declaration-empty-line-before': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['import', 'include', 'mixin', 'if']
      }
    ],
    'declaration-colon-newline-after': null, // prettier conflict
    'value-list-comma-newline-after': null
  }
};
