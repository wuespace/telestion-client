module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		commonjs: true,
		es2020: true
	},
	plugins: ['prettier'],
	extends: ['eslint:recommended', 'prettier', 'plugin:prettier/recommended'],
	parserOptions: {
		ecmaVersion: 11,
		sourceType: 'script'
	},
	rules: {
		// Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
		'no-prototype-builtins': 'off',
		'no-bitwise': 'warn',
		// why not?
		'no-plusplus': 'off',
		// Use function hoisting to improve code readability
		'no-use-before-define': [
			'error',
			{ functions: false, classes: true, variables: true }
		],
		// treat wrong format as warning instead of error
		// to inform the user and not slap him
		'prettier/prettier': 'warn'
	},
	ignorePatterns: ['.eslintrc.js', 'rollup.*.js', 'docs'],
	overrides: [
		{
			files: ['*/**/rollup.*.js'],
			parserOptions: {
				sourceType: 'module'
			},
			rules: {}
		}
	]
};
