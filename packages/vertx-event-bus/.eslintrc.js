const path = require('path');

module.exports = {
	root: true,
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: [path.join(__dirname, 'tsconfig.json')]
	},
	extends: [
		path.join(__dirname, '..', '..', 'base-configs', 'eslint.typescript.js')
	],
	overrides: [
		{
			files: ['**/tests/lib/**/*', '**/tests/samples/**/*'],
			rules: {
				'jest/no-export': 'off',
				'import/no-extraneous-dependencies': 'off'
			}
		}
	]
};
