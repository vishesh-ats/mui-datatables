import js from '@eslint/js';
import babelParser from '@babel/eslint-parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import filenamesPlugin from 'eslint-plugin-filenames';
import globals from 'globals';

export default [
  // Base ESLint recommended rules
  js.configs.recommended,

  // Global configuration
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 2020,
        sourceType: 'module',
        allowImportExportEverywhere: true,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
        ...globals.mocha,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/extensions': ['.js'],
      'import/parser': '@babel/eslint-parser',
      'import/resolver': {
        node: {
          extensions: ['.js'],
        },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin,
      filenames: filenamesPlugin,
    },
    rules: {
      // JSX a11y recommended rules
      ...jsxA11yPlugin.flatConfigs.recommended.rules,

      // Custom rules
      'no-console': 'off',
      semi: 2,
      'no-undef': 2,
      'no-undef-init': 2,
      'no-tabs': 2,
      'no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^[A-Z]|^_',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-irregular-whitespace': 'warn',
      'no-useless-escape': 'warn',
      'no-extra-boolean-cast': 'warn',

      // React rules
      'react/self-closing-comp': 2,
      'react/no-typos': 2,
      'react/jsx-no-duplicate-props': 'warn',
      'react/jsx-uses-vars': 'error',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // JSX a11y rules (override)
      'jsx-a11y/no-autofocus': [
        2,
        {
          ignoreNonDOM: true,
        },
      ],
    },
  },

  // More lenient rules for examples directory
  {
    files: ['examples/**/*.{js,jsx}'],
    rules: {
      'no-unused-vars': 'off',
      'no-irregular-whitespace': 'off',
      'no-useless-escape': 'off',
      'no-extra-boolean-cast': 'off',
    },
  },

  // Ignore patterns
  {
    ignores: ['node_modules/**', 'dist/**', '.next/**', 'docs/.next/**', 'docs/export/**', 'coverage/**'],
  },
];
