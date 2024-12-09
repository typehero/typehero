const path = require('node:path');
const { overrides } = require('./utils/overrides');
const { rules } = require('./utils/rules');

module.exports = {
  extends: [
    'turbo',
    'plugin:@typescript-eslint/recommended',
    ...['@vercel/style-guide/eslint/node', '@vercel/style-guide/eslint/typescript'].map((config) =>
      require.resolve(config),
    ),
  ],
  ignorePatterns: ['node_modules/', 'dist/'],
  overrides: [
    ...overrides,
    {
      files: ['**/*.test.*'],
      extends: [require.resolve('@vercel/style-guide/eslint/jest')],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },
    {
      files: ['*.config.*'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
    {
      files: ['**/turbo/generators/config.*'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
  parserOptions: {
    projectService: {
      allowDefaultProject: ['*.config.*'],
    },
    tsconfigRootDir: path.join(__dirname, '../..'),
  },
  root: true,
  rules,
};
