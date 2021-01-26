const path = require('path');

module.exports = {
	root: true,
	extends: [path.join(__dirname, '..', '..', 'base-configs', 'eslint.base.js')],
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
