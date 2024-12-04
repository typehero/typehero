/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [require.resolve('@repo/lint/node')],
  rules: {
    'import/no-extraneous-dependencies': 'off',
  },
};
