/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: [
    'plugin:react/jsx-runtime',
    'plugin:jsx-a11y/recommended',
    'plugin:import/warnings',
    'prettier',
  ],
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'import'],
  rules: {
    'import/order': ['warn'],
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      extends: ['plugin:import/recommended', 'plugin:import/typescript'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
    },
    {
      files: ['**/*.cjs?(x)', '**/*.cts?(x)'],
      env: {
        commonjs: true,
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/ignore': ['node_modules', '\\.(json|css|less|scss|sass)$'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: ['apps/**/tsconfig.json', 'packages/**/tsconfig.json', 'tsconfig.json'],
      },
      node: true,
    },
    'import/cache': {
      lifetime: 1000,
    },
  },
};
