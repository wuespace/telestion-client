const path = require('path');

module.exports = {
	root: true,
	globals: {
		// global TypeScript namespace
		TelestionClient: 'readonly'
	},
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: [path.join(__dirname, 'tsconfig.json')]
	},
	extends: [
		path.join(
			__dirname,
			'..',
			'..',
			'..',
			'base-configs',
			'eslint.typescript.js'
		)
	],
	rules: {
		'no-unused-vars': 'off',
		'@typescript-eslint/no-namespace': 'off',
		'@typescript-eslint/no-unused-vars': 'off'
	},
	ignorePatterns: ['sample', 'types']
};
