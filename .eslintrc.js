module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ['./tsconfig.eslint.json', './packages/*/tsconfig.json']
	},
	plugins: ['@typescript-eslint', 'jest', 'prettier'],
	extends: [
		'airbnb-typescript',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:jest/recommended',
		'prettier',
		'prettier/@typescript-eslint',
		'plugin:prettier/recommended'
	],
	rules: {
		// Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
		'no-prototype-builtins': 'off',
		'no-bitwise': 'warn',
		// Use function hoisting to improve code readability
		'no-use-before-define': [
			'error',
			{ functions: false, classes: true, variables: true }
		],
		// Makes no sense to allow type inference for expression parameters, but require typing the response
		'@typescript-eslint/explicit-function-return-type': [
			'error',
			{ allowExpressions: true, allowTypedFunctionExpressions: true }
		],
		'@typescript-eslint/no-use-before-define': [
			'error',
			{ functions: false, classes: true, variables: true, typedefs: true }
		]
	}
};
