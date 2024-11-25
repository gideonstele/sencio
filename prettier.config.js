/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  printWidth: 80,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'avoid',
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrder: [
    '<BUILTIN_MODULES>',
    '',
    'react-dom',
    'react',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@ui/(.*)$',
    '^[.]',
    '^(?!.*[.]css$)[./].*$',
    '.css$',
  ],
  importOrderParserPlugins: ['typescript', 'jsx'],
  importOrderTypeScriptVersion: '5.0.0',
  importOrderCaseSensitive: false,
};

export default config;
