const { rules } = require('./utils/rules');

module.exports = {
  extends: [
    'turbo',
    ...['@vercel/style-guide/eslint/node', '@vercel/style-guide/eslint/typescript'].map((config) =>
      require.resolve(config),
    ),
  ],
  ignorePatterns: ['node_modules/', 'dist/'],
  overrides: [
    {
      files: ['**/*.test.*'],
      extends: [require.resolve('@vercel/style-guide/eslint/jest')],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        'jest/valid-expect': 'off',
      },
    },
    {
      files: ['jest.config.*', 'vite.config.*', 'tsup.config.*', 'drizzle.config.ts'],
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
    project: `${__dirname}/tsconfig.json`,
  },
  root: true,
  rules,
  // settings: {
  //   'import/resolver': {
  //     typescript: {
  //       project,
  //     },
  //   },
  // },
};
