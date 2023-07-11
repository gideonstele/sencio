/**
 * @type {import('prettier').Options)}
 */
module.exports = {
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  printWidth: 80,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'avoid',
  plugins: [require('prettier-plugin-tailwindcss')],
  tailwindFunctions: ['clsx', 'classed'],
};
