/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [require.resolve('@repo/lint/node')],
  parserOptions: {
    project: `${__dirname}/tsconfig.json`,
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
  },
};
