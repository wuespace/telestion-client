const path = require('path');

module.exports = {
	root: true,
	globals: {
		NodeJS: 'readonly'
	},
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: [path.join(__dirname, 'tsconfig.json')]
	},
	extends: [path.join(__dirname, '..', '..', '.eslintrc.typescript.js')]
};
