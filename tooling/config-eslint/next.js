const path = require("path");
const { rules } = require('./utils/rules');

module.exports = {
  extends: [
    'turbo',
    ...[
      '@vercel/style-guide/eslint/browser',
      '@vercel/style-guide/eslint/node',
      '@vercel/style-guide/eslint/react',
      '@vercel/style-guide/eslint/next',
      '@vercel/style-guide/eslint/typescript',
    ].map((config) => require.resolve(config)),
    'plugin:@typescript-eslint/recommended'
  ],
  ignorePatterns: ['**/.next/**', '**/.eslintrc.cjs', '**/node_modules/**', 'public/**'],
  overrides: [
    {
      files: ['**/route.tsx'],
      rules: {
        '@next/next/no-img-element': 'off',
        'jsx-a11y/alt-text': 'off',
      },
    },
    {
      files: [
        'pages/**',
        'src/pages/**',
        'next.config.js',
        'app/**/{head,layout,page,error,not-found}.tsx',
        'src/app/**/{head,layout,loading,page,error,not-found}.tsx',
        'src/app/**/*.page.tsx',
      ],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
  parserOptions: {
    projectService: true,
    tsconfigRootDir: path.join(__dirname, "../..")
  },
  root: true,
  rules
};
