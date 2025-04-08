const js = require('@eslint/js');
const ts = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');
const globals = require('globals');

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    ignores: ['dist', 'node_modules', 'coverage', 'build', '*.log', '.env'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'script',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': ts,
      prettier: prettier,
    },
    rules: {
      ...ts.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.test.ts'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {},
  },
];
