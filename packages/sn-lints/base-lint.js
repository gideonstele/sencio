/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  env: {
    es6: true,
    commonjs: true,
    browser: true,
    node: true,
    'shared-node-browser': true,
  },
  overrides: [
    {
      files: ['**/*.cjs?(x)', '**/*.cts?(x)'],
      env: {
        commonjs: true,
      },
    },
  ],
};
