import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * ESLint configuration
 *
 * @see https://eslint.org/docs/user-guide/configuring
 * @type {import("eslint").Linter.Config}
 */
export default tseslint.config(
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    ...eslint.configs.recommended,
    rules: {
      ...eslint.configs.recommended.rules,
      'no-console': ['off'],
      'no-unused-vars': ['warn', { args: 'none' }],
      'no-undef': 'warn',
    },
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,ts,jsx,tsx}', '*/**/*.d.ts'],
    ignores: ['**/dist/**/*', '**/.turbo/**/*', '**/.temp/**/*'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: [
          './tsconfig.node.json',
          './examples/*/tsconfig.app.json',
          './examples/*/tsconfig.node.json',
          './packages/*/tsconfig.json',
          './packages/*/tsconfig.node.json',
        ],
      },
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks:
            '(useIsomorphicLayoutEffect|useTrackedEffect|useDeepCompareEffect|useDeepCompareLayoutEffect|useAsyncEffect|useDebounceEffect|useUpdateEffect|useUpdateLayoutEffect)',
        },
      ],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': ['warn'],
      '@typescript-eslint/ban-ts-comment': ['warn'],
    },
    settings: {
      react: { version: '18.3' },
    },
  },
  {
    files: [
      '**/tsup.config.{js,ts}',
      '**/vite.config.{js,ts}',
      '**/vitesse.config.{js,ts}',
      '**/tsup.config.*.{js,ts}',
      '**/vite.config.*.{js,ts}',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.nodeBuiltin,
      },
    },
  },
  {
    files: ['**/*.{cjs,cts}'],
    languageOptions: {
      sourceType: 'commonjs',
    },
    rules: {
      'import/no-commonjs': 'off',
    },
  },
);
