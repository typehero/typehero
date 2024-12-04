/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [require.resolve('@repo/lint/next')],
  ignorePatterns: ['monaco-editor.d.ts'],
};
