module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		commonjs: true,
		es2020: true
	},
	globals: {
		NodeJS: 'readonly'
	},
	plugins: ['jest', 'prettier'],
	extends: [
		'eslint:recommended',
		'plugin:jest/recommended',
		'prettier',
		'plugin:prettier/recommended'
	],
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
		// allow voids as statements
		// https://eslint.org/docs/rules/no-void
		'no-void': [
			'error',
			{
				allowAsStatement: true
			}
		],
		// treat wrong format as warning instead of error
		// to inform the user and not slap him
		'prettier/prettier': 'warn',
		'max-lines': ['warn', { max: 250 }],
		'max-lines-per-function': ['warn', 50]
	},
	ignorePatterns: [
		'.eslintrc.js',
		'rollup.*.js',
		'jest.*.js',
		'docs',
		'types.d.ts'
	],
	overrides: [
		{
			files: ['*/**/rollup.*.js'],
			parserOptions: {
				sourceType: 'module'
			},
			rules: {}
		},
		{
			files: ['*/**/*.spec.ts', '*/**/*.spec.js'],
			rules: {
				'max-lines': 0,
				'max-lines-per-function': 0,
				'import/no-extraneous-dependencies': 0
			}
		}
	]
};
