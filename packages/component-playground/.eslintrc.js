const path = require('path');

module.exports = {
	root: true,
	globals: {
		// @wuespace/telestion-client-types namespace
		TelestionClient: 'readonly'
	},
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: [path.join(__dirname, 'tsconfig.json')]
	},
	extends: [
		path.join(__dirname, '..', '..', 'base-configs', 'eslint.react.js')
	],
	rules: {
		'jsdoc/require-jsdoc': 'off'
	}
};
