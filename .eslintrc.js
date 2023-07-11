module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.js', '*.cjs', '*.mjs'],
      env: {
        node: true,
        es6: true,
        es2022: true,
      },
    },
    {
      files: ['*.cjs'],
      env: {
        commonjs: true,
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: [require.resolve('base-lints/base')],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./apps/*/tsconfig.json', './packages/*/tsconfig.json'],
      },
    },
  ],
};
