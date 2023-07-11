/**
 * @type {import('stylelint').Configuration')}
 */
module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-tailwindcss'],
  rules: {
    'font-family-name-quotes': 'always-unless-keyword',
    'string-quotes': 'single',
    'max-nesting-depth': [
      2,
      {
        ignore: ['blockless-at-rules', 'pseudo-classes'],
      },
    ],
    'max-line-length': 100,
    'declaration-block-no-duplicate-properties': true,
    'no-duplicate-selectors': true,
    'selector-class-pattern': '([a-z][a-z0-9]*)((-|__)[a-z0-9]+)*$',
    'value-no-vendor-prefix': [
      true,
      {
        ignoreValues: ['box'],
      },
    ],
  },
  overrides: [
    {
      files: ['*.scss', '**/*.scss'],
      extends: ['stylelint-config-standard-scss'],
    },
  ],
  defaultSeverity: 'warning',
  ignoreDisables: false,
  fix: true,
};
