// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
	root: true,
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: [path.join(__dirname, 'tsconfig.json')]
	},
	extends: [
		path.join(__dirname, '..', '..', '.eslintrc.typescript.js')
	],
	rules: {
		'@typescript-eslint/no-namespace': 'off',
		'@typescript-eslint/no-unused-vars': 'off'
	},
	ignorePatterns: [
		path.join(__dirname, 'types'),
		path.join(__dirname, 'sample')
	]
};
