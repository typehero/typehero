/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [require.resolve('@repo/lint/node')],
  rules: {
    // This is here because eslint-turbo currently does not detect
    // Workspace Configurations correctly.
    // This should end up getting fixed in the future.
    'turbo/no-undeclared-env-vars': [
      'error',
      {
        allowList: ['GH_TOKEN'],
      },
    ],
  },
};
