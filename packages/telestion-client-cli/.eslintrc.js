const path = require('path');

module.exports = {
	root: true,
	extends: [path.join(__dirname, '..', '..', '.eslintrc.js')],
	rules: {},
	overrides: [
		{
			files: ['bin'],
			rules: {
				strict: 'off'
			}
		}
	]
};
