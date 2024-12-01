module.exports = {
    overrides: [
        {
            files: ['*.cjs', '*.js', '*.mjs'],
            parser: '@typescript-eslint/parser',
        },
        {
            extends: ['plugin:@typescript-eslint/disable-type-checked'],
            files: ['**/.eslintrc.*'],
        },
    ]
};
