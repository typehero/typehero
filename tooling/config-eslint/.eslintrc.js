/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [require.resolve('./node.js')],
  parserOptions: {
    project: `${__dirname}/tsconfig.json`,
  },
  rules: {
    'no-console': 'off',
  },
};
