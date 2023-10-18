/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [require.resolve('./tooling/config-eslint/node')],
  ignorePatterns: [
    'apps/**',
    'packages/**',
    'tooling/**',
    'challenges/**',
    'monaco-editor.d.ts',
    'next-env.d.ts',
  ],
  parserOptions: {
    project: `${__dirname}/tsconfig.json`,
  },
};
