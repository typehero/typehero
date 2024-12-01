const path = require("path");
const { rules } = require('./utils/rules');

module.exports = {
  extends: [
    'turbo',
    ...['@vercel/style-guide/eslint/node', '@vercel/style-guide/eslint/typescript'].map((config) =>
      require.resolve(config),
    ),
    'plugin:@typescript-eslint/recommended'
  ],
  ignorePatterns: ['node_modules/', 'dist/'],
  overrides: [
    {
      files: ['**/*.test.*'],
      extends: [require.resolve('@vercel/style-guide/eslint/jest')],
      rules: {
        // '@typescript-eslint/no-explicit-any': 'off',
        // '@typescript-eslint/no-unsafe-assignment': 'off',
        // 'jest/valid-expect': 'off',
      },
    },
    {
      files: ['*.config.ts'],
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
    {
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      files: ['.eslintrc.js'],
    },
  ],
  parserOptions: {
    projectService: {
      allowDefaultProject: ["*.config.*"]
    },
    tsconfigRootDir: path.join(__dirname, "../..")
  },
  root: true,
  rules,
};
