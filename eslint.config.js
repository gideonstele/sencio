import eslint from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactPlugin from 'eslint-plugin-react';
import tsParser from '@typescript-eslint/parser';
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
    files: ['**/*.{ts,mts,cts,tsx}', '*/**/*.d.ts'],
    ignores: ['**/dist/**/*', '**/.turbo/**/*', '**/.temp/**/*'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
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
  },
  {
    files: ['**/*.{js,mjs,ts,jsx,tsx}', '*/**/*.d.ts'],
    ignores: ['**/dist/**/*', '**/.turbo/**/*', '**/.temp/**/*'],
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    plugins: {
      ...reactPlugin.configs.flat.recommended.plugins,
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks:
            '(useIsomorphicLayoutEffect|useTrackedEffect|useDeepCompareEffect|useDeepCompareLayoutEffect|useAsyncEffect|useDebounceEffect|useUpdateEffect|useUpdateLayoutEffect)',
        },
      ],
    },
    settings: {
      react: { version: '18.3' },
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
