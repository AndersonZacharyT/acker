module.exports = {
    parserOptions: {
        ecmaVersion: 2018
    },
    env: {
        es6: true,
        node: true,
        mocha: true
    },
    globals: {
        sinon: true,
        expect: true,
        MockAdapter: true
    },
    plugins: ['prettier', 'mocha'],
    extends: [
        'eslint:recommended',
        'eslint-config-prettier'
    ],
    rules: {
        'mocha/no-exclusive-tests': 'error',
        'prettier/prettier': 'warn',
        'no-console': 'off',
        'newline-per-chained-call': 'error'
    },
    overrides: [
        {
            files: "*.test.js",
            rules: {
                "no-unused-expressions": "off"
            }
        }
    ]
}
