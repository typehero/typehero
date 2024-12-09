module.exports = {
  rules: {
    '@typescript-eslint/consistent-type-imports': ['warn', { disallowTypeAnnotations: false }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/sort-type-constituents': 'warn',
    '@typescript-eslint/switch-exhaustiveness-check': ['error', { considerDefaultExhaustiveForUnions: true }],
    'import/no-named-as-default': 'off',
    'react/no-unescaped-entities': 'off',
    'react/no-unknown-property': 'off',
    'unicorn/filename-case': 'off',

    // Pending https://github.com/vercel/style-guide/issues/115
    // (the new rule is more permissive around description comments)
    'eslint-comments/require-description': 'off',

    // Pending https://github.com/typescript-eslint/typescript-eslint/issues/9057
    "@typescript-eslint/use-unknown-in-catch-callback-variable": "off",

    // Rules below here can be re-enabled when the team wants to address them.
    // When this repo was first monorepo'ed and given tighter checks,
    // there were too many issues to address all at once.
    // They are organized into groups based on what type of warning they are.
    // ---
    // Potential Bugs
    '@typescript-eslint/no-confusing-void-expression': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-enum-comparison': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    camelcase: 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    'no-await-in-loop': 'off',
    'no-param-reassign': 'off',
    'no-constant-binary-expression': 'off',
    'import/no-cycle': 'off',
    'import/order': 'off',
    'tsdoc/syntax': 'off',
    'react/no-array-index-key': 'off',
    'react/no-unstable-nested-components': 'off',
    'react/function-component-definition': 'off',
    eqeqeq: 'off',
    'no-control-regex': 'off',
    'no-return-await': 'off',

    // Best practice/readability
    // Some of these might be opinions.
    // You can ignore if you'd like.
    'prefer-named-capture-group': 'off',
    'prefer-regex-literals': 'off',
    '@typescript-eslint/consistent-indexed-object-style': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    'import/no-default-export': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    'react/jsx-no-useless-fragment': 'off',
    'no-nested-ternary': 'off',
    'react/jsx-sort-props': 'off',
    'react/hook-use-state': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    'func-names': 'off',
    'no-console': 'off',

    // a11y
    'jsx-a11y/html-has-lang': 'off',
    'jsx-a11y/no-redundant-roles': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/anchor-has-content': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/heading-has-content': 'off',
    'react/button-has-type': 'off',
  },
};
